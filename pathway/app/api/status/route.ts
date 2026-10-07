import { verifyPlayerToken } from "@/lib/server/tokens";
import { getApplication } from "@/lib/server/records";
import { playerView } from "@/lib/server/view";
import { json, failure } from "@/lib/server/http";

/** GET /api/status?t=<signed link> */
export async function GET(req: Request) {
  try {
    const id = verifyPlayerToken(new URL(req.url).searchParams.get("t"));
    if (!id) return json({ ok: false, error: "invalid_link" }, 404);
    const r = await getApplication(id);
    if (!r) return json({ ok: false, error: "not_found" }, 404);
    return json({ ok: true, view: playerView(r) });
  } catch (e) { return failure(e, "status"); }
}
