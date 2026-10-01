"use client";
/**
 * Analytics event layer (Phase 1 §13). Provider-agnostic and consent-gated.
 * Only allow-listed, non-sensitive properties leave the browser — never application answers.
 */
type Props = Record<string, string | number | boolean | undefined>;
const ALLOWED_PROPS = new Set(["variant", "cta", "audience", "step", "route", "product", "section", "id", "action", "page", "country", "price_mode", "source"]);

export function track(event: string, props: Props = {}) {
  const safe: Props = {};
  for (const [k, v] of Object.entries(props)) if (ALLOWED_PROPS.has(k)) safe[k] = v;
  if (typeof window === "undefined") return;
  const w = window as unknown as { __csConsent?: boolean; __csEvents?: unknown[] };
  (w.__csEvents ??= []).push({ event, ...safe, t: Date.now() });
  // Provider wiring (GA4 / PostHog / Meta CAPI) attaches here once consent mode is configured.
}
