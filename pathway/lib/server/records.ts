/**
 * APPLICATION RECORDS — the persistent source of truth for the whole funnel.
 * Lifecycle timestamps mirror lib/assessment-status.ts (AssessmentRecord) so the status model and the 7-day rule
 * are computed from server data only. Payment fields are written ONLY by the verified Stripe webhook.
 */
import crypto from "node:crypto";
import { store, update } from "./store";
import type { ApplicationData, TriageResult } from "../applications/schema";
import type { Attribution } from "../attribution";
import { currentState, assessmentDeadline, type AssessmentRecord } from "../assessment-status";
import type { TaxCode } from "../tax";

export interface EmailLog { at: string; template: string; to: string[]; ok: boolean; id?: string; error?: string }
export interface FileRef { key: string; name: string; size: number; type: string; field: string }
export interface MaterialsSubmission { at: string; values: Record<string, string>; notAvailable: string[]; files: FileRef[]; healthConsent: boolean }
export interface Note { at: string; text: string }
export interface TimelineEvent { at: string; type: string; detail?: string }

export interface PaymentInfo {
  status: "checkout_open" | "paid" | "failed" | "expired" | "refunded" | "disputed";
  checkoutSessionId?: string; paymentIntentId?: string; customerId?: string; invoiceId?: string;
  amount?: number; currency?: string; paidAt?: string;
  /** Tax evidence: what the customer declared + what the payment provider reported. */
  declaredCountry?: string; billingCountry?: string; cardCountry?: string; requestCountry?: string;
  buyerType?: "consumer" | "business"; businessName?: string; vatId?: string; vatIdChecked?: boolean; vatIdValid?: boolean;
  taxCode?: TaxCode; vatRate?: number; vatAmount?: number; countryMismatch?: boolean;
  payerName?: string; payerEmail?: string; isGuardianPayer?: boolean;
  earlyStartRequested?: boolean; withdrawalEndsAt?: string;
  consents?: { key: string; at: string; version: string }[];
}

export interface SubscriptionInfo {
  status: "checkout_open" | "active" | "past_due" | "cancelled" | "incomplete" | "unpaid";
  checkoutSessionId?: string; subscriptionId?: string; customerId?: string;
  startedAt?: string; currentPeriodEnd?: string; cancelAt?: string; cancelledAt?: string; lastInvoicePaidAt?: string; lastPaymentFailedAt?: string;
  consents?: { key: string; at: string; version: string }[];
}

export interface CreditInfo { amountCents: number; couponId?: string; expiresAt?: string; usedAt?: string; voidedAt?: string; voidReason?: string }

export interface ApplicationRecord extends AssessmentRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  data: ApplicationData;
  triage: TriageResult;
  attribution: Attribution;
  campaign?: string;
  duplicateOf?: string[];
  isMinor: boolean;
  /** Where service emails go: the guardian for under-18s (player copied), otherwise the player. */
  contact: { name: string; firstName: string; emails: string[] };
  consents: { key: string; at: string; version: string }[];
  materials: MaterialsSubmission[];
  payment?: PaymentInfo;
  subscription?: SubscriptionInfo;
  credit?: CreditInfo;
  pathwayOfferedAt?: string;
  reportUrl?: string;
  bookingUrl?: string;
  notes: Note[];
  emails: EmailLog[];
  timeline: TimelineEvent[];
}

export const LEGAL_VERSION = "2026-10-07";
const KEY = (id: string) => `applications/${id}`;
const now = () => new Date().toISOString();

const FIRST_ID = 1001;

/** Best-effort, monotonic hint for the next free number (the record create below is what guarantees uniqueness). */
async function bumpCounter(next: number) {
  const kv = store();
  for (let i = 0; i < 3; i++) {
    const cur = await kv.getJSON<{ next: number }>("meta/counter");
    if (!cur) { if (await kv.setJSON("meta/counter", { next }, { onlyIfNew: true })) return; continue; }
    if (cur.data.next >= next || (await kv.setJSON("meta/counter", { next }, { etag: cur.etag }))) return;
  }
}

const emailKey = (e: string) => `index/email/${crypto.createHash("sha256").update(e.trim().toLowerCase()).digest("hex").slice(0, 32)}`;

export async function createApplication(input: Omit<ApplicationRecord, "id" | "createdAt" | "updatedAt" | "duplicateOf" | "materials" | "notes" | "emails" | "timeline">): Promise<ApplicationRecord> {
  const kv = store();
  const at = now();
  // Duplicate detection (server-side, by email) — flagged for the reviewer, never blocks an application.
  const idx = await kv.getJSON<{ ids: string[] }>(emailKey(input.data.email));
  const duplicateOf = idx?.data.ids.length ? [...idx.data.ids] : undefined;
  const rec: ApplicationRecord = { ...input, id: "", createdAt: at, updatedAt: at, duplicateOf, materials: [], notes: [], emails: [], timeline: [{ at, type: "application_received" }] };
  // IDs are claimed by creating the record only if that key is new: concurrent submissions never share an ID;
  // a lost race simply moves on to the next number.
  let n = Math.max(FIRST_ID, (await kv.getJSON<{ next: number }>("meta/counter"))?.data.next ?? FIRST_ID);
  for (let i = 0; ; i++, n++) {
    if (i >= 200) throw new Error("Could not allocate an application ID");
    rec.id = `CS-${n}`;
    if (await kv.setJSON(KEY(rec.id), rec, { onlyIfNew: true })) break;
  }
  await bumpCounter(n + 1);
  const ek = emailKey(input.data.email);
  for (let i = 0; i < 8; i++) {
    const cur = await kv.getJSON<{ ids: string[] }>(ek);
    const ids = [...new Set([...(cur?.data.ids ?? []), rec.id])];
    if (await kv.setJSON(ek, { ids }, cur ? { etag: cur.etag } : { onlyIfNew: true })) break;
  }
  return rec;
}

export async function getApplication(id: string): Promise<ApplicationRecord | null> {
  return (await store().getJSON<ApplicationRecord>(KEY(id)))?.data ?? null;
}

export async function updateApplication(id: string, fn: (r: ApplicationRecord) => ApplicationRecord | void, event?: { type: string; detail?: string }): Promise<ApplicationRecord> {
  return update<ApplicationRecord>(KEY(id), (r) => {
    const next = fn(r) ?? r;
    next.updatedAt = now();
    if (event) next.timeline.push({ at: next.updatedAt, ...event });
    return next;
  });
}

export async function listApplications(): Promise<ApplicationRecord[]> {
  const keys = await store().list("applications/");
  const recs = await Promise.all(keys.map(async (k) => (await store().getJSON<ApplicationRecord>(k))?.data));
  return recs.filter((r): r is ApplicationRecord => Boolean(r)).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function logEmail(id: string, e: EmailLog) {
  try { await updateApplication(id, (r) => { r.emails.push(e); }); } catch { /* logging must never break a flow */ }
}

/** Marks a webhook event processed exactly once. Returns false if it was already processed. */
export async function claimEvent(eventId: string): Promise<boolean> {
  return store().setJSON(`events/${eventId}`, { at: now() }, { onlyIfNew: true });
}

export const stateOf = (r: ApplicationRecord) => currentState(r);
export const deadlineOf = (r: ApplicationRecord) => assessmentDeadline(r);
export const paid = (r: ApplicationRecord) => Boolean(r.paymentReceivedAt) && r.payment?.status === "paid";
