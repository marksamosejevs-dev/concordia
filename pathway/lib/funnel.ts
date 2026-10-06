"use client";
/**
 * Pathway Assessment funnel state (client-side, per browser).
 * Application → acceptance (by email link) → payment → onboarding → materials → assessment → call.
 * No server exists in this static build: acceptance links are NOT signed and payments are preview-only.
 * These helpers keep the flow coherent for the applicant; the source of truth is the team's inbox (Netlify Forms).
 */
import type { Order } from "./commerce/types";
import type { CheckoutSession } from "./commerce/provider";

export const DAY = 86_400_000;
export const addDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * DAY).toISOString();
export const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—");

export interface PaidOrder { order: Order; session: CheckoutSession; paidAt?: string }
/** What this browser knows. Sufficiency, assessment start and the 7-day target are set ONLY by the team (see lib/assessment-status.ts). */
export interface MaterialsRecord { orderRef: string; submittedAt: string; firstSubmittedAt: string; submissions: number }
/** Payment counts only when the provider confirmed it ("paid"); preview never counts. */
export const paymentConfirmed = (o: PaidOrder | null) => o?.session.status === "paid";

const read = <T,>(k: string): T | null => { try { return JSON.parse(sessionStorage.getItem(k) || localStorage.getItem(k) || "null"); } catch { return null; } };
const write = (k: string, v: unknown) => { try { const s = JSON.stringify(v); sessionStorage.setItem(k, s); localStorage.setItem(k, s); } catch {} };

export const lastOrder = () => read<PaidOrder>("cs_last_order");
export const saveOrder = (o: PaidOrder) => write("cs_last_order", o);
export const materialsFor = (orderRef: string) => read<MaterialsRecord>(`cs_materials_${orderRef}`);
export const saveMaterials = (m: MaterialsRecord) => write(`cs_materials_${m.orderRef}`, m);

/** Acceptance arrives as an emailed link: /checkout/assessment/?a=APP-…  (unsigned until a backend issues tokens). */
export function acceptedApplicationId(): string | null {
  try { return new URLSearchParams(window.location.search).get("a"); } catch { return null; }
}

export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";
