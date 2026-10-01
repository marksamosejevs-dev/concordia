import { pending, type Evidence } from "@/lib/evidence";
import map from "./europe-map.json";

export interface CountrySource { title: string; url: string; accessed: string }
export interface Country {
  iso: string;
  name: string;
  marketStatus: "live" | "in_preparation";
  overview?: string;
  leaguePyramid?: { tier: number; name: string; status: string }[];
  calendar?: string;
  windows?: string;
  registration?: string;
  style?: string;
  entryRoutes?: string;
  suits?: string[];
  sources: CountrySource[];
  lastVerified?: string;
  evidence: Evidence;
}

/** Explorer tabs (template). Every fact needs a source and a "last verified" date. */
export const COUNTRY_TABS = ["Overview", "League pyramid", "Calendar & windows", "Registration & passports", "Style of play", "Entry routes", "Who it suits"] as const;

const NAMES: Record<string, string> = { LV: "Latvia", LT: "Lithuania", EE: "Estonia", FI: "Finland", SE: "Sweden", NO: "Norway", DK: "Denmark", IS: "Iceland", PL: "Poland", DE: "Germany", CZ: "Czechia", SK: "Slovakia", AT: "Austria", HU: "Hungary", RO: "Romania", BG: "Bulgaria", HR: "Croatia", SI: "Slovenia", RS: "Serbia", GR: "Greece", CY: "Cyprus", MT: "Malta", ES: "Spain", PT: "Portugal", IT: "Italy", BE: "Belgium", NL: "Netherlands", IE: "Ireland", GB: "United Kingdom", CH: "Switzerland", FR: "France", UA: "Ukraine" };

/** No country is publicly enabled until its facts are sourced (Phase 2B · launch with 3–5). */
export const countries: Country[] = (map.countries as { iso: string | null }[])
  .filter((c) => c.iso)
  .map((c) => ({ iso: c.iso!, name: NAMES[c.iso!] ?? c.iso!, marketStatus: "in_preparation" as const, sources: [], evidence: pending("MKT", "Sourced country data required") }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const MAP = map as { width: number; height: number; countries: { iso: string | null; name: string; d: string; cx: number; cy: number; launchSet: boolean }[] };
