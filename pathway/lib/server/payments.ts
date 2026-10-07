/**
 * PAYMENTS — Stripe (hosted Checkout + Billing). Card data never touches Concordia's servers.
 * - Pathway Assessment: USD 249 one-time (Checkout, mode=payment).
 * - European Pathway: USD 399/month recurring (Checkout, mode=subscription).
 * - $150 Assessment credit: a single-use Stripe coupon (amount_off 15000, duration "once", max_redemptions 1)
 *   tied to the paid application, so the first Pathway payment is $249 and then $399/month.
 * Payment state changes ONLY in the verified webhook (app/api/stripe/webhook) — never from a redirect.
 * Stripe Tax is NOT enabled: prices are final and VAT treatment is decided by lib/tax.ts (see that file).
 */
import Stripe from "stripe";
import { env } from "./env";
import { NotConfigured } from "./tokens";
import { products, ASSESSMENT_CREDIT } from "../../content/products";
import { chargeAmount, type TaxResult } from "../tax";

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!env.stripeSecret) throw new NotConfigured("Stripe (STRIPE_SECRET_KEY)");
  return (client ??= new Stripe(env.stripeSecret));
}
export const stripeConfigured = () => Boolean(env.stripeSecret);

const price = (id: "assessment" | "pathway") => products.find((p) => p.id === id)!.price;
export const ASSESSMENT_CENTS = price("assessment") * 100;
export const PATHWAY_CENTS = price("pathway") * 100;
export const CREDIT_CENTS = ASSESSMENT_CREDIT.amount * 100;

const SELLER = [{ name: "Seller", value: "Concordia Sports Agency SIA" }, { name: "Seller VAT No.", value: "LV40203574668" }];

export async function createAssessmentCheckout(o: { appId: string; playerName: string; email: string; origin: string; token: string; tax: TaxResult; amountCents: number; metadata: Record<string, string> }) {
  const s = await stripe().checkout.sessions.create({
    mode: "payment",
    client_reference_id: o.appId,
    customer_email: o.email,
    customer_creation: "always",
    billing_address_collection: "required",          // tax evidence: billing country
    tax_id_collection: { enabled: true },             // business customers can add a VAT number
    line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: o.amountCents, product_data: { name: "Pathway Assessment", description: `Concordia Soccer · European Pathway — player: ${o.playerName} (${o.appId})` } } }],
    payment_intent_data: { description: `Pathway Assessment ${o.appId}`, metadata: { app_id: o.appId, product: "assessment" } },
    ...(env.stripeInvoices ? { invoice_creation: { enabled: true, invoice_data: { description: `Pathway Assessment — ${o.appId}`, footer: o.tax.invoiceNote, custom_fields: SELLER, metadata: { app_id: o.appId, tax_code: o.tax.code } } } } : {}),
    metadata: { ...o.metadata, app_id: o.appId, product: "assessment", tax_code: o.tax.code },
    success_url: `${o.origin}/checkout/return?t=${encodeURIComponent(o.token)}&s={CHECKOUT_SESSION_ID}`,
    cancel_url: `${o.origin}/checkout/assessment?t=${encodeURIComponent(o.token)}&cancelled=1`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
  }, { idempotencyKey: `assessment-${o.appId}-${Math.floor(Date.now() / 60000)}` });
  return s;
}

/** Creates (or reuses) the application's single-use $150 coupon. */
async function creditCoupon(appId: string): Promise<string> {
  const id = `ASSESSMENT-CREDIT-${appId}`;
  try { await stripe().coupons.retrieve(id); return id; } catch { /* create below */ }
  await stripe().coupons.create({ id, amount_off: CREDIT_CENTS, currency: "usd", duration: "once", max_redemptions: 1, name: "Pathway Assessment credit", metadata: { app_id: appId } });
  return id;
}

export async function createPathwayCheckout(o: { appId: string; email: string; customerId?: string; origin: string; token: string; applyCredit: boolean; tax: TaxResult; metadata: Record<string, string> }) {
  const coupon = o.applyCredit ? await creditCoupon(o.appId) : undefined;
  const s = await stripe().checkout.sessions.create({
    mode: "subscription",
    client_reference_id: o.appId,
    ...(o.customerId ? { customer: o.customerId, customer_update: { address: "auto", name: "auto" } } : { customer_email: o.email }),
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: chargeAmount(PATHWAY_CENTS, o.tax), recurring: { interval: "month" }, product_data: { name: "European Pathway", description: "Designed as a 6-month European career pathway. Paid monthly." } } }],
    ...(coupon ? { discounts: [{ coupon }] } : {}),
    subscription_data: { description: `European Pathway — ${o.appId}`, metadata: { app_id: o.appId, product: "pathway", tax_code: o.tax.code, credit: coupon ? "applied" : "none" } },
    metadata: { ...o.metadata, app_id: o.appId, product: "pathway", tax_code: o.tax.code, credit: coupon ? "applied" : "none" },
    success_url: `${o.origin}/checkout/return?t=${encodeURIComponent(o.token)}&s={CHECKOUT_SESSION_ID}&p=pathway`,
    cancel_url: `${o.origin}/checkout/pathway?t=${encodeURIComponent(o.token)}&cancelled=1`,
  }, { idempotencyKey: `pathway-${o.appId}-${Math.floor(Date.now() / 60000)}` });
  return s;
}

/** Stripe Customer Portal — update card, view invoices, cancel at period end (configure the portal in Stripe). */
export async function billingPortal(customerId: string, returnUrl: string) {
  return stripe().billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
}

/** Invoice footer for subscription invoices (tax treatment wording). */
export async function setCustomerInvoiceFooter(customerId: string, tax: TaxResult) {
  await stripe().customers.update(customerId, { invoice_settings: { footer: tax.invoiceNote, custom_fields: SELLER } });
}
