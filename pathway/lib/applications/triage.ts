import type { ApplicationData, TriageResult } from "./schema";

export function ageFrom(dob: string, now = new Date()): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
}

/** Rules-based instant triage (Phase 1 §12). Human review can override later. */
export function triage(data: ApplicationData): TriageResult {
  const age = ageFrom(data.dateOfBirth);
  const reasons: string[] = [];
  if (age !== null && age < 16) return { route: "under_16", age, reasons: ["Under 16: education route only."] };
  if (!data.fullMatchUrl) return { route: "needs_full_match", age, reasons: ["A full match is required for an assessment."] };
  if (data.level === "Not currently playing" && data.objective === "Not sure") {
    return { route: "not_now", age, reasons: ["Not currently playing and no objective yet."] };
  }
  if (age !== null && age < 18) return { route: "guardian_payment", age, reasons: ["Under 18: a parent or guardian completes payment."] };
  return { route: "accepted", age, reasons };
}
