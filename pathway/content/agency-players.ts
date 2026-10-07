import { confirmed, type Evidence } from "@/lib/evidence";

/**
 * Players represented by Concordia Sports Agency — roster facts as supplied by the Agency
 * (see /data/players.ts in the Agency app). Agency credibility only: these players did not
 * necessarily use European Pathway. Pathway-site consent tracked under E11/E12.
 */
export interface AgencyPlayer { slug: string; name: string; nationality: string; position: string; club?: string; nationalTeam?: string; birthYear: number; photo: string; evidence: Evidence;
  /** Professional footballer (founder-confirmed in Round 7 for Ngai Eba, Boroviks, Ambaine, Gražis; the others are Latvian top-flight / internationals already counted as professional). */
  professional?: boolean }

const P = "/assets/pathway/photos/players/roster/";
export const agencyPlayers: AgencyPlayer[] = [
  { slug: "renars-varslavans", name: "Renārs Varslavāns", nationality: "LVA", position: "Attacking Midfield", club: "Riga FC", nationalTeam: "Latvia", birthYear: 2001, photo: P + "renars-varslavans.jpg", evidence: confirmed, professional: true },
  { slug: "glebs-zaleiko", name: "Gļebs Žaleiko", nationality: "LVA", position: "Central Midfield", club: "FS Jelgava", nationalTeam: "Latvia", birthYear: 2004, photo: P + "glebs-zaleiko.jpg", evidence: confirmed, professional: true },
  { slug: "maksims-semesko", name: "Maksims Semeško", nationality: "LVA", position: "Centre-Back", club: "FS Jelgava", nationalTeam: "Latvia U21", birthYear: 2004, photo: P + "maksims-semesko.jpg", evidence: confirmed, professional: true },
  { slug: "kristofers-rekis", name: "Kristofers Rēķis", nationality: "LVA", position: "Attacking Midfield", club: "FS Jelgava", nationalTeam: "Former Latvia U21", birthYear: 2003, photo: P + "kristofers-rekis.jpg", evidence: confirmed, professional: true },
  { slug: "emile-ngai-eba", name: "Emile Ngai Eba", nationality: "CMR", position: "Attacking Midfield", club: "FK Smiltene", birthYear: 2005, photo: P + "emile-ngai-eba.jpg", evidence: confirmed, professional: true },
  { slug: "algirdas-grazis", name: "Aļģirdas Gražis", nationality: "LVA", position: "Centre-Forward", club: "Riga Mariners", birthYear: 2003, photo: P + "algirdas-grazis.jpg", evidence: confirmed, professional: true },
  { slug: "savelijs-boroviks", name: "Savēlijs Boroviks", nationality: "LVA", position: "Right-Back", club: "FC RFS", nationalTeam: "Latvia U19", birthYear: 2008, photo: P + "savelijs-boroviks.jpg", evidence: confirmed, professional: true },
  { slug: "emilija-ambaine", name: "Emīlija Ambaine", nationality: "LVA", position: "Midfielder", club: "Sassuolo", nationalTeam: "Latvia U17", birthYear: 2010, photo: P + "emilija-ambaine.jpg", evidence: { state: "confirmed", ref: "E12", note: "Guardian publication permission confirmed by founder (Round 2); document held internally" }, professional: true },
];

/**
 * International status from verified roster data only (no caps invented).
 * Senior = the senior national team ("Latvia"); youth = any U-team (U17–U21), current or former.
 */
export type IntlLevel = "senior" | "youth";
export function intlStatus(p: AgencyPlayer): { level: IntlLevel; label: string } | null {
  const t = p.nationalTeam?.trim();
  if (!t) return null;
  if (/\bU\d{2}\b/.test(t)) return { level: "youth", label: `Youth international · ${t.replace(/^Former\s+/i, "")}${/^Former/i.test(t) ? " (former)" : ""}` };
  return { level: "senior", label: `Senior international · ${t}` };
}

/**
 * Professional clubs — derived from the roster: distinct current clubs of professional players.
 * Founder-stated total (Round 6/7): 8, including Emīlija Ambaine (U.S. Sassuolo). Until the roster records enough
 * current clubs to derive 8, the founder figure is shown; once the data reaches it, the derived count is used.
 * Never add a club to the roster just to make this match.
 */
export const PROFESSIONAL_CLUBS = { value: 8, evidence: { state: "confirmed", ref: "FS-R6", note: "Founder-stated total incl. Emīlija Ambaine / U.S. Sassuolo" } as Evidence };
export const professionalClubs = () => [...new Set(agencyPlayers.filter((p) => p.professional && p.club).map((p) => p.club as string))];
export const professionalClubCount = () => Math.max(professionalClubs().length, PROFESSIONAL_CLUBS.value);
