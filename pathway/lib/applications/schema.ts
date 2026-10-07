import type { Attribution } from "../attribution";

/** Application data model. Destination-agnostic (CRM / email / DB chosen later). */
export interface ApplicationData {
  applicant: "player" | "guardian";
  fullName: string; footballCategory?: string; dateOfBirth: string; nationality: string; residence: string; email: string; whatsapp?: string;
  guardian?: { name: string; relationship: string; email: string; phone?: string; consent: boolean };
  positions: string[]; height?: string; foot?: string; currentClub?: string; level: string; previousClubs?: string; minutesLastSeason?: string; nationalTeam?: string;
  education?: { status: string; college?: string; division?: string; eligibilityYears?: string; graduation?: string };
  contractStatus: string; contractEnds?: string; offers?: string; hasAgent: string;
  fullMatchUrl?: string; highlightsUrl?: string; transfermarktUrl?: string; instagram?: string;
  passports: string[]; ancestry?: string;
  objective: string; lookingFor?: string; targetCountries: string[]; availableFrom?: string; relocation?: string; budget?: string;
  consents: { terms: boolean; assessmentData: boolean; agencyView: boolean; marketing: boolean };
}

export interface ApplicationSubmission {
  id: string;
  data: ApplicationData;
  triage: TriageResult;
  attribution: Attribution;
  submittedAt: string;
  siteMode: string;
  /** Matched acquisition campaign (lib/campaigns.ts), if any. */
  campaign?: string;
  /** Earlier application ID from this device with the same email, if any. */
  duplicateOf?: string;
}

export type TriageRoute = "accepted" | "needs_full_match" | "guardian_payment" | "under_16" | "not_now";
export interface TriageResult { route: TriageRoute; age: number | null; reasons: string[] }
