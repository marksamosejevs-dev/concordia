"use client";
import Link from "next/link";
import { useState } from "react";
import { useMounted } from "@/lib/hooks";
import { ONBOARDING, FORM_NAMES, UPLOAD, NOT_AVAILABLE, type OnbField } from "@/content/onboarding";
import { DELIVERY_FULL } from "@/content/assessment";
import { lastApplication } from "@/lib/applications/destination";
import { lastOrder, materialsFor, saveMaterials, fmtDate, paymentConfirmed, type MaterialsRecord } from "@/lib/funnel";
import { submitNetlifyForm } from "@/lib/forms/netlify";
import { readAttribution } from "@/lib/attribution";
import { campaignFor } from "@/lib/campaigns";
import { FlowLine } from "./FlowLine";
import { track } from "@/lib/analytics";
import { IS_REVIEW } from "@/lib/site-mode";

/**
 * Onboarding — sent immediately after a CONFIRMED $249 payment.
 * Submitting does NOT start the 7-day period: the team first confirms whether the materials are
 * sufficient for this player (lib/assessment-status.ts). No field is treated as a sufficiency signal.
 */
type Vals = Record<string, string | boolean>;
const MB = 1024 * 1024;
const isUrl = (s: string) => /^https?:\/\/\S+\.\S+/i.test(s.trim());

export function OnboardingForm() {
  const mounted = useMounted();
  if (!mounted) return <div className="h-64" />;
  return <OnboardingInner />;
}

function prefill(): Vals {
  const a = lastApplication()?.data;
  if (!a) return {};
  return {
    full_name: a.fullName, football_category: a.footballCategory ?? "", dob: a.dateOfBirth, nationalities: a.nationality, passports: a.passports.join(", "), current_country: a.residence,
    positions: a.positions.join(", "), preferred_foot: a.foot && ["Right", "Left", "Both"].includes(a.foot) ? a.foot : "", height: a.height ?? "", current_club: a.currentClub ?? "",
    previous_clubs: a.previousClubs ?? "", international_experience: a.nationalTeam ?? "", transfermarkt_url: a.transfermarktUrl ?? "", highlights_url: a.highlightsUrl ?? "",
    full_match_urls: a.fullMatchUrl ?? "", target_countries: a.targetCountries.join(", "), has_agent: a.hasAgent === "Yes" ? "Yes — currently represented" : a.hasAgent === "No" ? "No" : "",
  };
}

function OnboardingInner() {
  const orderRef = (() => { try { return new URLSearchParams(location.search).get("order"); } catch { return null; } })() ?? lastOrder()?.order.id ?? null;
  const paid = lastOrder();
  const confirmed = paymentConfirmed(paid);
  const [v, setV] = useState<Vals>(prefill);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [record, setRecord] = useState<MaterialsRecord | null>(() => (orderRef ? materialsFor(orderRef) : null));
  const [editing, setEditing] = useState(false);

  // A failed or unconfirmed payment never unlocks onboarding (review builds allow preview payments for testing).
  if (!IS_REVIEW && (!orderRef || !confirmed)) return (
    <div className="rounded-[16px] border border-white/15 bg-ink-deep p-8">
      <h1 className="display d-md">We can’t see a confirmed payment yet.</h1>
      <p className="mt-3 text-white/75">Onboarding opens once your $249 Pathway Assessment payment is confirmed. Please use the link in your payment confirmation email.</p>
    </div>
  );
  if (record && !editing) return <MaterialsReceived record={record} onAddMore={() => setEditing(true)} />;

  const set = (k: string, val: string | boolean) => { setV((x) => ({ ...x, [k]: val })); setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const skipped = (f: OnbField) => Boolean(f.skipIf && v[f.skipIf]);
  const update = Boolean(record);

  // Only genuinely required identity/context fields are mandatory. Football items may be "not available".
  const validate = () => {
    const e: Record<string, string> = {};
    for (const s of ONBOARDING) for (const f of s.fields) {
      const val = v[f.name];
      if (f.required && !skipped(f) && (!val || (typeof val === "string" && !val.trim()))) e[f.name] = "Required";
      if (f.type === "url" && !skipped(f) && typeof val === "string" && val.trim() && !isUrl(val)) e[f.name] = "Please paste a full link starting with https://";
    }
    if (String(v.has_agent ?? "").startsWith("Yes") && !String(v.agent_details ?? "").trim()) e.agent_details = "Tell us who represents you and until when";
    let total = 0;
    for (const [k, file] of Object.entries(files)) {
      if (!file) continue;
      total += file.size;
      if (UPLOAD.blocked.test(file.name)) e[k] = "Please share video as a link (YouTube, Vimeo, Google Drive…), not a file";
      else if (file.size > UPLOAD.perFileMB * MB) e[k] = `Files up to ${UPLOAD.perFileMB} MB — share bigger files as a link`;
    }
    if (total > UPLOAD.totalMB * MB) e.cv_file = `Total uploads must stay under ${UPLOAD.totalMB} MB`;
    setErrors(e);
    if (Object.keys(e).length) setTimeout(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0);
    return Object.keys(e).length === 0;
  };

  /** "Not available" (player says it doesn't exist) vs "Not provided" (left blank). */
  const show = (k: string) => {
    const flag = NOT_AVAILABLE[k];
    if (flag && v[flag]) return "Not available";
    const x = v[k];
    return typeof x === "string" && x.trim() ? x.trim() : "Not provided";
  };

  const submit = async () => {
    if (!validate()) return;
    setSending(true); setDeliveryError("");
    const now = new Date().toISOString();
    const name = String(v.full_name);
    const attr = readAttribution();
    const camp = campaignFor(attr.last?.utm_campaign ?? attr.first?.utm_campaign);
    const fileName = (k: string) => files[k]?.name;
    const appId = paid?.order.applicationId ?? lastApplication()?.id ?? "—";
    const payState = confirmed ? "Confirmed" : paid?.session.status === "preview" ? "PREVIEW ONLY — not a real payment (review build)" : "Not confirmed";
    const summary = [
      `PATHWAY ASSESSMENT — ${name}${update ? " (UPDATE)" : ""}`, "",
      "PLAYER", `Name: ${show("full_name")}`, `Football: ${show("football_category")}`, `DOB: ${show("dob")}`, `Nationality: ${show("nationalities")}`, `Passports / eligibility: ${show("passports")}`, `Current country: ${show("current_country")}`, "",
      "FOOTBALL", `Position: ${show("positions")}`, `Preferred foot: ${show("preferred_foot")}`, `Height: ${show("height")}`, `Current club: ${v.no_current_club ? "None — free agent" : show("current_club")}`, `Contract status: ${show("contract_status")}`, `Contract expiry: ${show("contract_expiry")}`, `Previous clubs: ${show("previous_clubs")}`, `Recent playing history: ${show("playing_history")}`, `Statistics: ${show("statistics")}`, `International experience: ${show("international_experience")}`, "",
      "PROFILES", `Transfermarkt: ${show("transfermarkt_url")}`, `Other profile: ${show("other_profile_url")}`, "",
      "VIDEO", `Highlights: ${show("highlights_url")}`, `Full matches: ${show("full_match_urls")}`, `Additional footage: ${show("additional_footage")}`, "",
      "DOCUMENTS", `CV: ${fileName("cv_file") ? `attached (${fileName("cv_file")})` : show("cv_url")}`, `Other uploaded documents: ${fileName("other_document") ?? "None"}`, "",
      "PLAYER OBJECTIVE", show("objective"), `Target countries / leagues: ${show("target_countries")}`, "",
      "REPRESENTATION STATUS", show("has_agent"), `Details: ${show("agent_details")}`, `Agreement expiry: ${show("agreement_expiry")}`, `Agreement file: ${fileName("agreement_file") ?? "None"}`, "",
      "INJURIES", show("injuries"), "",
      "PAYMENT / ADMIN", `Payment reference: ${orderRef ?? "—"} (${payState})`, `Application ID: ${appId}`, `Date of payment: ${confirmed ? fmtDate(paid?.paidAt) : "—"}`, `Materials submitted: ${fmtDate(now)}${update ? ` (submission ${(record?.submissions ?? 0) + 1})` : ""}`,
      "Assessment start: NOT STARTED — Concordia to review and confirm the materials are sufficient", "Target completion: — (7 days from the sufficiency confirmation date, once payment is confirmed)",
      `Campaign: ${camp?.key ?? attr.last?.utm_campaign ?? "—"}`,
    ].join("\n");

    const fields: Record<string, string | File | null> = {};
    for (const s of ONBOARDING) for (const f of s.fields) fields[f.name] = f.type === "file" ? files[f.name] ?? null : typeof v[f.name] === "boolean" ? (v[f.name] ? "Yes — not available" : "") : String(v[f.name] ?? "");
    Object.assign(fields, {
      subject: `PATHWAY ASSESSMENT — ${name}${update ? " (UPDATE)" : ""}`, application_id: appId, order_ref: orderRef ?? "",
      payment_status: confirmed ? "confirmed" : paid?.session.status === "preview" ? "preview-not-a-payment" : "not-confirmed", payment_date: confirmed ? paid?.paidAt ?? "" : "", materials_submitted: now,
      assessment_status: "materials_under_review", assessment_start: "not-started", target_completion: "", submission_type: update ? "update" : "initial",
      football_segment: String(v.football_category ?? ""), campaign: camp?.key ?? attr.last?.utm_campaign ?? "", summary,
    });
    const r = await submitNetlifyForm(FORM_NAMES.onboarding, fields);
    setSending(false);
    if (!r.ok) { track("onboarding_delivery_failed", { status: r.status }); setDeliveryError("We couldn’t send your materials just now. Your answers are still here — please try again in a moment."); return; }
    const rec: MaterialsRecord = { orderRef: orderRef ?? "review", submittedAt: now, firstSubmittedAt: record?.firstSubmittedAt ?? now, submissions: (record?.submissions ?? 0) + 1 };
    saveMaterials(rec); setRecord(rec); setEditing(false); window.scrollTo({ top: 0, behavior: "smooth" });
    track("onboarding_submitted", { update, segment: String(v.football_category ?? "") });
  };

  const inp = "mt-2 block w-full rounded-[8px] border border-white/20 bg-ink px-4 py-3 text-white focus:border-route focus:outline-none aria-[invalid=true]:border-alert";
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate className="space-y-6">
      <div className="rounded-[16px] border border-route/50 bg-ink-deep p-7 sm:p-9">
        <h1 className="display d-lg max-w-[18ch]">{update ? "Send more or corrected materials." : "Send your football profile + materials."}</h1>
        <p className="lede mt-4 max-w-2xl text-white/85">{update ? "We already have your first submission. Anything you send now is added to it." : "Everything we need for your Pathway Assessment, in one go. Links are best for video. If something doesn’t exist yet — no Transfermarkt profile, no highlight video, no current club — just tick it. That’s not a problem in itself."}</p>
        <p className="mt-4 text-[0.88rem] text-white/60">{DELIVERY_FULL}</p>
        {orderRef && <p className="mt-2 text-[0.8rem] text-white/45">Payment reference {orderRef}</p>}
        {IS_REVIEW && !confirmed && <p className="gate-tag mt-3 inline-block">Review build · preview payment (not a real payment) — submissions are marked accordingly</p>}
      </div>

      {ONBOARDING.map((s) => (
        <fieldset key={s.key} className="rounded-[16px] border border-white/12 bg-ink-deep p-6 sm:p-8">
          <legend className="sr-only">{s.title}</legend>
          <h2 className="display text-[1.8rem] leading-none">{s.title}</h2>
          {s.intro && <p className="mt-2 text-[0.9rem] text-white/65">{s.intro}</p>}
          {s.key === "representation" && String(v.has_agent ?? "").startsWith("Yes") && <p className="mt-3 rounded-[8px] bg-white/10 px-3 py-2 text-[0.85rem] text-white/80">That’s fine — the assessment is advisory and doesn’t affect your existing agreement. Please tell us who represents you and until when.</p>}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {s.fields.map((f) => {
              const err = errors[f.name]; const dis = skipped(f);
              const wide = f.type === "textarea" || f.type === "checkbox" || f.name === "objective";
              if (f.type === "checkbox") return (
                <label key={f.name} className="flex items-center gap-3 text-[0.92rem] sm:col-span-2"><input type="checkbox" checked={Boolean(v[f.name])} onChange={(e) => set(f.name, e.target.checked)} className="h-5 w-5 accent-[#FFD23F]" />{f.label}</label>
              );
              return (
                <label key={f.name} className={`text-[0.92rem] font-semibold ${wide ? "sm:col-span-2" : ""} ${dis ? "opacity-40" : ""}`}>
                  {f.label}{f.required && <span className="text-route"> *</span>}
                  {f.type === "textarea" ? <textarea rows={3} disabled={dis} aria-invalid={Boolean(err)} className={inp} value={String(v[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />
                    : f.type === "select" ? <select aria-invalid={Boolean(err)} className={inp} value={String(v[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)}><option value="">Choose…</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
                    : f.type === "file" ? <input type="file" accept={UPLOAD.accept} aria-invalid={Boolean(err)} className={`${inp} file:mr-3 file:rounded-full file:border-0 file:bg-route file:px-3 file:py-1 file:font-semibold file:text-ink`} onChange={(e) => { setFiles((x) => ({ ...x, [f.name]: e.target.files?.[0] ?? null })); setErrors((er) => { const n = { ...er }; delete n[f.name]; return n; }); }} />
                    : <input type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"} inputMode={f.type === "url" ? "url" : undefined} disabled={dis} aria-invalid={Boolean(err)} className={inp} value={String(v[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder ?? (f.type === "url" ? "https://" : undefined)} />}
                  {f.help && <span className="mt-1 block text-[0.78rem] font-normal text-white/50">{f.help}</span>}
                  {err && <span role="alert" className="mt-1 block text-[0.82rem] font-semibold text-[#ff7a66]">{err}</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="rounded-[16px] border border-white/12 bg-ink-deep p-6 sm:p-8">
        {Object.keys(errors).length > 0 && <p role="alert" className="mb-4 font-semibold text-[#ff7a66]">Some details are missing — they’re highlighted above.</p>}
        {deliveryError && <p role="alert" className="mb-4 border-l-2 border-alert pl-4 text-white">{deliveryError}</p>}
        <button type="submit" disabled={sending} className="btn btn-route w-full sm:w-auto">{sending ? "Sending…" : update ? "Send additional materials" : "Send my materials"} <span className="arrow">→</span></button>
        {update && <button type="button" onClick={() => setEditing(false)} className="ml-0 mt-3 block text-[0.9rem] underline underline-offset-4 sm:ml-4 sm:mt-0 sm:inline">Cancel</button>}
        <p className="mt-4 text-[0.82rem] text-white/55">Your materials go straight to the Concordia assessment team and are used only for your assessment.</p>
      </div>
    </form>
  );
}

/** After submission: received → our team checks sufficiency. No assessment start or deadline is shown here. */
function MaterialsReceived({ record, onAddMore }: { record: MaterialsRecord; onAddMore: () => void }) {
  return (
    <div className="space-y-8">
      <div className="rounded-[16px] border border-route/60 bg-ink-deep p-7 sm:p-10">
        <h1 className="display d-lg max-w-[18ch]">Thanks — we’ve received your materials.</h1>
        <p className="lede mt-4 max-w-2xl text-white/85">Our team will review them to confirm whether we have the information reasonably required to begin your Pathway Assessment. We’ll email you either way — to confirm your assessment has started, or to ask for anything we still need.</p>
        <dl className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-[0.9rem] sm:grid-cols-3">
          <div><dt className="text-white/55">Received</dt><dd className="mt-1 font-semibold">{fmtDate(record.submittedAt)}{record.submissions > 1 ? ` · ${record.submissions} submissions` : ""}</dd></div>
          <div><dt className="text-white/55">Status</dt><dd className="mt-1 font-semibold">We’re checking your materials</dd></div>
          <div><dt className="text-white/55">Assessment start</dt><dd className="mt-1 font-semibold">After our materials check</dd></div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={onAddMore} className="btn btn-ghost">Send something else</button>
          <Link href="/assessment-status/" className="btn btn-ghost">Your assessment status</Link>
        </div>
      </div>
      <FlowLine current={6} />
    </div>
  );
}
