/**
 * PATHWAY ASSESSMENT — status model (single source of truth for states and the 7-day rule).
 * Pure module: no browser APIs, no "@/" imports (unit-tested by scripts/test-assessment-status.mts).
 *
 * CANONICAL DEADLINE TRIGGER
 *   The 7-day assessment period starts only when BOTH are confirmed:
 *     1. payment received, AND
 *     2. Concordia has confirmed the materials are sufficient for THAT player's assessment.
 *     3. Concordia is legally permitted to begin performance: for a consumer, either an express request to start
 *        within the 14-day withdrawal period (recorded consent) or the end of that period; businesses: immediately.
 *   Start date = the LATEST of the three dates.
 *   Nothing is inferred from individual fields (video, Transfermarkt, …) or from the
 *   onboarding form being submitted. Sufficiency is a human team decision.
 */

export type AssessmentState =
  | "application_received" | "accepted_for_assessment" | "not_accepted"
  | "payment_received" | "materials_requested" | "materials_submitted" | "materials_under_review"
  | "additional_information_required" | "materials_sufficient" | "assessment_in_progress"
  | "assessment_ready" | "call_to_be_scheduled" | "call_completed" | "next_steps" | "awaiting_start" | "withdrawn";

/** Customer-facing labels — simpler than the internal names where that reads better. */
export const STATE_LABEL: Record<AssessmentState, string> = {
  application_received: "Application received",
  accepted_for_assessment: "Accepted for Pathway Assessment",
  not_accepted: "Not accepted at this stage",
  payment_received: "Payment received",
  materials_requested: "Send your profile + materials",
  materials_submitted: "Materials received",
  materials_under_review: "We’re checking your materials",
  additional_information_required: "Additional information required",
  materials_sufficient: "Materials confirmed",
  assessment_in_progress: "Assessment in progress",
  assessment_ready: "Your Pathway Assessment is ready",
  call_to_be_scheduled: "Book your 60-minute call",
  call_completed: "Call completed",
  next_steps: "Next steps",
  awaiting_start: "Materials confirmed — assessment starts after the withdrawal period",
  withdrawn: "Contract withdrawn",
};

export const ASSESSMENT_DAYS = 7;
const DAY = 86_400_000;

export interface AssessmentRecord {
  applicationId?: string;
  acceptedAt?: string;
  notAcceptedAt?: string;
  paymentReceivedAt?: string;     // set ONLY by a confirmed payment (Stripe webhook when live)
  materialsSubmittedAt?: string;  // latest onboarding submission
  reviewStartedAt?: string;       // team opened the materials review
  additionalInfoRequestedAt?: string;
  additionalInfoItems?: string[];
  sufficientConfirmedAt?: string; // TEAM decision — the only sufficiency signal
  /** When performance may lawfully begin (express early-start request time, or end of the withdrawal period). Undefined = no restriction recorded. */
  performancePermittedAt?: string;
  withdrawnAt?: string;
  assessmentReadyAt?: string;
  callScheduledAt?: string;
  callCompletedAt?: string;
}

export interface Deadline { started: boolean; startDate?: string; targetDate?: string; reason: string }

/** The 7-day rule. Pure and deterministic. */
export function assessmentDeadline(r: AssessmentRecord, now: string = new Date().toISOString()): Deadline {
  if (r.withdrawnAt) return { started: false, reason: "The customer withdrew from the contract." };
  if (!r.paymentReceivedAt) return { started: false, reason: "Payment has not been received." };
  if (!r.sufficientConfirmedAt) return { started: false, reason: r.additionalInfoRequestedAt && (!r.materialsSubmittedAt || r.materialsSubmittedAt <= r.additionalInfoRequestedAt) ? "Additional information required." : "Waiting for Concordia to confirm the materials are sufficient." };
  // Start = the latest of payment, sufficiency confirmation and the moment performance is legally permitted.
  const start = [r.paymentReceivedAt, r.sufficientConfirmedAt, r.performancePermittedAt ?? ""].sort().at(-1)!;
  if (start > now) return { started: false, reason: `Materials confirmed. The assessment can start on ${start.slice(0, 10)}, when the 14-day withdrawal period ends (no early start was requested).` };
  return { started: true, startDate: start, targetDate: new Date(new Date(start).getTime() + ASSESSMENT_DAYS * DAY).toISOString(), reason: "Payment received and materials confirmed sufficient." };
}

/** Current state from the record (latest milestone wins; sufficiency never inferred). */
export function currentState(r: AssessmentRecord, now: string = new Date().toISOString()): AssessmentState {
  if (r.notAcceptedAt) return "not_accepted";
  if (r.withdrawnAt) return "withdrawn";
  if (r.callCompletedAt) return "next_steps";
  if (r.assessmentReadyAt) return r.callScheduledAt ? "call_to_be_scheduled" : "assessment_ready";
  if (r.paymentReceivedAt && r.sufficientConfirmedAt) return r.performancePermittedAt && r.performancePermittedAt > now ? "awaiting_start" : "assessment_in_progress";
  if (r.sufficientConfirmedAt) return "materials_sufficient"; // sufficient but unpaid → no start
  if (r.additionalInfoRequestedAt && (!r.materialsSubmittedAt || r.materialsSubmittedAt <= r.additionalInfoRequestedAt)) return "additional_information_required";
  if (r.reviewStartedAt || (r.additionalInfoRequestedAt && r.materialsSubmittedAt)) return "materials_under_review";
  if (r.materialsSubmittedAt) return r.paymentReceivedAt ? "materials_under_review" : "materials_submitted";
  if (r.paymentReceivedAt) return "materials_requested";
  if (r.acceptedAt) return "accepted_for_assessment";
  return "application_received";
}

/** Customer journey, in order (used by the status screen). */
export const CUSTOMER_TIMELINE: AssessmentState[] = ["application_received", "accepted_for_assessment", "payment_received", "materials_submitted", "materials_under_review", "assessment_in_progress", "assessment_ready", "call_to_be_scheduled", "next_steps"];
