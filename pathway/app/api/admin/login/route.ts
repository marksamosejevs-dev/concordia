import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminSession, checkAdminPassword } from "@/lib/server/tokens";
import { json, failure } from "@/lib/server/http";

/** POST /api/admin/login {password} · DELETE logs out. */
export async function POST(req: Request) {
  try {
    const { password } = (await req.json().catch(() => ({}))) as { password?: string };
    await new Promise((r) => setTimeout(r, 400)); // slow down guessing
    if (!password || !checkAdminPassword(password)) return json({ ok: false, error: "invalid_password" }, 401);
    const s = adminSession();
    (await cookies()).set(ADMIN_COOKIE, s.value, { httpOnly: true, secure: process.env.NODE_ENV === "production" && !req.url.startsWith("http://localhost"), sameSite: "strict", path: "/", maxAge: s.maxAge });
    return json({ ok: true });
  } catch (e) { return failure(e, "admin-login"); }
}
export async function DELETE() {
  (await cookies()).delete(ADMIN_COOKIE);
  return json({ ok: true });
}
