"use client";
/**
 * Netlify Forms delivery (static export compatible).
 * Forms are declared in public/__forms.html so Netlify detects them at deploy; the client posts here.
 * Netlify stores each submission and emails it to the notification address configured in the
 * Netlify dashboard (Forms → Notifications) — the internal address never ships in this code.
 * A failed POST is reported as a failure: nothing is ever shown as delivered when it wasn't.
 */
export type FieldValue = string | File | null | undefined;

export interface DeliveryResult { ok: boolean; status: number; error?: string }

const ENDPOINT = "/__forms.html";

export async function submitNetlifyForm(formName: string, fields: Record<string, FieldValue>): Promise<DeliveryResult> {
  const hasFile = Object.values(fields).some((v) => typeof File !== "undefined" && v instanceof File);
  try {
    let res: Response;
    if (hasFile) {
      const fd = new FormData();
      fd.append("form-name", formName);
      for (const [k, v] of Object.entries(fields)) if (v !== null && v !== undefined && v !== "") fd.append(k, v);
      res = await fetch(ENDPOINT, { method: "POST", body: fd });
    } else {
      const body = new URLSearchParams({ "form-name": formName });
      for (const [k, v] of Object.entries(fields)) if (typeof v === "string" && v !== "") body.append(k, v);
      res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
    }
    return res.ok ? { ok: true, status: res.status } : { ok: false, status: res.status, error: `Delivery failed (HTTP ${res.status}).` };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error ? e.message : "Network error" };
  }
}
