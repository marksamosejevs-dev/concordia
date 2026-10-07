/**
 * Server-side validation for applications (the client validates too, but the server is authoritative).
 * Pure: no "@/" imports.
 */
import type { ApplicationData } from "./schema";
import { ageFrom } from "./triage";

import { RULES } from "../../content/business-rules.ts";

/** Minimum age (owner decision — see content/business-rules.ts) and the guardian age (age of majority). */
export const MIN_AGE = RULES.minimumAge.value;
export const GUARDIAN_UNDER = RULES.guardianUnder.value;
const s = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const arr = (v: unknown, max = 20) => (Array.isArray(v) ? v.map((x) => s(x, 80)).filter(Boolean).slice(0, max) : []);
const email = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const url = (v: string) => !v || /^https?:\/\/\S+\.\S+/i.test(v);

export function validateApplication(input: unknown): { ok: true; data: ApplicationData } | { ok: false; errors: Record<string, string> } {
  const i = (input ?? {}) as Record<string, unknown>;
  const e: Record<string, string> = {};
  const g = (i.guardian ?? null) as Record<string, unknown> | null;
  const c = (i.consents ?? {}) as Record<string, unknown>;
  const ed = (i.education ?? {}) as Record<string, unknown>;
  const data: ApplicationData = {
    applicant: i.applicant === "guardian" ? "guardian" : "player",
    fullName: s(i.fullName, 120), footballCategory: s(i.footballCategory, 40) || undefined, dateOfBirth: s(i.dateOfBirth, 10), nationality: s(i.nationality, 80), residence: s(i.residence, 80), email: s(i.email, 160).toLowerCase(), whatsapp: s(i.whatsapp, 40) || undefined,
    guardian: g ? { name: s(g.name, 120), relationship: s(g.relationship, 60), email: s(g.email, 160).toLowerCase(), phone: s(g.phone, 40) || undefined, consent: g.consent === true } : undefined,
    positions: arr(i.positions), height: s(i.height, 20) || undefined, foot: s(i.foot, 10) || undefined, currentClub: s(i.currentClub, 120) || undefined, level: s(i.level, 40), previousClubs: s(i.previousClubs, 1500) || undefined, minutesLastSeason: s(i.minutesLastSeason, 40) || undefined, nationalTeam: s(i.nationalTeam, 120) || undefined,
    education: { status: s(ed.status, 40), college: s(ed.college, 120) || undefined, division: s(ed.division, 40) || undefined, eligibilityYears: s(ed.eligibilityYears, 20) || undefined },
    contractStatus: s(i.contractStatus, 60), contractEnds: s(i.contractEnds, 10) || undefined, offers: s(i.offers, 1500) || undefined, hasAgent: s(i.hasAgent, 20),
    fullMatchUrl: s(i.fullMatchUrl, 500) || undefined, highlightsUrl: s(i.highlightsUrl, 500) || undefined, transfermarktUrl: s(i.transfermarktUrl, 500) || undefined, instagram: s(i.instagram, 200) || undefined,
    passports: arr(i.passports), ancestry: s(i.ancestry, 200) || undefined,
    objective: s(i.objective, 80), lookingFor: s(i.lookingFor, 2000) || undefined, targetCountries: arr(i.targetCountries, 25), availableFrom: s(i.availableFrom, 10) || undefined, relocation: s(i.relocation, 40) || undefined, budget: s(i.budget, 40) || undefined,
    consents: { terms: c.terms === true, assessmentData: true, agencyView: c.agencyView === true, marketing: c.marketing === true },
  };
  for (const [k, v] of [["fullName", data.fullName], ["dateOfBirth", data.dateOfBirth], ["nationality", data.nationality], ["residence", data.residence], ["email", data.email], ["level", data.level], ["contractStatus", data.contractStatus], ["hasAgent", data.hasAgent], ["objective", data.objective]] as const) if (!v) e[k] = "Required";
  if (!data.positions.length) e.positions = "Required";
  if (!data.passports.length) e.passports = "Required";
  if (data.email && !email(data.email)) e.email = "Invalid email";
  for (const k of ["fullMatchUrl", "highlightsUrl", "transfermarktUrl"] as const) if (!url(data[k] ?? "")) e[k] = "Invalid link";
  const age = ageFrom(data.dateOfBirth);
  if (data.dateOfBirth && (age === null || age > 60)) e.dateOfBirth = "Invalid date of birth";
  if (age !== null && age < MIN_AGE) e.dateOfBirth = `We offer Pathway Assessments from age ${MIN_AGE}`;
  if (age !== null && age < GUARDIAN_UNDER) {
    if (!data.guardian?.name) e.guardianName = "Required";
    if (!data.guardian?.relationship) e.guardianRelationship = "Required";
    if (!data.guardian?.email || !email(data.guardian.email)) e.guardianEmail = "Required";
    if (!data.guardian?.consent) e.guardianConsent = "A parent or legal guardian must consent";
  } else data.guardian = data.guardian?.name ? data.guardian : undefined;
  if (!data.consents.terms) e.cTerms = "Required";
  return Object.keys(e).length ? { ok: false, errors: e } : { ok: true, data };
}
