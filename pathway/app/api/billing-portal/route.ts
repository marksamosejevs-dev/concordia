import { verifyPlayerToken, playerToken } from "@/lib/server/tokens";
import { getApplication } from "@/lib/server/records";
import { billingPortal, stripeConfigured } from "@/lib/server/payments";
import { siteOrigin } from "@/lib/server/env";
import { json, failure } from "@/lib/server/http";

/** POST /api/billing-portal {t} — Stripe Customer Portal: update card, invoices, cancel online. */
export async function POST(req: Request) {
  try {
    const { t } = (await req.json().catch(() => ({}))) as { t?: string };
    const id = verifyPlayerToken(t);
    if (!id) return json({ ok: false, error: "invalid_link" }, 404);
    const r = await getApplication(id);
    const customer = r?.subscription?.customerId ?? r?.payment?.customerId;
    if (!r || !customer) return json({ ok: false, error: "no_customer" }, 404);
    if (!stripeConfigured()) return json({ ok: false, error: "payments_not_configured" }, 503);
    const s = await billingPortal(customer, `${siteOrigin(req)}/status?t=${encodeURIComponent(playerToken(id))}`);
    return json({ ok: true, url: s.url });
  } catch (e) { return failure(e, "billing-portal"); }
}
