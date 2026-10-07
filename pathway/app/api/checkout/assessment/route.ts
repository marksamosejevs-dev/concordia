import { verifyPlayerToken, playerToken } from "@/lib/server/tokens";
import { getApplication, updateApplication, LEGAL_VERSION } from "@/lib/server/records";
import { createAssessmentCheckout, stripeConfigured } from "@/lib/server/payments";
import { taxTreatment, normaliseVatId, isEU, vatBreakdown } from "@/lib/tax";
import { checkVies } from "@/lib/server/vies";
import { isCountryCode } from "@/lib/countries";
import { siteOrigin } from "@/lib/server/env";
import { json, failure, requestCountry } from "@/lib/server/http";

/**
 * POST /api/checkout/assessment — accepted applicants only. Records tax evidence + consents, then creates a
 * Stripe-hosted Checkout Session. Nothing here marks the payment as received (webhook only).
 */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
  try {
    const id = verifyPlayerToken(String(b.t ?? ""));
    if (!id) return json({ ok: false, error: "invalid_link" }, 404);
    const r = await getApplication(id);
    if (!r) return json({ ok: false, error: "not_found" }, 404);
    if (!r.acceptedAt || r.notAcceptedAt) return json({ ok: false, error: "not_eligible", message: "This application hasn’t been accepted for a Pathway Assessment." }, 409);
    if (r.payment?.status === "paid") return json({ ok: false, error: "already_paid" }, 409);

    const e: Record<string, string> = {};
    const payerName = String(b.payerName ?? "").trim().slice(0, 120), payerEmail = String(b.payerEmail ?? "").trim().toLowerCase().slice(0, 160);
    const country = String(b.country ?? "").toUpperCase();
    const buyerType = b.buyerType === "business" ? "business" : "consumer";
    const c = (b.consents ?? {}) as Record<string, unknown>;
    if (!payerName) e.payerName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payerEmail)) e.payerEmail = "Valid email required";
    if (!isCountryCode(country)) e.country = "Choose your country of residence";
    if (r.isMinor && b.isGuardianPayer !== true) e.isGuardianPayer = "For players under 18, a parent or legal guardian must pay";
    if (c.terms !== true) e.terms = "Required";
    if (c.notRepresentation !== true) e.notRepresentation = "Required";
    if (c.residenceDeclaration !== true) e.residenceDeclaration = "Required";
    const businessName = buyerType === "business" ? String(b.businessName ?? "").trim().slice(0, 160) : undefined;
    if (buyerType === "business" && !businessName) e.businessName = "Required for business purchases";
    if (Object.keys(e).length) return json({ ok: false, error: "validation", errors: e }, 422);
    if (!stripeConfigured()) return json({ ok: false, error: "payments_not_configured", message: "Online payment is not available yet. Your place is kept — we’ll email you as soon as payment opens." }, 503);

    // VAT number check only matters for EU (non-LV) businesses claiming the reverse charge.
    const vatId = buyerType === "business" ? normaliseVatId(String(b.vatId ?? "")) ?? undefined : undefined;
    let vies = { checked: false, valid: false };
    if (vatId && isEU(country) && country !== "LV") vies = await checkVies(vatId);
    const tax = taxTreatment({ country, buyerType, vatId, vatIdValid: vies.valid });
    const now = new Date();
    const withdrawalEndsAt = new Date(now.getTime() + 14 * 86_400_000).toISOString();
    const earlyStart = c.earlyStart === true;
    const consents = [
      { key: "assessment_terms_tos_privacy", at: now.toISOString(), version: LEGAL_VERSION },
      { key: "not_representation_no_guarantee", at: now.toISOString(), version: LEGAL_VERSION },
      { key: "residence_declaration", at: now.toISOString(), version: LEGAL_VERSION },
      ...(earlyStart ? [{ key: "early_performance_request_and_withdrawal_acknowledgement", at: now.toISOString(), version: LEGAL_VERSION }] : []),
    ];
    const origin = siteOrigin(req);
    const token = playerToken(id);
    const session = await createAssessmentCheckout({ appId: id, playerName: r.data.fullName, email: payerEmail, origin, token, tax, metadata: { buyer_type: buyerType, declared_country: country } });
    const breakdown = vatBreakdown(24900, tax);
    await updateApplication(id, (x) => {
      x.payment = { status: "checkout_open", checkoutSessionId: session.id, declaredCountry: country, requestCountry: requestCountry(req), buyerType, businessName, vatId, vatIdChecked: vies.checked, vatIdValid: vies.valid, taxCode: tax.code, vatRate: tax.rate, vatAmount: breakdown.vat, payerName, payerEmail, isGuardianPayer: b.isGuardianPayer === true, earlyStartRequested: earlyStart, withdrawalEndsAt, consents };
    }, { type: "checkout_started", detail: `${tax.code}${vatId ? ` VAT ${vatId} ${vies.checked ? (vies.valid ? "valid" : "invalid") : "unchecked"}` : ""}` });
    return json({ ok: true, url: session.url });
  } catch (e) { return failure(e, "checkout-assessment"); }
}
