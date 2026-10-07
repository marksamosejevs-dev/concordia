import { isAdmin } from "@/lib/server/admin";
import { store } from "@/lib/server/store";
import { json, failure } from "@/lib/server/http";

/** GET /api/admin/files?key=files/CS-1001/… — uploaded materials, admin only. */
export async function GET(req: Request) {
  if (!(await isAdmin())) return json({ ok: false, error: "unauthorised" }, 401);
  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!/^files\/CS-\d+\//.test(key) || key.includes("..")) return json({ ok: false, error: "bad_key" }, 400);
  try {
    const f = await store().getBinary(key);
    if (!f) return json({ ok: false, error: "not_found" }, 404);
    return new Response(f.data, { headers: { "Content-Type": f.meta.type || "application/octet-stream", "Content-Disposition": `attachment; filename="${(f.meta.name || "file").replace(/["\r\n]/g, "")}"`, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (e) { return failure(e, "admin-files"); }
}
