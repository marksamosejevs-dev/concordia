import { recordFromToken, updateApplication, type FileRef, type MaterialsSubmission } from "@/lib/server/records";
import { afterMaterials } from "@/lib/server/workflow";
import { store } from "@/lib/server/store";
import { siteOrigin } from "@/lib/server/env";
import { json, failure } from "@/lib/server/http";
import { ONBOARDING, NOT_AVAILABLE, UPLOAD } from "@/content/onboarding";

const MB = 1024 * 1024;
const ALLOWED = /\.(pdf|docx?|png|jpe?g|heic)$/i;
const isUrl = (s: string) => /^https?:\/\/\S+\.\S+/i.test(s.trim());

/**
 * POST /api/onboarding (multipart) — materials after a VERIFIED payment.
 * Submitting does NOT start the 7-day period: the team confirms sufficiency in the admin.
 */
export async function POST(req: Request) {
  let fd: FormData;
  try { fd = await req.formData(); } catch { return json({ ok: false, error: "invalid_form" }, 400); }
  try {
    const r = await recordFromToken(String(fd.get("t") ?? ""));
    if (!r) return json({ ok: false, error: "invalid_link" }, 404);
    const id = r.id;
    if (!(r.paymentReceivedAt && r.payment?.status === "paid")) return json({ ok: false, error: "payment_not_confirmed", message: "Onboarding opens once your payment is confirmed." }, 403);

    const values: Record<string, string> = {};
    let raw: Record<string, unknown> = {};
    try { raw = JSON.parse(String(fd.get("values") ?? "{}")); } catch { /* validated below */ }
    const fields = ONBOARDING.flatMap((s) => s.fields);
    for (const f of fields) if (f.type !== "file" && f.type !== "checkbox" && typeof raw[f.name] === "string") values[f.name] = (raw[f.name] as string).trim().slice(0, 4000);
    const notAvailable = fields.filter((f) => f.type === "checkbox" && raw[f.name] === true).map((f) => Object.keys(NOT_AVAILABLE).find((k) => NOT_AVAILABLE[k] === f.name)).filter((x): x is string => Boolean(x));
    const healthConsent = fd.get("healthConsent") === "true";

    const e: Record<string, string> = {};
    for (const f of fields) {
      const skipped = f.skipIf ? raw[f.skipIf] === true : false;
      if (f.required && !skipped && !values[f.name]) e[f.name] = "Required";
      if (f.type === "url" && values[f.name] && !isUrl(values[f.name])) e[f.name] = "Please paste a full link starting with https://";
    }
    if ((values.has_agent ?? "").startsWith("Yes") && !values.agent_details) e.agent_details = "Tell us who represents you and until when";
    if (values.injuries && !healthConsent) e.healthConsent = "Please give explicit consent, or leave the injury field empty";

    const files: { field: string; file: File }[] = [];
    let total = 0;
    for (const f of fields.filter((x) => x.type === "file")) {
      const v = fd.get(f.name);
      if (!(v instanceof File) || v.size === 0) continue;
      total += v.size;
      if (UPLOAD.blocked.test(v.name)) e[f.name] = "Please share video as a link, not a file";
      else if (!ALLOWED.test(v.name)) e[f.name] = "PDF, Word or image files only";
      else if (v.size > UPLOAD.perFileMB * MB) e[f.name] = `Files up to ${UPLOAD.perFileMB} MB — share bigger files as a link`;
      else files.push({ field: f.name, file: v });
    }
    if (total > UPLOAD.totalMB * MB) e.cv_file = `Total uploads must stay under ${UPLOAD.totalMB} MB`;
    if (Object.keys(e).length) return json({ ok: false, error: "validation", errors: e }, 422);

    const at = new Date().toISOString();
    const refs: FileRef[] = [];
    for (const { field, file } of files) {
      const safe = file.name.replace(/[^\w.\-]+/g, "_").slice(-80);
      const key = `files/${id}/${at.replace(/[:.]/g, "-")}-${field}-${safe}`;
      await store().setBinary(key, await file.arrayBuffer(), { name: file.name, type: file.type || "application/octet-stream", app: id });
      refs.push({ key, name: file.name, size: file.size, type: file.type, field });
    }
    // Health data is kept only with explicit consent (GDPR Art. 9(2)(a)).
    if (!healthConsent) delete values.injuries;
    const m: MaterialsSubmission = { at, values, notAvailable, files: refs, healthConsent };
    await updateApplication(id, (x) => { x.materials.push(m); x.materialsSubmittedAt = at; x.reviewStartedAt = undefined; }, { type: "materials_submitted", detail: `submission ${r.materials.length + 1}` });
    await afterMaterials(id, m, siteOrigin(req));
    return json({ ok: true, submissions: r.materials.length + 1 });
  } catch (e) { return failure(e, "onboarding"); }
}
