/** Unit tests for the 7-day rule and state model (founder cases A–F). Run: npm run test:status */
import { assessmentDeadline, currentState, type AssessmentRecord } from "../lib/assessment-status.ts";

let fail = 0;
const t = (name: string, ok: boolean, info = "") => { console.log(`${ok ? "PASS" : "FAIL"} — ${name}${info ? `  (${info})` : ""}`); if (!ok) fail++; };
const P = "2026-10-01T10:00:00.000Z", M = "2026-10-02T10:00:00.000Z", R = "2026-10-03T09:00:00.000Z", S = "2026-10-04T12:00:00.000Z";

// Case A: payment + onboarding submitted + insufficient materials → no deadline
const A: AssessmentRecord = { paymentReceivedAt: P, materialsSubmittedAt: M, reviewStartedAt: R, additionalInfoRequestedAt: S, additionalInfoItems: ["Recent playing history"] };
t("A: paid + submitted + insufficient → NO deadline", !assessmentDeadline(A).started && currentState(A) === "additional_information_required", currentState(A));
// Case B: no Transfermarkt, other materials sufficient → starts only after team confirms
const Bpre: AssessmentRecord = { paymentReceivedAt: P, materialsSubmittedAt: M };
const B: AssessmentRecord = { ...Bpre, reviewStartedAt: R, sufficientConfirmedAt: S };
t("B: no Transfermarkt, before confirmation → no deadline", !assessmentDeadline(Bpre).started && currentState(Bpre) === "materials_under_review");
t("B: after Concordia confirms sufficiency → deadline starts", assessmentDeadline(B).started && assessmentDeadline(B).startDate === S);
// Case C: no highlight video, sufficient full-match/profile info → starts after confirmation
const C: AssessmentRecord = { paymentReceivedAt: P, materialsSubmittedAt: M, sufficientConfirmedAt: S };
t("C: no highlights, confirmed sufficient → deadline can start", assessmentDeadline(C).started);
// Case D: footage uploaded but essential info missing → no deadline
const D: AssessmentRecord = { paymentReceivedAt: P, materialsSubmittedAt: M, additionalInfoRequestedAt: S, additionalInfoItems: ["Date of birth", "Current club or status"] };
t("D: footage but essential info missing → NO deadline", !assessmentDeadline(D).started && currentState(D) === "additional_information_required");
// Case E: materials sufficient but payment not received → no start
const E: AssessmentRecord = { materialsSubmittedAt: M, sufficientConfirmedAt: S };
t("E: sufficient but unpaid → NO assessment start", !assessmentDeadline(E).started && currentState(E) !== "assessment_in_progress", currentState(E));
// Case F: paid + confirmed sufficient → starts, target = start + 7 days
const F: AssessmentRecord = { paymentReceivedAt: P, materialsSubmittedAt: M, sufficientConfirmedAt: S };
const dF = assessmentDeadline(F);
t("F: paid + sufficient → assessment in progress, target = +7 days", dF.started && currentState(F) === "assessment_in_progress" && (new Date(dF.targetDate!).getTime() - new Date(S).getTime()) === 7 * 86400000, `${dF.startDate?.slice(0, 10)} → ${dF.targetDate?.slice(0, 10)}`);
// Extra: onboarding submitted alone never starts the clock; resubmission after info request goes back to review
t("Onboarding submission alone never starts the clock", !assessmentDeadline({ paymentReceivedAt: P, materialsSubmittedAt: M }).started);
const resub: AssessmentRecord = { ...D, materialsSubmittedAt: "2026-10-05T08:00:00.000Z" };
t("Resubmission after info request → back under review, still no deadline", currentState(resub) === "materials_under_review" && !assessmentDeadline(resub).started);
t("Ready → call → next steps", currentState({ ...F, assessmentReadyAt: "2026-10-09T00:00:00Z" }) === "assessment_ready" && currentState({ ...F, assessmentReadyAt: "x", callCompletedAt: "y" }) === "next_steps");
// G–J: third condition — performance legally permitted (withdrawal period / express early-start request)
const NOW = "2026-10-06T00:00:00.000Z", LATER = "2026-10-15T10:00:00.000Z";
const G: AssessmentRecord = { ...F, performancePermittedAt: LATER };
t("G: paid + sufficient, no early start, withdrawal period running → NOT started, awaiting start", !assessmentDeadline(G, NOW).started && currentState(G, NOW) === "awaiting_start");
t("G: once the withdrawal period ends → starts on that date, target +7 days", assessmentDeadline(G, "2026-10-16T00:00:00.000Z").startDate === LATER && currentState(G, "2026-10-16T00:00:00.000Z") === "assessment_in_progress");
const H: AssessmentRecord = { ...F, performancePermittedAt: P };
t("H: early start requested at payment → starts at sufficiency confirmation (no 14-day wait)", assessmentDeadline(H, NOW).started && assessmentDeadline(H, NOW).startDate === S);
const I: AssessmentRecord = { ...F, withdrawnAt: "2026-10-05T00:00:00.000Z" };
t("I: customer withdrew → no deadline, state withdrawn", !assessmentDeadline(I, NOW).started && currentState(I, NOW) === "withdrawn");
const J: AssessmentRecord = { paymentReceivedAt: P, materialsSubmittedAt: M, performancePermittedAt: P };
t("J: permitted + paid but sufficiency not confirmed → NO deadline", !assessmentDeadline(J, NOW).started);
if (fail) { console.error(`✖ ${fail} status test(s) failed`); process.exit(1); }
console.log("✓ Assessment status rules passed");
