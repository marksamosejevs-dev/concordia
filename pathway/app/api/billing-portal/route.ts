import { playerToken } from "@/lib/server/tokens";
import { recordFromToken } from "@/lib/server/records";
import { billingPortal, stripeConfigured } from "@/lib/server/payments";
import { siteOrigin } from "@/lib/server/env";
import { json, failure } from "@/lib/server/http";

/** POST /api/billing-portal {t} — Stripe Customer Portal: update card, invoices, cancel online. */
export async function POST(req: Request) {
  try {
    const { t } = (await req.json().catch(() => ({}))) as { t?: string };
    const r = await recordFromToken(t);
    if (!r) return json({ ok: false, error: "invalid_link" }, 404);
    const id = r.id;
    const customer = r.subscription?.customerId ?? r.payment?.customerId;
    if (!customer) return json({ ok: false, error: "no_customer" }, 404);
    if (!stripeConfigured()) return json({ ok: false, error: "payments_not_configured" }, 503);
    const s = await billingPortal(customer, `${siteOrigin(req)}/status?t=${encodeURIComponent(playerToken(id, r.linkVersion ?? 1))}`);
    return json({ ok: true, url: s.url });
  } catch (e) { return failure(e, "billing-portal"); }
}
