/** $150 assessment credit rules — pure (no "@/" imports), unit-tested by scripts/test-tax.mts. */
import { ASSESSMENT_CREDIT } from "../content/products.ts";

export interface CreditLike { usedAt?: string; voidedAt?: string; expiresAt?: string }

/** Expiry timestamp for a credit issued at `fromIso`, or undefined when no eligibility window is configured. */
export function creditExpiry(fromIso: string, days: number | null = ASSESSMENT_CREDIT.expiryDays): string | undefined {
  return days ? new Date(new Date(fromIso).getTime() + days * 86_400_000).toISOString() : undefined;
}

/** Usable = issued, not used, not voided (refund/dispute) and — only if an expiry was set — not expired. */
export function creditUsable(c: CreditLike | undefined | null, nowIso: string): boolean {
  return Boolean(c && !c.usedAt && !c.voidedAt && (!c.expiresAt || c.expiresAt > nowIso));
}
