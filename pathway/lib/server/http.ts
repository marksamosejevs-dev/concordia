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
