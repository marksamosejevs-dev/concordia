import { verifyPlayerToken, playerToken } from "@/lib/server/tokens";
import { getApplication, updateApplication, LEGAL_VERSION } from "@/lib/server/records";
import { createPathwayCheckout, setCustomerInvoiceFooter, stripeConfigured } from "@/lib/server/payments";
import { taxTreatment, normaliseVatId, isEU } from "@/lib/tax";
import { checkVies } from "@/lib/server/vies";
import { isCountryCode } from "@/lib/countries";
import { siteOrigin } from "@/lib/server/env";
import { json, failure } from "@/lib/server/http";

/** POST /api/checkout/pathway — European Pathway subscription ($399/month), offered after the assessment call. */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
  try {
    const id = verifyPlayerToken(String(b.t ?? ""));
    if (!id) return json({ ok: false, error: "invalid_link" }, 404);
    const r = await getApplication(id);
    if (!r) return json({ ok: false, error: "not_found" }, 404);
    if (!r.pathwayOfferedAt) return json({ ok: false, error: "not_eligible", message: "European Pathway is offered after your Pathway Assessment and call." }, 409);
    if (r.subscription?.subscriptionId && r.subscription.status !== "cancelled") return json({ ok: false, error: "already_subscribed" }, 409);
    const c = (b.consents ?? {}) as Record<string, unknown>;
    const country = String(b.country ?? r.payment?.declaredCountry ?? "").toUpperCase();
    const buyerType = b.buyerType === "business" ? "business" : "consumer";
    const e: Record<string, string> = {};
    if (!isCountryCode(country)) e.country = "Choose your country of residence";
    if (c.subscriptionTerms !== true) e.subscriptionTerms = "Required";
    if (c.autoRenew !== true) e.autoRenew = "Required";
    if (c.notRepresentation !== true) e.notRepresentation = "Required";
    if (r.isMinor && b.isGuardianPayer !== true) e.isGuardianPayer = "For players under 18, a parent or legal guardian must subscribe";
    if (Object.keys(e).length) return json({ ok: false, error: "validation", errors: e }, 422);
    if (!stripeConfigured()) return json({ ok: false, error: "payments_not_configured", message: "Online subscription is not available yet — we’ll contact you to arrange it." }, 503);
    const vatId = buyerType === "business" ? normaliseVatId(String(b.vatId ?? "")) ?? undefined : undefined;
    const vies = vatId && isEU(country) && country !== "LV" ? await checkVies(vatId) : { checked: false, valid: false };
    const tax = taxTreatment({ country, buyerType, vatId, vatIdValid: vies.valid });
    const now = new Date().toISOString();
    // $150 credit: once, tied to THIS paid assessment, unexpired, not voided by a refund/dispute.
    const applyCredit = Boolean(r.payment?.status === "paid" && r.credit && !r.credit.usedAt && !r.credit.voidedAt && r.credit.expiresAt && r.credit.expiresAt > now);
    const customerId = r.payment?.customerId;
    if (customerId) { try { await setCustomerInvoiceFooter(customerId, tax); } catch { /* non-blocking */ } }
    const session = await createPathwayCheckout({ appId: id, email: r.payment?.payerEmail ?? r.contact.emails[0], customerId, origin: siteOrigin(req), token: playerToken(id), applyCredit, tax, metadata: { buyer_type: buyerType, declared_country: country } });
    await updateApplication(id, (x) => {
      x.subscription = { ...(x.subscription ?? {}), status: "checkout_open", checkoutSessionId: session.id, consents: [
        { key: "pathway_subscription_terms", at: now, version: LEGAL_VERSION }, { key: "recurring_monthly_charge_authorisation", at: now, version: LEGAL_VERSION }, { key: "not_representation_no_guarantee", at: now, version: LEGAL_VERSION },
        ...(c.earlyStart === true ? [{ key: "early_performance_request_and_withdrawal_acknowledgement", at: now, version: LEGAL_VERSION }] : []),
      ] };
      if (applyCredit && x.credit) x.credit.couponId = `ASSESSMENT-CREDIT-${id}`;
    }, { type: "pathway_checkout_started", detail: `${tax.code}${applyCredit ? " with $150 credit" : ""}` });
    return json({ ok: true, url: session.url });
  } catch (e) { return failure(e, "checkout-pathway"); }
}
