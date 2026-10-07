import { isAdmin } from "@/lib/server/admin";
import { exportAll } from "@/lib/server/records";
import { failure } from "@/lib/server/http";

/** GET /api/admin/export — full JSON backup of all application records (admin only, never cached). */
export async function GET() {
  if (!(await isAdmin())) return new Response(JSON.stringify({ ok: false, error: "unauthorised" }), { status: 401, headers: { "content-type": "application/json" } });
  try {
    const data = await exportAll();
    return new Response(JSON.stringify(data, null, 2), { headers: { "content-type": "application/json", "cache-control": "no-store", "content-disposition": `attachment; filename="pathway-applications-${data.exportedAt.slice(0, 10)}.json"` } });
  } catch (e) { return failure(e, "admin-export"); }
}
