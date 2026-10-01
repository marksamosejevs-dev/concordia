/**
 * Evidence states mirror docs/FACTUAL_EVIDENCE_REGISTER.md.
 * confirmed — founder-confirmed or independently verified and approved for public use
 * document  — primary document seen, approved wording, may render
 * pending   — fact/wording not yet cleared (never renders in production)
 * hold      — asset/content held for consent or factual confirmation (never renders in production)
 */
export type EvidenceState = "confirmed" | "document" | "pending" | "hold";

export interface Evidence {
  state: EvidenceState;
  /** Register reference, e.g. "E13" */
  ref?: string;
  note?: string;
}

export const confirmed: Evidence = { state: "confirmed" };
export const pending = (ref: string, note?: string): Evidence => ({ state: "pending", ref, note });
export const hold = (ref: string, note?: string): Evidence => ({ state: "hold", ref, note });

export const isPublic = (e?: Evidence) => !e || e.state === "confirmed" || e.state === "document";
