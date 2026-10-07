/** Consumer right of withdrawal — 14 days from contract conclusion (CRD Art. 9). */
import type { ApplicationRecord } from "./records";

export const WITHDRAWAL_DAYS = 14;

/** Whether the consumer withdrawal button is available for a contract right now. */
export function withdrawalOpen(r: ApplicationRecord, contract: "assessment" | "pathway", now: string): boolean {
  if (contract === "assessment") {
    if (!r.paymentReceivedAt || r.withdrawnAt || r.payment?.buyerType === "business") return false;
    if (r.callCompletedAt && r.payment?.earlyStartRequested) return false; // fully performed at express request (Art. 16(a))
    return Boolean(r.payment?.withdrawalEndsAt && now < r.payment.withdrawalEndsAt);
  }
  const s = r.subscription;
  if (!s?.startedAt || s.status === "cancelled" || r.payment?.buyerType === "business") return false;
  if ((r.withdrawals ?? []).some((w) => w.contract === "pathway")) return false;
  return now < new Date(new Date(s.startedAt).getTime() + WITHDRAWAL_DAYS * 86_400_000).toISOString();
}
