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

/**
 * Player link token: `<display ref>.<sig>` (version 1) or `<display ref>.<version>.<sig>` after the admin re-issues a
 * link. The signature (HMAC-SHA256, 192 bits) — not the sequential reference — is the access boundary: changing
 * CS-1042 to CS-1043 invalidates it. Re-issuing bumps the record's linkVersion, which revokes every older link.
 */
export const playerToken = (appId: string, version = 1) => version <= 1 ? `${appId}.${mac(`player:${appId}`)}` : `${appId}.${version}.${mac(`player:${appId}:${version}`)}`;
export function parsePlayerToken(t: string | null | undefined): { id: string; version: number } | null {
  if (!t) return null;
  const parts = t.split(".");
  if (parts.length < 2 || parts.length > 3) return null;
  const id = parts[0], sig = parts[parts.length - 1], version = parts.length === 3 ? Number(parts[1]) : 1;
  if (!/^CS-\d{4,}$/.test(id) || !Number.isInteger(version) || version < 1 || (parts.length === 3 && version < 2)) return null;
  try { return same(sig, mac(version === 1 ? `player:${id}` : `player:${id}:${version}`)) ? { id, version } : null; } catch { return null; }
}
/** Signature check only — use recordFromToken() in routes so revoked links are refused too. */
export const verifyPlayerToken = (t: string | null | undefined): string | null => parsePlayerToken(t)?.id ?? null;

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
