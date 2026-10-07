import type Stripe from "stripe";
import { stripe } from "@/lib/server/payments";
import { env, siteOrigin } from "@/lib/server/env";
import { claimEvent } from "@/lib/server/records";
import { handleStripeEvent } from "@/lib/server/workflow";
import { store } from "@/lib/server/store";
import { json } from "@/lib/server/http";

/**
 * POST /api/stripe/webhook — the ONLY place payment state changes.
 * 1) verifies the Stripe-Signature against STRIPE_WEBHOOK_SECRET using the raw request body;
 * 2) processes each event id exactly once (events/<id> created with onlyIfNew; handlers are idempotent too);
 * 3) on a processing error, releases the claim and returns 500 so Stripe retries the delivery.
 */
export async function POST(req: Request) {
  if (!env.stripeSecret || !env.stripeWebhookSecret) return json({ error: "not_configured" }, 503);
  const raw = await req.text();
  let evt: Stripe.Event;
  try { evt = stripe().webhooks.constructEvent(raw, req.headers.get("stripe-signature") ?? "", env.stripeWebhookSecret); }
  catch { return json({ error: "invalid_signature" }, 400); }
  if (!(await claimEvent(evt.id))) return json({ received: true, duplicate: true });
  try {
    return json({ received: true, result: await handleStripeEvent(evt, siteOrigin(req)) });
  } catch (e) {
    console.error(`[stripe-webhook] ${evt.type} ${evt.id} failed`, e);
    await store().delete(`events/${evt.id}`).catch(() => {});
    return json({ error: "processing_failed" }, 500);
  }
}
