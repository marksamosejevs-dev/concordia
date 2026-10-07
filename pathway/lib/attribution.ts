"use client";
/**
 * First-touch / last-touch campaign attribution (UTM parameters, referral code, landing page).
 * Always kept in memory for the current visit, so it can travel with an application submitted in that visit.
 * Persisted in localStorage across visits ONLY with consent (lib/consent.ts). No personal data, no third parties.
 */
import { readConsent } from "./consent";

export interface Touch {
  utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; utm_term?: string;
  ref?: string; partner?: string; landing: string; referrer?: string; at: string;
}
export interface Attribution { first?: Touch; last?: Touch }

const KEY = "cs_attribution_v1";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "partner"] as const;
let memory: Attribution = {};

const allowed = () => Boolean(readConsent()?.attribution);

export function readAttribution(): Attribution {
  if (allowed()) { try { const s = JSON.parse(localStorage.getItem(KEY) || "{}") as Attribution; return { first: s.first ?? memory.first, last: memory.last ?? s.last }; } catch { /* */ } }
  return memory;
}

export function captureAttribution(extra?: Partial<Touch>) {
  try {
    const url = new URL(window.location.href);
    const touch: Touch = { landing: url.pathname, referrer: document.referrer || undefined, at: new Date().toISOString(), ...extra };
    let hasSignal = Boolean(extra?.partner);
    for (const p of PARAMS) { const v = url.searchParams.get(p); if (v) { (touch as unknown as Record<string, string>)[p] = v.slice(0, 120); hasSignal = true; } }
    const cur = readAttribution();
    memory = { first: cur.first ?? touch, last: hasSignal || !cur.last ? touch : cur.last };
    persistAttribution();
  } catch { /* best-effort */ }
}

/** Called after consent is given, so the current visit's attribution is kept. */
export function persistAttribution() {
  if (!allowed()) return;
  try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* */ }
}
