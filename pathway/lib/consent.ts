"use client";
/**
 * Cookie / storage consent (ePrivacy Directive Art. 5(3); Latvian Information Society Services Law).
 * Strictly necessary storage (this consent choice, the application draft in sessionStorage, the admin session cookie)
 * needs no consent. Optional storage — campaign attribution kept between visits — runs only after "Accept".
 * There are currently no analytics or advertising cookies on the site.
 */
export interface ConsentState { attribution: boolean; at: string; version: 1 }
const KEY = "cs_consent_v1";
const listeners = new Set<() => void>();

export function readConsent(): ConsentState | null {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function saveConsent(attribution: boolean) {
  const c: ConsentState = { attribution, at: new Date().toISOString(), version: 1 };
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* storage unavailable */ }
  if (!attribution) { try { localStorage.removeItem("cs_attribution_v1"); } catch { /* */ } }
  listeners.forEach((l) => l());
}
export const onConsentChange = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const openConsentSettings = () => window.dispatchEvent(new Event("cs:consent-open"));
