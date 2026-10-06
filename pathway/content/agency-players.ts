import { confirmed, type Evidence } from "@/lib/evidence";

/**
 * Players represented by Concordia Sports Agency — roster facts as supplied by the Agency
 * (see /data/players.ts in the Agency app). Agency credibility only: these players did not
 * necessarily use European Pathway. Pathway-site consent tracked under E11/E12.
 */
export interface AgencyPlayer { slug: string; name: string; nationality: string; position: string; club?: string; nationalTeam?: string; birthYear: number; photo: string; evidence: Evidence }

const P = "/assets/pathway/photos/players/roster/";
export const agencyPlayers: AgencyPlayer[] = [
  { slug: "renars-varslavans", name: "Renārs Varslavāns", nationality: "LVA", position: "Attacking Midfield", club: "Riga FC", nationalTeam: "Latvia", birthYear: 2001, photo: P + "renars-varslavans.jpg", evidence: confirmed },
  { slug: "glebs-zaleiko", name: "Gļebs Žaleiko", nationality: "LVA", position: "Central Midfield", club: "FS Jelgava", nationalTeam: "Latvia", birthYear: 2004, photo: P + "glebs-zaleiko.jpg", evidence: confirmed },
  { slug: "maksims-semesko", name: "Maksims Semeško", nationality: "LVA", position: "Centre-Back", club: "FS Jelgava", nationalTeam: "Latvia U21", birthYear: 2004, photo: P + "maksims-semesko.jpg", evidence: confirmed },
  { slug: "kristofers-rekis", name: "Kristofers Rēķis", nationality: "LVA", position: "Attacking Midfield", club: "FS Jelgava", nationalTeam: "Former Latvia U21", birthYear: 2003, photo: P + "kristofers-rekis.jpg", evidence: confirmed },
  { slug: "emile-ngai-eba", name: "Emile Ngai Eba", nationality: "CMR", position: "Attacking Midfield", club: "FK Smiltene", birthYear: 2005, photo: P + "emile-ngai-eba.jpg", evidence: confirmed },
  { slug: "algirdas-grazis", name: "Aļģirdas Gražis", nationality: "LVA", position: "Centre-Forward", club: "Riga Mariners", birthYear: 2003, photo: P + "algirdas-grazis.jpg", evidence: confirmed },
  { slug: "savelijs-boroviks", name: "Savēlijs Boroviks", nationality: "LVA", position: "Right-Back", club: "FC RFS", nationalTeam: "Latvia U19", birthYear: 2008, photo: P + "savelijs-boroviks.jpg", evidence: confirmed },
  { slug: "emilija-ambaine", name: "Emīlija Ambaine", nationality: "LVA", position: "Midfielder", club: "Sassuolo", nationalTeam: "Latvia U17", birthYear: 2010, photo: P + "emilija-ambaine.jpg", evidence: { state: "confirmed", ref: "E12", note: "Guardian publication permission confirmed by founder (Round 2); document held internally" } },
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
