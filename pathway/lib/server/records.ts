/**
 * APPLICATION RECORDS — the persistent source of truth for the whole funnel.
 * Lifecycle timestamps mirror lib/assessment-status.ts (AssessmentRecord) so the status model and the 7-day rule
 * are computed from server data only. Payment fields are written ONLY by the verified Stripe webhook.
 */
import crypto from "node:crypto";
import { parsePlayerToken } from "./tokens";
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
  /** amount the checkout was created for (cents) — the webhook verifies the paid amount against it */
  expectedAmount?: number;
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

export interface CreditInfo { amountCents: number; couponId?: string; issuedAt?: string; /** only set if a commercial window is configured */ expiresAt?: string; usedAt?: string; voidedAt?: string; voidReason?: string }

export interface ApplicationRecord extends AssessmentRecord {
  id: string;
  /** bumped when the admin re-issues the player link (revokes older links) */
  linkVersion?: number;
  /** random token written at creation to verify ID ownership */
  claim?: string;
  /** set when personal data was erased on request (GDPR Art. 17); only accounting references remain */
  erasedAt?: string;
  withdrawals?: { contract: "assessment" | "pathway"; at: string; statement: string }[];
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
    rec.claim = crypto.randomUUID();
    if (!(await kv.setJSON(KEY(rec.id), rec, { onlyIfNew: true }))) continue;
    // Defence in depth: confirm the stored record is ours (guards against a store without atomic conditional writes).
    await new Promise((res) => setTimeout(res, 25));
    if ((await kv.getJSON<ApplicationRecord>(KEY(rec.id)))?.data.claim === rec.claim) break;
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

/** Loads the application a signed player link points to; null if the signature is wrong OR the link was revoked. */
export async function recordFromToken(t: string | null | undefined): Promise<ApplicationRecord | null> {
  const p = parsePlayerToken(t);
  if (!p) return null;
  const r = await getApplication(p.id);
  return r && (r.linkVersion ?? 1) === p.version ? r : null;
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

/**
 * GDPR erasure: removes uploaded files, the duplicate-email index entry and all personal data from the record.
 * Keeps a tombstone with the reference, timeline and payment/invoice identifiers that accounting law requires.
 */
export async function eraseApplication(id: string): Promise<ApplicationRecord> {
  const kv = store();
  const r = await getApplication(id);
  if (!r) throw new Error(`Not found: ${id}`);
  for (const key of await kv.list(`files/${id}/`)) await kv.delete(key);
  const ek = emailKey(r.data.email);
  for (let i = 0; i < 8; i++) {
    const cur = await kv.getJSON<{ ids: string[] }>(ek);
    if (!cur) break;
    if (await kv.setJSON(ek, { ids: cur.data.ids.filter((x) => x !== id) }, { etag: cur.etag })) break;
  }
  const at = now();
  return update<ApplicationRecord>(KEY(id), (x) => {
    const p = x.payment;
    return {
      ...x,
      data: { ...x.data, fullName: "[erased]", email: "", dateOfBirth: "", nationality: "", residence: "", whatsapp: undefined, guardian: undefined, previousClubs: undefined, offers: undefined, lookingFor: undefined, fullMatchUrl: undefined, highlightsUrl: undefined, transfermarktUrl: undefined, instagram: undefined, ancestry: undefined, currentClub: undefined, passports: [] },
      contact: { name: "[erased]", firstName: "", emails: [] }, attribution: {}, materials: [], notes: [], emails: [], reportUrl: undefined, bookingUrl: undefined, withdrawals: x.withdrawals?.map((w) => ({ ...w, statement: "" })),
      payment: p ? { status: p.status, checkoutSessionId: p.checkoutSessionId, paymentIntentId: p.paymentIntentId, invoiceId: p.invoiceId, customerId: p.customerId, amount: p.amount, currency: p.currency, paidAt: p.paidAt, taxCode: p.taxCode, vatAmount: p.vatAmount, declaredCountry: p.declaredCountry } : undefined,
      erasedAt: at, linkVersion: (x.linkVersion ?? 1) + 1, updatedAt: at, timeline: [...x.timeline, { at, type: "personal_data_erased" }],
    };
  });
}

/** Full JSON export of every application (admin backup / migration / data-subject access). */
export async function exportAll(): Promise<{ exportedAt: string; count: number; applications: ApplicationRecord[] }> {
  const applications = await listApplications();
  return { exportedAt: now(), count: applications.length, applications };
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
