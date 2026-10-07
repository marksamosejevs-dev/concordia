/**
 * BUSINESS RULES — one place for every commercial rule the system enforces, each marked with its status:
 *  - "legal"      required by law (cannot be changed by the owner);
 *  - "confirmed"  approved by the owner;
 *  - "proposed"   a sensible default implemented so the system works, NOT yet owner-approved.
 * Policies, checkout copy, emails and the admin all read from here. A production-mode build fails while any
 * rule is still "proposed" (scripts/check-content.mts). Pure module: no "@/" imports.
 */
export type RuleStatus = "legal" | "confirmed" | "proposed";
export interface Rule<T> { value: T; status: RuleStatus; label: string; note: string }

export type CancellationMode = "end_of_paid_month" | "minimum_term";
export type PriceModel = "final_price_everywhere" | "base_price_plus_vat";

export const RULES = {
  creditExpiryDays: {
    value: null as number | null, status: "confirmed", label: "$150 assessment credit — eligibility window",
    note: "No expiry (owner, 7 Oct 2026). Single use, tied to the paid assessment, not cash. A window can be set here later.",
  } as Rule<number | null>,
  cancellation: {
    value: { mode: "end_of_paid_month" as CancellationMode, minimumMonths: 0 }, status: "proposed", label: "European Pathway — cancellation",
    note: "Proposed default: cancel online, effective at the end of the paid month; no minimum term. Options A/B/C in docs/PRODUCTION_SETUP.md.",
  } as Rule<{ mode: CancellationMode; minimumMonths: number }>,
  minimumAge: {
    value: 16, status: "proposed", label: "Minimum player age to apply",
    note: "Proposed default 16. Under 18 the parent/guardian applies, contracts, pays and receives communications (that part follows from contractual capacity and is not optional).",
  } as Rule<number>,
  guardianUnder: {
    value: 18, status: "legal", label: "Parent/guardian contracts and pays below this age",
    note: "Age of majority (Latvian Civil Law; most US states). Not an owner choice.",
  } as Rule<number>,
  priceModel: {
    value: "final_price_everywhere" as PriceModel, status: "proposed", label: "Price and VAT model",
    note: "Proposed: $249 / $399 are the final price everywhere (VAT included where it applies). Alternative: base price + Latvian VAT where it applies. Both are supported by the code.",
  } as Rule<PriceModel>,
} as const;

export const pendingRules = () => Object.entries(RULES).filter(([, r]) => r.status === "proposed").map(([key, r]) => ({ key, ...r }));
