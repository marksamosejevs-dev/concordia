import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminSession, checkAdminPassword } from "@/lib/server/tokens";
import { json, failure, sameOrigin, clientKey } from "@/lib/server/http";
import { loginBlocked, recordLoginFailure, clearLoginFailures } from "@/lib/server/ratelimit";

/** POST /api/admin/login {password} · DELETE logs out. */
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return json({ ok: false, error: "bad_origin" }, 403);
    const key = clientKey(req);
    if (await loginBlocked(key)) return json({ ok: false, error: "too_many_attempts", message: "Too many failed attempts. Try again in 15 minutes." }, 429);
    const { password } = (await req.json().catch(() => ({}))) as { password?: string };
    await new Promise((r) => setTimeout(r, 400)); // slow down guessing
    if (!password || !checkAdminPassword(password)) { await recordLoginFailure(key); return json({ ok: false, error: "invalid_password" }, 401); }
    await clearLoginFailures(key);
    const s = adminSession();
    (await cookies()).set(ADMIN_COOKIE, s.value, { httpOnly: true, secure: process.env.NODE_ENV === "production" && !req.url.startsWith("http://localhost"), sameSite: "strict", path: "/", maxAge: s.maxAge });
    return json({ ok: true });
  } catch (e) { return failure(e, "admin-login"); }
}
export async function DELETE() {
  (await cookies()).delete(ADMIN_COOKIE);
  return json({ ok: true });
}
