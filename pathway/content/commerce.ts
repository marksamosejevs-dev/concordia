/**
 * Commercial wording used at checkout, on product pages, in emails and in the Terms — one source.
 * Mirrors content/legal.ts. Change here and every surface changes together.
 */
import { ASSESSMENT_CREDIT } from "./products";

export const REFUND_LINE = "Except where a refund is required by applicable mandatory law, the Pathway Assessment fee is non-refundable once paid.";
export const REFUND_WHY = "The fee reserves professional capacity for the player and pays for the review of their information and materials and the preparation of an individual assessment.";
export const CREDIT_LINE = `If you continue into the European Pathway after your assessment, $${ASSESSMENT_CREDIT.amount} of your Pathway Assessment fee is credited toward your first monthly Pathway payment.`;
export const CREDIT_MATH = "First Pathway payment: $399 less the $150 assessment credit = $249. Then $399/month.";
export const CREDIT_WINDOW = `The credit can be used once${ASSESSMENT_CREDIT.expiryDays ? `, within ${ASSESSMENT_CREDIT.expiryDays} days after your consultation call` : ""}, only for the European Pathway of the same player whose assessment was paid. It is a credit, not cash: it is not a refund and can’t be paid out, withdrawn or transferred.`;
export const SUBSCRIPTION_LINES = ["Designed as a 6-month European career pathway. Paid monthly.", "No six-month upfront payment.", "Cancellation options available — subscription terms apply."];
export const CONTRACT_REVIEW_LINE = "Review of professional football contracts and football-related documents within the scope of the service, with local counsel involved where jurisdiction-specific advice is required.";
