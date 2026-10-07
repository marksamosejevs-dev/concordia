import { isAdmin } from "@/lib/server/admin";
import { adminAction, type AdminAction } from "@/lib/server/workflow";
import { siteOrigin } from "@/lib/server/env";
import { json, failure } from "@/lib/server/http";

const ACTIONS = ["start_review", "accept", "not_accept", "resend_acceptance", "start_materials_review", "request_info", "confirm_sufficient", "assessment_ready", "call_completed", "offer_pathway", "note"];

/** POST /api/admin/applications/:id {action, …} — human review decisions. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return json({ ok: false, error: "unauthorised" }, 401);
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as AdminAction;
  if (!ACTIONS.includes(body.action)) return json({ ok: false, error: "unknown_action" }, 400);
  try {
    const res = await adminAction(id, body, siteOrigin(req));
    return json({ ok: true, emailed: res.emailed ?? null });
  } catch (e) { return failure(e, "admin-action"); }
}
