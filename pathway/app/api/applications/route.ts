import { validateApplication } from "@/lib/applications/validate";
import { triage, ageFrom } from "@/lib/applications/triage";
import { campaignFor } from "@/lib/campaigns";
import { createApplication, LEGAL_VERSION } from "@/lib/server/records";
import { afterApplication } from "@/lib/server/workflow";
import { siteOrigin } from "@/lib/server/env";
import { json, failure } from "@/lib/server/http";
import type { Attribution } from "@/lib/attribution";

/** POST /api/applications — the only way an application is created. Stored first, then emails are sent. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
  if (typeof body.website === "string" && body.website.trim()) return json({ ok: false, error: "rejected" }, 400); // honeypot
  const v = validateApplication(body.data);
  if (!v.ok) return json({ ok: false, error: "validation", errors: v.errors }, 422);
  const data = v.data;
  const attribution = sanitizeAttribution(body.attribution);
  const age = ageFrom(data.dateOfBirth);
  const isMinor = age !== null && age < 18;
  const playerFirst = data.fullName.split(/\s+/)[0];
  const contact = isMinor && data.guardian
    ? { name: data.guardian.name, firstName: data.guardian.name.split(/\s+/)[0], emails: [data.guardian.email, data.email] }
    : { name: data.fullName, firstName: playerFirst, emails: [data.email] };
  const at = new Date().toISOString();
  try {
    const rec = await createApplication({
      data, triage: triage(data), attribution, campaign: campaignFor(attribution.last?.utm_campaign ?? attribution.first?.utm_campaign)?.key, isMinor, contact,
      consents: [
        { key: "terms_privacy", at, version: LEGAL_VERSION },
        ...(isMinor ? [{ key: "guardian_consent", at, version: LEGAL_VERSION }] : []),
        ...(data.consents.agencyView ? [{ key: "agency_view", at, version: LEGAL_VERSION }] : []),
        ...(data.consents.marketing ? [{ key: "marketing", at, version: LEGAL_VERSION }] : []),
      ],
    });
    const mail = await afterApplication(rec, siteOrigin(req));
    return json({ ok: true, id: rec.id, firstName: isMinor ? contact.firstName : playerFirst, confirmationEmailSent: mail.applicantOk, email: contact.emails[0] }, 201);
  } catch (e) { return failure(e, "applications"); }
}

function sanitizeAttribution(a: unknown): Attribution {
  const t = (x: unknown) => {
    if (!x || typeof x !== "object") return undefined;
    const o = x as Record<string, unknown>; const out: Record<string, string> = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "partner", "landing", "referrer", "at"]) if (typeof o[k] === "string") out[k] = (o[k] as string).slice(0, 200);
    return out.landing ? (out as unknown as Attribution["first"]) : undefined;
  };
  const o = (a ?? {}) as Record<string, unknown>;
  return { first: t(o.first), last: t(o.last) };
}
