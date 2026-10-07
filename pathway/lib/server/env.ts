/**
 * SERVER CONFIGURATION — the only place server code reads environment variables.
 * Secrets never reach the browser: nothing here is NEXT_PUBLIC_.
 * See docs/PRODUCTION_SETUP.md for where each value comes from and where it goes in Netlify.
 */
const v = (k: string) => (process.env[k] ?? "").trim() || undefined;

/** True on any Netlify deployment (functions runtime). */
export const ON_NETLIFY = process.env.NETLIFY === "true" || Boolean(process.env.NETLIFY_BLOBS_CONTEXT);

/**
 * Local test transports (file store, outbox email) are allowed only off Netlify AND with an explicit opt-in,
 * so a misconfigured production deployment can never silently "pretend" to store or send.
 */
export const TEST_TRANSPORTS = !ON_NETLIFY && process.env.PATHWAY_ALLOW_TEST_TRANSPORTS === "1";

export const env = {
  /** HMAC secret for player links and the admin session (≥ 32 random characters). */
  secret: v("PATHWAY_SECRET"),
  adminPassword: v("PATHWAY_ADMIN_PASSWORD"),
  /** Concordia inbox(es) for internal notifications — comma-separated. */
  internalEmail: v("PATHWAY_INTERNAL_EMAIL"),
  emailFrom: v("EMAIL_FROM"),
  /** A real, monitored Concordia mailbox for applicant replies — no default (owner to set). */
  emailReplyTo: v("EMAIL_REPLY_TO"),
  resendKey: v("RESEND_API_KEY"),
  stripeSecret: v("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: v("STRIPE_WEBHOOK_SECRET"),
  /** Stripe-hosted invoices for one-time payments ("true" by default; set "false" to rely on receipts only). */
  stripeInvoices: v("STRIPE_INVOICE_CREATION") !== "false",
  /** Public origin used in emailed links. Netlify provides URL / DEPLOY_PRIME_URL automatically. */
  siteUrl: v("SITE_URL") ?? v("NEXT_PUBLIC_SITE_URL") ?? v("URL") ?? v("DEPLOY_PRIME_URL"),
  bookingUrl: v("NEXT_PUBLIC_BOOKING_URL"),
};

export function siteOrigin(req?: Request): string {
  if (env.siteUrl) return env.siteUrl.replace(/\/$/, "");
  if (req) { const u = new URL(req.url); return `${u.protocol}//${u.host}`; }
  return "http://localhost:3100";
}

export type Integration = "storage" | "secret" | "admin" | "internalEmail" | "email" | "replyTo" | "stripe" | "stripeWebhook" | "booking";
/** Configuration status — names only, never values. Shown in the admin dashboard. */
export function configStatus(): Record<Integration, { ok: boolean; detail: string }> {
  return {
    storage: { ok: ON_NETLIFY || TEST_TRANSPORTS, detail: ON_NETLIFY ? "Netlify Blobs (EU — eu-central-1)" : TEST_TRANSPORTS ? "Local file store (test only)" : "No storage available outside Netlify" },
    secret: { ok: Boolean(env.secret && env.secret.length >= 32), detail: "PATHWAY_SECRET (≥ 32 chars)" },
    admin: { ok: Boolean(env.adminPassword && env.adminPassword.length >= 12), detail: "PATHWAY_ADMIN_PASSWORD (≥ 12 chars)" },
    internalEmail: { ok: Boolean(env.internalEmail), detail: "PATHWAY_INTERNAL_EMAIL" },
    email: { ok: Boolean(env.resendKey && env.emailFrom) || TEST_TRANSPORTS, detail: env.resendKey ? "Resend" : TEST_TRANSPORTS ? "Outbox (test only)" : "RESEND_API_KEY + EMAIL_FROM" },
    replyTo: { ok: Boolean(env.emailReplyTo), detail: "EMAIL_REPLY_TO (monitored mailbox for applicant replies)" },
    stripe: { ok: Boolean(env.stripeSecret), detail: env.stripeSecret ? (env.stripeSecret.startsWith("sk_live") || env.stripeSecret.startsWith("rk_live") ? "Stripe LIVE" : "Stripe TEST mode") : "STRIPE_SECRET_KEY" },
    stripeWebhook: { ok: Boolean(env.stripeWebhookSecret), detail: "STRIPE_WEBHOOK_SECRET" },
    booking: { ok: Boolean(env.bookingUrl), detail: "NEXT_PUBLIC_BOOKING_URL (or a per-player link set in admin)" },
  };
}
