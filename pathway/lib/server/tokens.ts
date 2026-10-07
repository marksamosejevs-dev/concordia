/**
 * Signed links and the admin session (HMAC-SHA256 with PATHWAY_SECRET).
 * Player link: /status?t=<appId>.<sig> — grants access to that one application's status, payment and onboarding.
 */
import crypto from "node:crypto";
import { env } from "./env";

export class NotConfigured extends Error { constructor(what: string) { super(`${what} is not configured.`); } }

const key = () => { if (!env.secret || env.secret.length < 32) throw new NotConfigured("PATHWAY_SECRET"); return env.secret; };
const mac = (msg: string) => crypto.createHmac("sha256", key()).update(msg).digest("base64url").slice(0, 32);
const same = (a: string, b: string) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

export const playerToken = (appId: string) => `${appId}.${mac(`player:${appId}`)}`;
export function verifyPlayerToken(t: string | null | undefined): string | null {
  if (!t) return null;
  const i = t.lastIndexOf(".");
  if (i < 1) return null;
  const id = t.slice(0, i), sig = t.slice(i + 1);
  if (!/^CS-\d{4,}$/.test(id)) return null;
  try { return same(sig, mac(`player:${id}`)) ? id : null; } catch { return null; }
}

export const ADMIN_COOKIE = "cs_admin";
const ADMIN_HOURS = 12;
export function adminSession(): { value: string; maxAge: number } {
  const exp = Date.now() + ADMIN_HOURS * 3600_000;
  return { value: `${exp}.${mac(`admin:${exp}`)}`, maxAge: ADMIN_HOURS * 3600 };
}
export function verifyAdminSession(v: string | undefined): boolean {
  if (!v) return false;
  const [exp, sig] = v.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  try { return same(sig, mac(`admin:${exp}`)); } catch { return false; }
}
export function checkAdminPassword(p: string): boolean {
  if (!env.adminPassword || env.adminPassword.length < 12) throw new NotConfigured("PATHWAY_ADMIN_PASSWORD");
  const a = crypto.createHash("sha256").update(p).digest(), b = crypto.createHash("sha256").update(env.adminPassword).digest();
  return crypto.timingSafeEqual(a, b);
}
