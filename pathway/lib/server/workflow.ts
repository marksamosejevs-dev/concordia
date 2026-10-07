/**
 * WORKFLOW — every state change of an application, with its emails and audit trail.
 * Admin decisions (accept, sufficiency, ready, call) are human actions. Payment is webhook-only.
 */
import type Stripe from "stripe";
import { withdrawalOpen, WITHDRAWAL_DAYS } from "./withdrawal";
import { eraseApplication, getApplication, updateApplication, logEmail, type ApplicationRecord, type MaterialsSubmission, deadlineOf, LEGAL_VERSION } from "./records";
import { sendEmail, internalRecipients, type Message } from "./email";
import * as T from "./templates";
import { playerToken } from "./tokens";
import { env } from "./env";
import { creditExpiry, creditUsable } from "../credit";
import { ASSESSMENT_CENTS, CREDIT_CENTS, stripe } from "./payments";

export const links = (origin: string, r: { id: string; linkVersion?: number }) => {
  const id = r.id;
  const t = encodeURIComponent(playerToken(id, r.linkVersion ?? 1));
  return { status: `${origin}/status?t=${t}`, checkout: `${origin}/checkout/assessment?t=${t}`, onboarding: `${origin}/onboarding?t=${t}`, pathway: `${origin}/checkout/pathway?t=${t}`, admin: `${origin}/admin/applications/${id}` };
};

/** Sends and logs; returns whether the provider accepted it. */
export async function deliver(id: string, template: string, m: Message): Promise<boolean> {
  const r = await sendEmail(m);
  await logEmail(id, { at: new Date().toISOString(), template, to: m.to, ok: r.ok, id: r.id, error: r.error });
  return r.ok;
}
const internal = (id: string, template: string, m: (to: string[]) => Message) => { const to = internalRecipients(); return to.length ? deliver(id, template, m(to)) : (logEmail(id, { at: new Date().toISOString(), template, to: [], ok: false, error: "PATHWAY_INTERNAL_EMAIL not configured" }), Promise.resolve(false)); };

export async function afterApplication(r: ApplicationRecord, origin: string) {
  const L = links(origin, r);
  const [internalOk, applicantOk] = await Promise.all([
    internal(r.id, "internal_application", (to) => T.internalApplication(r, L.admin, to)),
    deliver(r.id, "application_received", T.applicantReceived(r, L.status)),
  ]);
  return { internalOk, applicantOk };
}

export type AdminAction =
  | { action: "start_review" } | { action: "accept" } | { action: "not_accept" } | { action: "resend_acceptance" }
  | { action: "start_materials_review" } | { action: "request_info"; items: string[] } | { action: "confirm_sufficient" }
  | { action: "assessment_ready"; reportUrl?: string; bookingUrl?: string } | { action: "call_completed" } | { action: "offer_pathway" }
  | { action: "note"; text: string } | { action: "reissue_link" } | { action: "erase" };

export class ActionError extends Error {}

export async function adminAction(id: string, a: AdminAction, origin: string): Promise<{ record: ApplicationRecord; emailed?: boolean }> {
  const r0 = await getApplication(id);
  if (!r0) throw new ActionError("Application not found");
  const L = links(origin, r0);
  const now = new Date().toISOString();
  const need = (ok: boolean, msg: string) => { if (!ok) throw new ActionError(msg); };
  switch (a.action) {
    case "reissue_link": {
      need(!r0.erasedAt, "Application erased");
      const r = await updateApplication(id, (x) => { x.linkVersion = (x.linkVersion ?? 1) + 1; }, { type: "link_reissued" });
      return { record: r, emailed: await deliver(id, "link_reissued", T.applicantNewLink(r, links(origin, r).status)) };
    }
    case "erase": {
      need(!r0.erasedAt, "Already erased");
      return { record: await eraseApplication(id) };
    }
    case "note": {
      need(Boolean(a.text?.trim()), "Note is empty");
      return { record: await updateApplication(id, (r) => { r.notes.push({ at: now, text: a.text.trim().slice(0, 4000) }); }) };
    }
    case "start_review":
      return { record: await updateApplication(id, () => {}, { type: "review_started" }) };
    case "accept": {
      need(!r0.acceptedAt && !r0.notAcceptedAt, "A decision has already been recorded");
      const r = await updateApplication(id, (x) => { x.acceptedAt = now; }, { type: "accepted" });
      return { record: r, emailed: await deliver(id, "accepted", T.applicantAccepted(r, L.checkout)) };
    }
    case "resend_acceptance": {
      need(Boolean(r0.acceptedAt) && !r0.paymentReceivedAt, "Only for accepted, unpaid applications");
      return { record: r0, emailed: await deliver(id, "accepted", T.applicantAccepted(r0, L.checkout)) };
    }
    case "not_accept": {
      need(!r0.acceptedAt && !r0.notAcceptedAt, "A decision has already been recorded");
      const r = await updateApplication(id, (x) => { x.notAcceptedAt = now; }, { type: "not_accepted" });
      return { record: r, emailed: await deliver(id, "not_accepted", T.applicantNotAccepted(r)) };
    }
    case "start_materials_review": {
      need(Boolean(r0.paymentReceivedAt && r0.materialsSubmittedAt), "Needs payment and submitted materials");
      return { record: await updateApplication(id, (x) => { x.reviewStartedAt = now; }, { type: "materials_review_started" }) };
    }
    case "request_info": {
      const items = (a.items ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 20);
      need(Boolean(r0.paymentReceivedAt) && items.length > 0, "Needs payment and at least one item");
      need(!r0.sufficientConfirmedAt, "Materials are already confirmed sufficient");
      const r = await updateApplication(id, (x) => { x.additionalInfoRequestedAt = now; x.additionalInfoItems = items; }, { type: "additional_info_requested", detail: items.join(" | ") });
      return { record: r, emailed: await deliver(id, "additional_info", T.applicantAdditionalInfo(r, items, L.onboarding)) };
    }
    case "confirm_sufficient": {
      // The ONLY way the 7-day period starts: payment received + this team confirmation.
      need(Boolean(r0.paymentReceivedAt) && r0.payment?.status === "paid", "Payment has not been received");
      need(r0.materials.length > 0, "No materials have been submitted");
      need(!r0.sufficientConfirmedAt, "Already confirmed");
      need(!r0.withdrawnAt, "The customer has withdrawn from the contract");
      // Sufficiency can always be confirmed; the 7-day period starts only once performance is also legally permitted.
      const r = await updateApplication(id, (x) => { x.sufficientConfirmedAt = now; }, { type: "materials_sufficient" });
      const d = deadlineOf(r);
      if (d.started && d.startDate && d.targetDate) return { record: r, emailed: await deliver(id, "assessment_started", T.applicantStarted(r, d.startDate, d.targetDate)) };
      return { record: r, emailed: await deliver(id, "assessment_scheduled", T.applicantScheduled(r, r.performancePermittedAt!, L.status)) };
    }
    case "assessment_ready": {
      need(Boolean(r0.sufficientConfirmedAt && r0.paymentReceivedAt), "The assessment hasn’t started");
      const url = (s?: string) => (s && /^https:\/\//.test(s.trim()) ? s.trim() : undefined);
      const r = await updateApplication(id, (x) => { x.assessmentReadyAt = now; x.reportUrl = url(a.reportUrl) ?? x.reportUrl; x.bookingUrl = url(a.bookingUrl) ?? x.bookingUrl; if (x.bookingUrl || env.bookingUrl) x.callScheduledAt = undefined; }, { type: "assessment_ready" });
      return { record: r, emailed: await deliver(id, "assessment_ready", T.applicantReady(r, L.status, r.bookingUrl ?? env.bookingUrl)) };
    }
    case "call_completed": {
      need(Boolean(r0.assessmentReadyAt), "The assessment isn’t marked ready");
      const r = await updateApplication(id, (x) => {
        x.callCompletedAt = now;
        if (!x.credit && x.payment?.status === "paid") x.credit = { amountCents: CREDIT_CENTS, issuedAt: now, expiresAt: creditExpiry(now) };
      }, { type: "call_completed" });
      return { record: r };
    }
    case "offer_pathway": {
      need(Boolean(r0.callCompletedAt), "Mark the call completed first");
      const r = await updateApplication(id, (x) => { x.pathwayOfferedAt = now; }, { type: "pathway_offered" });
      const creditOk = creditUsable(r.credit, now);
      return { record: r, emailed: await deliver(id, "pathway_offer", T.applicantPathwayOffer(r, L.pathway, creditOk ? { until: r.credit!.expiresAt } : undefined)) };
    }
  }
}

export async function afterMaterials(id: string, m: MaterialsSubmission, origin: string) {
  const r = (await getApplication(id))!;
  const L = links(origin, r);
  await Promise.all([
    internal(id, "internal_materials", (to) => T.internalMaterials(r, m, L.admin, to)),
    deliver(id, "materials_received", T.applicantMaterialsReceived(r, L.status)),
  ]);
}

/* ───────────── Stripe webhook ───────────── */

const iso = (unix?: number | null) => (unix ? new Date(unix * 1000).toISOString() : new Date().toISOString());
const appIdOf = (o: { metadata?: Stripe.Metadata | null; client_reference_id?: string | null }) => o.client_reference_id ?? o.metadata?.app_id ?? null;

export async function handleStripeEvent(evt: Stripe.Event, origin: string): Promise<string> {
  switch (evt.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const s = evt.data.object as Stripe.Checkout.Session;
      const id = appIdOf(s); if (!id) return "ignored: no application id";
      if (s.mode === "payment") {
        if (s.payment_status !== "paid") return "awaiting asynchronous payment";
        const expected = (await getApplication(id))?.payment?.expectedAmount ?? ASSESSMENT_CENTS;
        if (s.amount_total !== expected || s.currency !== "usd") {
          await updateApplication(id, () => {}, { type: "payment_amount_mismatch", detail: `${s.amount_total} ${s.currency}` });
          return "amount mismatch — flagged, not unlocked";
        }
        let cardCountry: string | undefined;
        try { const pi = await stripe().paymentIntents.retrieve(String(s.payment_intent), { expand: ["latest_charge"] }); cardCountry = ((pi.latest_charge as Stripe.Charge | null)?.payment_method_details?.card?.country) ?? undefined; } catch { /* evidence is best-effort */ }
        const billingCountry = s.customer_details?.address?.country ?? undefined;
        let first = false;
        const r = await updateApplication(id, (x) => {
          first = false; // the callback can re-run on a write conflict
          if (x.payment?.status === "paid") return; // idempotent
          first = true;
          x.paymentReceivedAt = iso(evt.created);
          // Withdrawal period runs from contract conclusion (payment confirmed). Performance is permitted at once for
          // businesses or on an express early-start request; otherwise when the 14 days end.
          const consumer = x.payment?.buyerType !== "business";
          const ends = new Date(evt.created * 1000 + WITHDRAWAL_DAYS * 86_400_000).toISOString();
          x.performancePermittedAt = !consumer || x.payment?.earlyStartRequested ? iso(evt.created) : ends;
          if (x.payment) x.payment.withdrawalEndsAt = consumer ? ends : undefined;
          x.payment = { ...(x.payment ?? { status: "paid" }), status: "paid", checkoutSessionId: s.id, paymentIntentId: String(s.payment_intent ?? ""), customerId: typeof s.customer === "string" ? s.customer : s.customer?.id, invoiceId: typeof s.invoice === "string" ? s.invoice : s.invoice?.id, amount: s.amount_total ?? undefined, currency: s.currency ?? undefined, paidAt: iso(evt.created), billingCountry, cardCountry };
          const declared = x.payment.declaredCountry;
          x.payment.countryMismatch = Boolean(declared && billingCountry && declared !== billingCountry);
        }, { type: "payment_received", detail: `Stripe ${s.id}` });
        if (first) {
          const L = links(origin, r);
          await deliver(id, "payment_received", T.applicantPaymentReceived(r, L.onboarding));
          await internal(id, "internal_payment", (to) => T.internalEvent(r, "PAYMENT RECEIVED", [`$249 Pathway Assessment paid ${r.paymentReceivedAt}`, `Tax treatment: ${r.payment?.taxCode} (declared ${r.payment?.declaredCountry} / billing ${billingCountry ?? "—"} / card ${cardCountry ?? "—"})${r.payment?.countryMismatch ? " ⚠ COUNTRY MISMATCH — review tax treatment" : ""}`, `Early start requested: ${r.payment?.earlyStartRequested ? "yes" : "NO — wait until " + r.payment?.withdrawalEndsAt}`], L.admin, to));
        }
        return first ? "payment recorded" : "already recorded";
      }
      if (s.mode === "subscription") {
        const creditApplied = s.metadata?.credit === "applied" && (s.total_details?.amount_discount ?? 0) > 0;
        let first = false;
        const r = await updateApplication(id, (x) => {
          first = false;
          if (x.subscription?.subscriptionId) return;
          first = true;
          x.subscription = { ...(x.subscription ?? { status: "active" }), status: "active", checkoutSessionId: s.id, subscriptionId: typeof s.subscription === "string" ? s.subscription : s.subscription?.id, customerId: typeof s.customer === "string" ? s.customer : s.customer?.id, startedAt: iso(evt.created) };
          if (creditApplied && x.credit && !x.credit.usedAt) x.credit.usedAt = iso(evt.created);
        }, { type: "subscription_started", detail: creditApplied ? "with $150 assessment credit" : undefined });
        if (first) {
          const L = links(origin, r);
          await deliver(id, "subscription_started", T.applicantSubscriptionStarted(r, L.status));
          await internal(id, "internal_subscription", (to) => T.internalEvent(r, "EUROPEAN PATHWAY STARTED", [`Subscription ${r.subscription?.subscriptionId}`, `Assessment credit: ${creditApplied ? "applied ($150)" : "not applied"}`], L.admin, to));
        }
        return first ? "subscription recorded" : "already recorded";
      }
      return "ignored mode";
    }
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const s = evt.data.object as Stripe.Checkout.Session;
      const id = appIdOf(s); if (!id) return "ignored";
      await updateApplication(id, (x) => {
        if (s.mode === "payment" && x.payment && x.payment.status !== "paid" && x.payment.checkoutSessionId === s.id) x.payment.status = evt.type === "checkout.session.expired" ? "expired" : "failed";
        if (s.mode === "subscription" && x.subscription && !x.subscription.subscriptionId && x.subscription.checkoutSessionId === s.id) x.subscription.status = "incomplete";
      }, { type: evt.type.replace("checkout.session.", "checkout_") });
      return "recorded";
    }
    case "invoice.paid":
    case "invoice.payment_failed": {
      const inv = evt.data.object as Stripe.Invoice;
      const subId = (inv as unknown as { subscription?: string | null }).subscription ?? inv.parent?.subscription_details?.subscription;
      const id = inv.parent?.subscription_details?.metadata?.app_id ?? inv.metadata?.app_id ?? null;
      if (!id || !subId) return "ignored: not a Pathway subscription invoice";
      const r = await updateApplication(id, (x) => {
        if (!x.subscription) x.subscription = { status: "active", subscriptionId: String(subId) };
        if (evt.type === "invoice.paid") { x.subscription.lastInvoicePaidAt = iso(evt.created); x.subscription.status = "active"; }
        else { x.subscription.lastPaymentFailedAt = iso(evt.created); x.subscription.status = "past_due"; }
      }, { type: evt.type === "invoice.paid" ? "subscription_invoice_paid" : "subscription_payment_failed", detail: `${inv.id} ${inv.amount_paid ?? inv.amount_due} ${inv.currency}` });
      if (evt.type === "invoice.payment_failed") { const L = links(origin, r); await deliver(id, "renewal_failed", T.applicantRenewalFailed(r, L.status)); await internal(id, "internal_renewal_failed", (to) => T.internalEvent(r, "PATHWAY PAYMENT FAILED", [`Invoice ${inv.id}`], L.admin, to)); }
      return "recorded";
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = evt.data.object as Stripe.Subscription;
      const id = sub.metadata?.app_id; if (!id) return "ignored";
      const ended = evt.type === "customer.subscription.deleted";
      const r = await updateApplication(id, (x) => {
        x.subscription = { ...(x.subscription ?? { status: "active" }), subscriptionId: sub.id, status: ended ? "cancelled" : (sub.status === "active" || sub.status === "trialing" ? "active" : sub.status === "past_due" ? "past_due" : sub.status === "unpaid" ? "unpaid" : sub.status === "canceled" ? "cancelled" : "incomplete"), cancelAt: sub.cancel_at ? iso(sub.cancel_at) : undefined, cancelledAt: ended ? iso(evt.created) : x.subscription?.cancelledAt };
      }, { type: ended ? "subscription_ended" : "subscription_updated", detail: sub.cancel_at_period_end ? "cancels at period end" : sub.status });
      if (ended) await deliver(id, "subscription_ended", T.applicantSubscriptionEnded(r));
      return "recorded";
    }
    case "charge.refunded":
    case "charge.dispute.created": {
      const obj = evt.data.object as Stripe.Charge | Stripe.Dispute;
      const pi = typeof obj.payment_intent === "string" ? obj.payment_intent : obj.payment_intent?.id;
      if (!pi) return "ignored";
      let meta: Stripe.Metadata = {};
      try { meta = (await stripe().paymentIntents.retrieve(pi)).metadata; } catch { return "payment intent not found"; }
      const id = meta.app_id; if (!id || meta.product !== "assessment") return "ignored: not an assessment payment";
      const refunded = evt.type === "charge.refunded" ? (obj as Stripe.Charge).amount_refunded : 0;
      const r = await updateApplication(id, (x) => {
        if (!x.payment) return;
        if (evt.type === "charge.dispute.created") x.payment.status = "disputed";
        else if (refunded >= (x.payment.amount ?? ASSESSMENT_CENTS)) x.payment.status = "refunded";
        // A refunded or disputed assessment payment voids the unused $150 credit (Terms: Assessment credit).
        if (x.credit && !x.credit.usedAt && !x.credit.voidedAt) { x.credit.voidedAt = iso(evt.created); x.credit.voidReason = evt.type === "charge.refunded" ? "Assessment payment refunded" : "Assessment payment disputed"; }
      }, { type: evt.type === "charge.refunded" ? "payment_refunded" : "payment_disputed", detail: refunded ? `${refunded}` : undefined });
      const L = links(origin, r);
      await internal(id, "internal_refund", (to) => T.internalEvent(r, evt.type === "charge.refunded" ? "ASSESSMENT PAYMENT REFUNDED" : "ASSESSMENT PAYMENT DISPUTED", [`Payment intent ${pi}`, "Unused $150 credit voided."], L.admin, to));
      return "recorded";
    }
    default:
      return `unhandled ${evt.type}`;
  }
}

/* ------------------------------------------------------------------ customer actions (signed link) */

export type CustomerAction = { action: "early_start" } | { action: "withdraw"; contract: "assessment" | "pathway"; statement?: string };

/** Express request to begin performance during the withdrawal period, given after checkout (CRD Art. 7(3)/8(8)). */
export async function customerAction(id: string, a: CustomerAction, origin: string): Promise<{ record: ApplicationRecord }> {
  const r0 = await getApplication(id);
  if (!r0) throw new ActionError("Application not found");
  const now = new Date().toISOString();
  const L = links(origin, r0);
  if (a.action === "early_start") {
    if (!r0.paymentReceivedAt || r0.withdrawnAt) throw new ActionError("Not available");
    if (!r0.performancePermittedAt || r0.performancePermittedAt <= now) return { record: r0 }; // already permitted
    const r = await updateApplication(id, (x) => {
      x.performancePermittedAt = now;
      if (x.payment) { x.payment.earlyStartRequested = true; x.payment.consents = [...(x.payment.consents ?? []), { key: "early_performance_request_and_withdrawal_acknowledgement", at: now, version: LEGAL_VERSION }]; }
    }, { type: "early_start_requested", detail: "via status page" });
    const d = deadlineOf(r);
    if (d.started && d.startDate && d.targetDate) await deliver(id, "assessment_started", T.applicantStarted(r, d.startDate, d.targetDate));
    await internal(id, "internal_early_start", (to) => T.internalEvent(r, "EARLY START REQUESTED", [`Customer asked to begin performance within the withdrawal period at ${now}.`], L.admin, to));
    return { record: r };
  }
  // Withdrawal function (CRD Art. 11a, Directive (EU) 2023/2673): available to consumers during the withdrawal period.
  const open = withdrawalOpen(r0, a.contract, now);
  if (!open) throw new ActionError("The withdrawal period for this contract has ended or does not apply.");
  const r = await updateApplication(id, (x) => {
    const entry = { contract: a.contract, at: now, statement: (a.statement ?? "").slice(0, 1000) };
    x.withdrawals = [...(x.withdrawals ?? []), entry];
    if (a.contract === "assessment") x.withdrawnAt = now;
  }, { type: "withdrawal_received", detail: a.contract });
  await deliver(id, "withdrawal_acknowledgement", T.applicantWithdrawalReceived(r, a.contract, now));
  await internal(id, "internal_withdrawal", (to) => T.internalEvent(r, "WITHDRAWAL RECEIVED — ACTION REQUIRED", [`Contract: ${a.contract === "assessment" ? "Pathway Assessment" : "European Pathway subscription"}`, `Received: ${now}`, `Early start requested: ${r.payment?.earlyStartRequested ? "yes — refund minus a proportionate amount for work done" : "no — full refund"}`, a.contract === "pathway" ? "Cancel the subscription in Stripe and refund per policy." : "Refund in Stripe within 14 days (same payment method)."], L.admin, to));
  return { record: r };
}
