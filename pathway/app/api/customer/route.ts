import { recordFromToken } from "@/lib/server/records";
import { customerAction, type CustomerAction } from "@/lib/server/workflow";
import { playerView } from "@/lib/server/view";
import { siteOrigin } from "@/lib/server/env";
import { json, failure } from "@/lib/server/http";

/** POST /api/customer {t, action} — consumer actions from the signed status link: early start, withdrawal. */
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { t?: string } & Partial<CustomerAction>;
  const r = await recordFromToken(b.t);
  if (!r) return json({ ok: false, error: "invalid_link" }, 404);
  const id = r.id;
  if (b.action !== "early_start" && !(b.action === "withdraw" && (b.contract === "assessment" || b.contract === "pathway"))) return json({ ok: false, error: "unknown_action" }, 400);
  try {
    const { record } = await customerAction(id, b as CustomerAction, siteOrigin(req));
    return json({ ok: true, view: playerView(record) });
  } catch (e) { return failure(e, "customer-action"); }
}
