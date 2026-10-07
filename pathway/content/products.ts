import type { Product } from "@/lib/commerce/types";

/**
 * The ONLY two products: Pathway Assessment $249 (one time) → European Pathway $399/month.
 * The retired fixed-term programmes were removed from the model in the production-readiness pass.
 */
export const products: Product[] = [
  { id: "assessment", slug: "assessment", name: "Pathway Assessment", term: "One time", billingType: "one_time", price: 249, assessmentCreditEligible: false, affiliateEligible: true, access: "application_required", cancellationPolicyRef: "refunds", catalogue: "core" },
  { id: "pathway", slug: "european-pathway", name: "European Pathway", term: "Monthly · designed as a 6-month pathway", billingType: "recurring", price: 399, billingInterval: "month", termMonths: 6, assessmentCreditEligible: true, renewalBehaviour: "auto_renew", affiliateEligible: true, access: "assessment_required", cancellationPolicyRef: "pathway-terms", catalogue: "core" },
];

export const product = (id: string) => products.find((p) => p.id === id)!;

/** $150 of the $249 assessment fee is credited toward the FIRST European Pathway payment — once, within `days` days after the consultation call. ⚑ window: owner confirmation. */
export const ASSESSMENT_CREDIT = { amount: 150, days: 14 };
