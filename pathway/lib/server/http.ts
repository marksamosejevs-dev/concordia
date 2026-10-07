import crypto from "node:crypto";
import { StorageUnavailable } from "./store";
import { NotConfigured } from "./tokens";
import { ActionError } from "./workflow";

export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Maps internal errors to honest client responses (never a fake success). */
export function failure(e: unknown, context: string) {
  if (e instanceof NotConfigured || e instanceof StorageUnavailable) { console.error(`[${context}] not configured: ${e.message}`); return json({ ok: false, error: "not_configured", message: e.message }, 503); }
  if (e instanceof ActionError) return json({ ok: false, error: "invalid_action", message: e.message }, 409);
  console.error(`[${context}]`, e);
  return json({ ok: false, error: "server_error" }, 500);
}

/** Country of the request (ISO code only — no IP is stored). Netlify adds x-nf-geo. */
export function requestCountry(req: Request): string | undefined {
  const geo = req.headers.get("x-nf-geo");
  if (geo) { try { const g = JSON.parse(Buffer.from(geo, "base64").toString("utf8")) as { country?: { code?: string } }; if (g.country?.code) return g.country.code.toUpperCase(); } catch { /* ignore */ } }
  return req.headers.get("x-country")?.toUpperCase() || undefined;
}

/** Same-origin check for state-changing admin requests (defence in depth on top of the SameSite=Strict cookie). */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients send none; the session cookie is still required
  try { return new URL(origin).host === new URL(req.url).host || new URL(origin).host === req.headers.get("host"); } catch { return false; }
}

/** Client address as a short hash (used only for login throttling; never stored in clear). */
export function clientKey(req: Request): string {
  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 24);
}
