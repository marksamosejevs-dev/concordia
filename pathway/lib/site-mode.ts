/**
 * Site mode.
 * - "review"     (default): visual-review build. Gated content renders with a visible
 *                 PENDING tag so the founder can see the full architecture.
 * - "production": only cleared content renders. Pending/hold items disappear.
 * Set NEXT_PUBLIC_SITE_MODE=production for any public launch build.
 */
export type SiteMode = "review" | "production";
export const SITE_MODE: SiteMode = process.env.NEXT_PUBLIC_SITE_MODE === "production" ? "production" : "review";
export const IS_REVIEW = SITE_MODE === "review";

/** Feature switches — all commerce/affiliate integrations are OFF until approved. */
export const FEATURES = {
  paymentsLive: false,       // E24/E25 + provider account
  subscriptionsLive: false,
  creatorPagesLive: false,   // E28 affiliate policy
  instalmentsPublic: false,  // E21
} as const;
