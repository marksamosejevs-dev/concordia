import { recordFromToken } from "@/lib/server/records";
import { playerView } from "@/lib/server/view";
import { json, failure } from "@/lib/server/http";

/** GET /api/status?t=<signed link> */
export async function GET(req: Request) {
  try {
    const r = await recordFromToken(new URL(req.url).searchParams.get("t"));
    if (!r) return json({ ok: false, error: "invalid_link" }, 404);
    return json({ ok: true, view: playerView(r) });
  } catch (e) { return failure(e, "status"); }
}
