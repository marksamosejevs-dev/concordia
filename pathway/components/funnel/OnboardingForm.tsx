"use client";
import Link from "next/link";
import { useState } from "react";
import { useMounted } from "@/lib/hooks";
import { ONBOARDING, FORM_NAMES, UPLOAD, type OnbField } from "@/content/onboarding";
import { DELIVERY, ASSESSMENT_FACTS } from "@/content/assessment";
import { lastApplication } from "@/lib/applications/destination";
import { lastOrder, materialsFor, saveMaterials, addDays, fmtDate, type MaterialsRecord } from "@/lib/funnel";
import { submitNetlifyForm } from "@/lib/forms/netlify";
import { FlowLine } from "./FlowLine";
import { track } from "@/lib/analytics";
import { IS_REVIEW } from "@/lib/site-mode";

type Vals = Record<string, string | boolean>;
const MB = 1024 * 1024;
const isUrl = (s: string) => /^https?:\/\/\S+\.\S+/i.test(s.trim());
const hasFootage = (v: Vals) => [v.highlights_url, v.full_match_urls, v.additional_footage].some((x) => typeof x === "string" && x.trim());

export function OnboardingForm() {
  const mounted = useMounted();
  if (!mounted) return <div className="h-64" />;
  return <OnboardingInner />;
}

function prefill(): Vals {
  const a = lastApplication()?.data;
  if (!a) return {};
  return {
    full_name: a.fullName, dob: a.dateOfBirth, nationalities: a.nationality, passports: a.passports.join(", "), current_country: a.residence,
    positions: a.positions.join(", "), preferred_foot: a.foot && ["Right", "Left", "Both"].includes(a.foot) ? a.foot : "", height: a.height ?? "", current_club: a.currentClub ?? "",
    previous_clubs: a.previousClubs ?? "", international_experience: a.nationalTeam ?? "", transfermarkt_url: a.transfermarktUrl ?? "", highlights_url: a.highlightsUrl ?? "",
    full_match_urls: a.fullMatchUrl ?? "", target_countries: a.targetCountries.join(", "), has_agent: a.hasAgent === "Yes" ? "Yes — currently represented" : a.hasAgent === "No" ? "No" : "",
  };
}

function OnboardingInner() {
  const orderRef = (() => { try { return new URLSearchParams(location.search).get("order"); } catch { return null; } })() ?? lastOrder()?.order.id ?? null;
  const paid = lastOrder();
  const [v, setV] = useState<Vals>(prefill);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [record, setRecord] = useState<MaterialsRecord | null>(() => (orderRef ? materialsFor(orderRef) : null));
  const [editing, setEditing] = useState(false);

  if (!orderRef && !IS_REVIEW) return (
    <div className="rounded-[16px] border border-white/15 bg-ink-deep p-8">
      <h1 className="display d-md">Use the link from your payment confirmation.</h1>
      <p className="mt-3 text-white/75">This form opens after the $249 Pathway Assessment payment, so we can match your materials to your assessment.</p>
    </div>
  );
  if (record && !editing) return <MaterialsReceived record={record} onAddMore={() => setEditing(true)} />;

  const set = (k: string, val: string | boolean) => { setV((x) => ({ ...x, [k]: val })); setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const skipped = (f: OnbField) => Boolean(f.skipIf && v[f.skipIf]);
  const update = Boolean(record);

  const validate = () => {
    const e: Record<string, string> = {};
    for (const s of ONBOARDING) for (const f of s.fields) {
      const val = v[f.name];
      if (f.required && !skipped(f) && (!val || (typeof val === "string" && !val.trim()))) e[f.name] = "Required";
      if (f.type === "url" && typeof val === "string" && val.trim() && !isUrl(val)) e[f.name] = "Please paste a full link starting with https://";
    }
    if (!v.no_current_club && !String(v.current_club ?? "").trim()) e.current_club = "Add your current club, or tick “I don’t have a current club”";
    if (!v.no_transfermarkt && !String(v.transfermarkt_url ?? "").trim()) e.transfermarkt_url = "Paste your Transfermarkt link, or tick “I don’t have a Transfermarkt profile”";
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

  const submit = async () => {
    if (!validate()) return;
    setSending(true); setDeliveryError("");
    const now = new Date().toISOString();
    const complete = hasFootage(v);
    const due = complete ? addDays(now, ASSESSMENT_FACTS.deliveryDays) : undefined;
    const name = String(v.full_name);
    const val = (k: string) => { const x = v[k]; return typeof x === "string" && x.trim() ? x.trim() : "—"; };
    const fileName = (k: string) => files[k]?.name;
    const summary = [
      `PATHWAY ASSESSMENT — ${name}${update ? " (UPDATE)" : ""}`, "",
      "PLAYER", `Name: ${val("full_name")}`, `DOB: ${val("dob")}`, `Nationality: ${val("nationalities")}`, `Passports / eligibility: ${val("passports")}`, `Current country: ${val("current_country")}`, "",
      "FOOTBALL", `Position: ${val("positions")}`, `Preferred foot: ${val("preferred_foot")}`, `Height: ${val("height")}`, `Current club: ${v.no_current_club ? "No current club" : val("current_club")}`, `Contract status: ${val("contract_status")}`, `Contract expiry: ${val("contract_expiry")}`, `Previous clubs: ${val("previous_clubs")}`, `Recent playing history: ${val("playing_history")}`, `Statistics: ${val("statistics")}`, `International experience: ${val("international_experience")}`, "",
      "PROFILES", `Transfermarkt: ${v.no_transfermarkt ? "No Transfermarkt profile" : val("transfermarkt_url")}`, `Other profile: ${val("other_profile_url")}`, "",
      "VIDEO", `Highlights: ${v.no_highlights ? "No highlight video yet" : val("highlights_url")}`, `Full matches: ${val("full_match_urls")}`, `Additional footage: ${val("additional_footage")}`, complete ? "" : "⚠ NO FOOTAGE YET — assessment clock not started", "",
      "DOCUMENTS", `CV: ${fileName("cv_file") ? `attached (${fileName("cv_file")})` : val("cv_url")}`, `Other uploaded documents: ${fileName("other_document") ?? "—"}`, "",
      "PLAYER OBJECTIVE", val("objective"), `Target countries / leagues: ${val("target_countries")}`, "",
      "REPRESENTATION STATUS", val("has_agent"), `Details: ${val("agent_details")}`, `Agreement expiry: ${val("agreement_expiry")}`, `Agreement file: ${fileName("agreement_file") ?? "—"}`, "",
      "INJURIES", val("injuries"), "",
      "PAYMENT / ADMIN", `Payment reference: ${orderRef ?? "—"} (${paid?.session.status === "preview" ? "PREVIEW — not charged" : paid ? "confirmed" : "unknown on this device"})`, `Application ID: ${paid?.order.applicationId ?? lastApplication()?.id ?? "—"}`, `Date of payment: ${fmtDate(paid?.paidAt)}`, `Materials received: ${fmtDate(now)}`, `Assessment due by: ${due ? fmtDate(due) : "Starts when footage is received"}`,
    ].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");

    const fields: Record<string, string | File | null> = {};
    for (const s of ONBOARDING) for (const f of s.fields) fields[f.name] = f.type === "file" ? files[f.name] ?? null : typeof v[f.name] === "boolean" ? (v[f.name] ? "Yes" : "") : String(v[f.name] ?? "");
    Object.assign(fields, {
      subject: `PATHWAY ASSESSMENT — ${name}${update ? " (UPDATE)" : ""}`, application_id: paid?.order.applicationId ?? lastApplication()?.id ?? "", order_ref: orderRef ?? "",
      payment_status: paid?.session.status === "preview" ? "preview-not-charged" : paid ? "confirmed" : "unknown", payment_date: paid?.paidAt ?? "", materials_received: now,
      assessment_due: due ?? "pending-footage", materials_status: complete ? "complete" : "incomplete-footage-missing", submission_type: update ? "update" : "initial", summary,
    });
    const r = await submitNetlifyForm(FORM_NAMES.onboarding, fields);
    setSending(false);
    if (!r.ok) { track("onboarding_delivery_failed", { status: r.status }); setDeliveryError("We couldn’t send your materials just now. Your answers are still here — please try again in a moment."); return; }
    const rec: MaterialsRecord = { orderRef: orderRef ?? "review", submittedAt: now, complete: complete || Boolean(record?.complete), dueBy: due ?? record?.dueBy, submissions: (record?.submissions ?? 0) + 1 };
    saveMaterials(rec); setRecord(rec); setEditing(false); window.scrollTo({ top: 0, behavior: "smooth" });
    track("onboarding_complete", { complete, update });
  };

  const inp = "mt-2 block w-full rounded-[8px] border border-white/20 bg-ink px-4 py-3 text-white focus:border-route focus:outline-none aria-[invalid=true]:border-alert";
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate className="space-y-6">
      <div className="rounded-[16px] border border-route/50 bg-ink-deep p-7 sm:p-9">
        <h1 className="display d-lg max-w-[18ch]">{update ? "Send more or corrected materials." : "Send your football profile + video."}</h1>
        <p className="lede mt-4 max-w-2xl text-white/85">{update ? "We already have your first submission. Anything you send now is added to it." : "Everything we need for your Pathway Assessment, in one go. Links are best for video."}</p>
        <p className="mt-4 text-[0.88rem] text-white/60">{DELIVERY}</p>
        {orderRef && <p className="mt-2 text-[0.8rem] text-white/45">Payment reference {orderRef}</p>}
        {!orderRef && IS_REVIEW && <p className="gate-tag mt-3 inline-block">Review build · no payment on this device — submissions are marked accordingly</p>}
      </div>

      {ONBOARDING.map((s) => (
        <fieldset key={s.key} className="rounded-[16px] border border-white/12 bg-ink-deep p-6 sm:p-8">
          <legend className="sr-only">{s.title}</legend>
          <h2 className="display text-[1.8rem] leading-none">{s.title}</h2>
          {s.intro && <p className="mt-2 text-[0.9rem] text-white/65">{s.intro}</p>}
          {s.key === "video" && !hasFootage(v) && <p className="mt-3 rounded-[8px] bg-route/15 px-3 py-2 text-[0.85rem] text-route">No video yet? You can still send this now — we’ll start the assessment as soon as footage arrives. The 7-day period begins then.</p>}
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
        <p className="mt-4 text-[0.82rem] text-white/55">Your materials go straight to the Concordia assessment team. They’re used only for your assessment.</p>
      </div>
    </form>
  );
}

function MaterialsReceived({ record, onAddMore }: { record: MaterialsRecord; onAddMore: () => void }) {
  return (
    <div className="space-y-8">
      <div className="rounded-[16px] border border-route/60 bg-ink-deep p-7 sm:p-10">
        <h1 className="display d-lg max-w-[18ch]">{record.complete ? "Materials received. Your assessment has started." : "Materials received — we still need video."}</h1>
        <p className="lede mt-4 max-w-2xl text-white/85">{record.complete
          ? `Thanks — we have what we need. We aim to have your Pathway Assessment ready by ${fmtDate(record.dueBy)}, then we’ll invite you to book your 60-minute call.`
          : "Thanks — we’ve got your profile. Send a highlight or match video link as soon as you can: the 7-day assessment period starts once footage arrives."}</p>
        <dl className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-[0.9rem] sm:grid-cols-3">
          <div><dt className="text-white/55">Received</dt><dd className="mt-1 font-semibold">{fmtDate(record.submittedAt)}{record.submissions > 1 ? ` · ${record.submissions} submissions` : ""}</dd></div>
          <div><dt className="text-white/55">Assessment ready by</dt><dd className="mt-1 font-semibold">{record.complete ? fmtDate(record.dueBy) : "When footage arrives + 7 days"}</dd></div>
          <div><dt className="text-white/55">Next</dt><dd className="mt-1 font-semibold">60-minute call</dd></div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={onAddMore} className="btn btn-ghost">{record.complete ? "Send something we missed" : "Add video now"}</button>
          <Link href="/book-call/" className="btn btn-ghost">About the 60-minute call</Link>
        </div>
      </div>
      <FlowLine current={record.complete ? 5 : 4} />
    </div>
  );
}
