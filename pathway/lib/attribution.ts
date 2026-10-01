"use client";
/**
 * First-touch / last-touch attribution. Captured on every landing, persisted in
 * localStorage, attached to application → checkout → subscription payloads.
 * Contains no personal data and is never sent to analytics with application content.
 */
export interface Touch {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ref?: string;          // referral code
  partner?: string;      // creator/partner slug
  landing: string;       // path of first page in the visit
  referrer?: string;
  at: string;            // ISO timestamp
}
export interface Attribution { first?: Touch; last?: Touch }

const KEY = "cs_attribution_v1";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "partner"] as const;

export function readAttribution(): Attribution {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function captureAttribution(extra?: Partial<Touch>) {
  try {
    const url = new URL(window.location.href);
    const touch: Touch = { landing: url.pathname, referrer: document.referrer || undefined, at: new Date().toISOString(), ...extra };
    let hasSignal = Boolean(extra?.partner);
    for (const p of PARAMS) {
      const v = url.searchParams.get(p);
      if (v) { (touch as unknown as Record<string, string>)[p] = v.slice(0, 120); hasSignal = true; }
    }
    const cur = readAttribution();
    const next: Attribution = { first: cur.first ?? touch, last: hasSignal || !cur.last ? touch : cur.last };
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* storage unavailable — attribution is best-effort */ }
}
