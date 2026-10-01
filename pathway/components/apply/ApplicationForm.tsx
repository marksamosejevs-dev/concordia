"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ApplicationData } from "@/lib/applications/schema";
import { triage, ageFrom } from "@/lib/applications/triage";
import { deliverApplication } from "@/lib/applications/destination";
import { readAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { SITE_MODE, IS_REVIEW } from "@/lib/site-mode";
import { useMounted } from "@/lib/hooks";

type FieldType = "text" | "email" | "tel" | "date" | "url" | "select" | "multiselect" | "textarea" | "checkbox";
interface F { key: string; label: string; type: FieldType; required?: boolean; options?: string[]; help?: string; placeholder?: string; autoComplete?: string; inputMode?: "text" | "email" | "tel" | "url" | "numeric"; pendingLegal?: boolean }
interface Step { id: string; title: string; intro: string; fields: F[]; when?: (v: Values) => boolean }
type Values = Record<string, string | string[] | boolean>;

const POSITIONS = ["Goalkeeper", "Centre-back", "Full-back / wing-back", "Defensive midfield", "Central midfield", "Attacking midfield", "Winger", "Forward"];
const COUNTRIES = ["Spain", "France", "Italy", "Germany", "Belgium", "Netherlands", "Portugal", "Poland", "Czechia", "Sweden", "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Latvia", "Lithuania", "Estonia", "Ireland", "United Kingdom", "Not sure"];

const STEPS: Step[] = [
  { id: "about", title: "About you", intro: "The basics, so we know who we’re assessing.", fields: [
    { key: "applicant", label: "Who is filling this in?", type: "select", required: true, options: ["The player", "A parent or guardian"] },
    { key: "fullName", label: "Player’s full name", type: "text", required: true, autoComplete: "name" },
    { key: "dateOfBirth", label: "Player’s date of birth", type: "date", required: true, help: "We use age to apply the right rules for young players." },
    { key: "nationality", label: "Nationality", type: "text", required: true },
    { key: "residence", label: "Country of residence", type: "text", required: true, autoComplete: "country-name" },
    { key: "email", label: "Email", type: "email", required: true, autoComplete: "email", inputMode: "email" },
    { key: "whatsapp", label: "WhatsApp (optional)", type: "tel", autoComplete: "tel", inputMode: "tel" },
  ] },
  { id: "guardian", title: "Parent or guardian", intro: "For players under 18, a parent or guardian applies, pays and joins the process.", when: (v) => { const a = ageFrom(String(v.dateOfBirth || "")); return a !== null && a < 18; }, fields: [
    { key: "guardianName", label: "Parent / guardian full name", type: "text", required: true },
    { key: "guardianRelationship", label: "Relationship to the player", type: "text", required: true },
    { key: "guardianEmail", label: "Parent / guardian email", type: "email", required: true, inputMode: "email" },
    { key: "guardianPhone", label: "Parent / guardian phone", type: "tel", inputMode: "tel" },
    { key: "guardianConsent", label: "I am the player’s parent or legal guardian and consent to this application.", type: "checkbox", required: true, pendingLegal: true },
  ] },
  { id: "football", title: "Your football", intro: "Your position, level, clubs and minutes. Be accurate — the assessment is only as honest as the information behind it.", fields: [
    { key: "positions", label: "Position(s)", type: "multiselect", required: true, options: POSITIONS },
    { key: "foot", label: "Preferred foot", type: "select", options: ["Right", "Left", "Both"] },
    { key: "height", label: "Height (optional)", type: "text", placeholder: "e.g. 182 cm" },
    { key: "currentClub", label: "Current club / team", type: "text" },
    { key: "level", label: "Current level", type: "select", required: true, options: ["College", "Academy", "Semi-professional", "Professional", "Amateur", "Not currently playing"] },
    { key: "minutesLastSeason", label: "Competitive minutes last season", type: "text", help: "Estimates are fine — tell us if they are.", inputMode: "numeric" },
    { key: "previousClubs", label: "Previous clubs", type: "textarea" },
    { key: "nationalTeam", label: "National-team experience (if any)", type: "text" },
  ] },
  { id: "education", title: "Education", intro: "College and eligibility status, if relevant.", fields: [
    { key: "educationStatus", label: "Education status", type: "select", options: ["In college", "Graduated", "High school", "Not in education"] },
    { key: "college", label: "College", type: "text" },
    { key: "division", label: "Division", type: "select", options: ["NCAA D1", "NCAA D2", "NCAA D3", "NAIA", "NJCAA", "Other", "Not applicable"] },
    { key: "eligibilityYears", label: "Years of eligibility remaining", type: "text", help: "The assessment is career advisory and involves no agency agreement. Check with your compliance office if you have eligibility questions.", pendingLegal: true },
  ] },
  { id: "status", title: "Your status", intro: "Contracts, offers and whether you currently have an agent.", fields: [
    { key: "contractStatus", label: "Contract status", type: "select", required: true, options: ["No contract", "Under contract", "Contract ending within 6 months", "Not applicable"] },
    { key: "contractEnds", label: "Contract end date (if any)", type: "date" },
    { key: "offers", label: "Any current offers? (short description)", type: "textarea" },
    { key: "hasAgent", label: "Do you currently have an agent?", type: "select", required: true, options: ["No", "Yes", "Not sure"], help: "If you do, tell us. We’ll explain how the assessment fits." },
  ] },
  { id: "footage", title: "Footage & profile", intro: "A full match is required for an assessment. Highlights help; they don’t replace it.", fields: [
    { key: "fullMatchUrl", label: "Full-match link", type: "url", inputMode: "url", help: "Any full 90 minutes, unedited. A phone recording from the stand is better than no match at all.", placeholder: "https://" },
    { key: "highlightsUrl", label: "Highlights link (optional)", type: "url", inputMode: "url", placeholder: "https://" },
    { key: "transfermarktUrl", label: "Transfermarkt profile (optional)", type: "url", inputMode: "url" },
    { key: "instagram", label: "Instagram (optional)", type: "text" },
  ] },
  { id: "passports", title: "Passports", intro: "Every passport you hold, and any ancestry that might qualify you for another.", fields: [
    { key: "passports", label: "Passport(s) held", type: "text", required: true, placeholder: "e.g. United States, Italy" },
    { key: "ancestry", label: "Possible EU ancestry (country, generation)", type: "text", help: "Passport eligibility can change your options. A citizenship lawyer can confirm it." },
  ] },
  { id: "goals", title: "Your goals", intro: "What you want, where you’re thinking about, and when. “Not sure” is a perfectly good answer.", fields: [
    { key: "objective", label: "What are you trying to achieve?", type: "select", required: true, options: ["First professional contract", "A better level", "Europe specifically", "Decide between Europe and college", "Not sure"] },
    { key: "targetCountries", label: "Countries you’re considering", type: "multiselect", options: COUNTRIES },
    { key: "availableFrom", label: "Available from", type: "date" },
    { key: "relocation", label: "Ready to relocate?", type: "select", options: ["Yes", "Within 6 months", "Within a year", "Not sure"] },
    { key: "budget", label: "Budget for trials / relocation (optional)", type: "select", options: ["Prefer not to say", "Under $1,000", "$1,000–3,000", "$3,000–7,500", "Over $7,500"] },
  ] },
  { id: "consents", title: "Consents", intro: "Required terms and data use, plus two optional choices.", fields: [
    { key: "cTerms", label: "I agree to the Terms and Privacy Policy.", type: "checkbox", required: true, pendingLegal: true },
    { key: "cData", label: "I consent to my information and footage being used to assess my application.", type: "checkbox", required: true, pendingLegal: true },
    { key: "cAgency", label: "Optional: allow Concordia Sports Agency to view my profile. This creates no representation, priority or obligation, and saying no has no effect on my assessment.", type: "checkbox", pendingLegal: true },
    { key: "cMarketing", label: "Optional: send me occasional emails about European Pathway.", type: "checkbox" },
  ] },
];

const KEY = "cs_application_draft";

function loadDraft(): Values {
  const base: Values = { applicant: "", positions: [], targetCountries: [] };
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "null");
    if (d) return d;
    const quiz = JSON.parse(sessionStorage.getItem("cs_quiz") || "null");
    if (quiz) return { ...base, applicant: quiz.who?.[0] === "A parent or guardian" ? "A parent or guardian" : "The player" };
  } catch {}
  return base;
}

export function ApplicationForm() {
  const mounted = useMounted();
  if (!mounted) return <div className="h-[60vh]" />;
  return <ApplicationInner />;
}

function ApplicationInner() {
  const router = useRouter();
  const [v, setV] = useState<Values>(loadDraft);
  const [idx, setIdx] = useState(-1); // -1 = intro
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} }, [v]);

  const steps = useMemo(() => STEPS.filter((s) => !s.when || s.when(v)), [v]);
  const reviewIdx = steps.length;
  const step = steps[idx];

  const set = (k: string, val: string | string[] | boolean) => { setV((x) => ({ ...x, [k]: val })); setErrors((e) => ({ ...e, [k]: "" })); };
  const validate = (s: Step) => {
    const e: Record<string, string> = {};
    for (const f of s.fields) {
      const val = v[f.key];
      if (f.required && (val === undefined || val === "" || val === false || (Array.isArray(val) && val.length === 0))) e[f.key] = f.type === "checkbox" ? "Required to continue." : "Please complete this field.";
      if (f.type === "email" && val && !/^\S+@\S+\.\S+$/.test(String(val))) e[f.key] = "Please enter a valid email.";
      if (f.type === "url" && val && !/^https?:\/\//.test(String(val))) e[f.key] = "Please enter a full link starting with https://";
    }
    setErrors(e);
    if (Object.keys(e).length) { setTimeout(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0); }
    return Object.keys(e).length === 0;
  };
  const next = () => { if (idx === -1) { setIdx(0); track("application_start"); return; } if (step && !validate(step)) return; track("application_step_complete", { step: step?.id }); setIdx(idx + 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const back = () => { setIdx(Math.max(-1, idx - 1)); window.scrollTo({ top: 0 }); };

  const submit = async () => {
    setSubmitting(true);
    const data: ApplicationData = {
      applicant: v.applicant === "A parent or guardian" ? "guardian" : "player",
      fullName: String(v.fullName || ""), dateOfBirth: String(v.dateOfBirth || ""), nationality: String(v.nationality || ""), residence: String(v.residence || ""), email: String(v.email || ""), whatsapp: String(v.whatsapp || "") || undefined,
      guardian: v.guardianName ? { name: String(v.guardianName), relationship: String(v.guardianRelationship || ""), email: String(v.guardianEmail || ""), phone: String(v.guardianPhone || "") || undefined, consent: Boolean(v.guardianConsent) } : undefined,
      positions: (v.positions as string[]) || [], height: String(v.height || "") || undefined, foot: String(v.foot || "") || undefined, currentClub: String(v.currentClub || "") || undefined, level: String(v.level || ""), previousClubs: String(v.previousClubs || "") || undefined, minutesLastSeason: String(v.minutesLastSeason || "") || undefined, nationalTeam: String(v.nationalTeam || "") || undefined,
      education: { status: String(v.educationStatus || ""), college: String(v.college || "") || undefined, division: String(v.division || "") || undefined, eligibilityYears: String(v.eligibilityYears || "") || undefined },
      contractStatus: String(v.contractStatus || ""), contractEnds: String(v.contractEnds || "") || undefined, offers: String(v.offers || "") || undefined, hasAgent: String(v.hasAgent || ""),
      fullMatchUrl: String(v.fullMatchUrl || "") || undefined, highlightsUrl: String(v.highlightsUrl || "") || undefined, transfermarktUrl: String(v.transfermarktUrl || "") || undefined, instagram: String(v.instagram || "") || undefined,
      passports: String(v.passports || "").split(",").map((s) => s.trim()).filter(Boolean), ancestry: String(v.ancestry || "") || undefined,
      objective: String(v.objective || ""), targetCountries: (v.targetCountries as string[]) || [], availableFrom: String(v.availableFrom || "") || undefined, relocation: String(v.relocation || "") || undefined, budget: String(v.budget || "") || undefined,
      consents: { terms: Boolean(v.cTerms), assessmentData: Boolean(v.cData), agencyView: Boolean(v.cAgency), marketing: Boolean(v.cMarketing) },
    };
    const result = triage(data);
    const sub = { id: `APP-${Date.now().toString(36).toUpperCase()}`, data, triage: result, attribution: readAttribution(), submittedAt: new Date().toISOString(), siteMode: SITE_MODE };
    await deliverApplication(sub);
    track("application_complete", { route: result.route });
    try { localStorage.removeItem(KEY); } catch {}
    router.push("/apply/result");
  };

  if (idx === -1) {
    return (
      <div className="border border-white/15 bg-ink-deep p-7 sm:p-10">
        <p className="eyebrow text-route">Free application</p>
        <h1 className="display d-lg mt-4">Apply for your Pathway Assessment.</h1>
        <p className="lede mt-5 max-w-2xl text-white/85">Before accepting payment, we review whether an assessment is right for your situation. Not every player needs one — and we’d rather tell you now.</p>
        <ul className="mono mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[0.75rem] text-slate-light"><li>About 10 minutes</li><li>Free</li><li>Saves as you go</li><li>{steps.length} short steps</li></ul>
        <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-[0.92rem] text-white/75 sm:grid-cols-3">
          <p><span className="display block text-[1.3rem] text-white">1 · Apply free</span>Your football, footage, passports and goals.</p>
          <p><span className="display block text-[1.3rem] text-white">2 · Instant review</span>We check whether an assessment makes sense for you.</p>
          <p><span className="display block text-[1.3rem] text-white">3 · $249 if accepted</span>Pay online. Report within 7 business days.</p>
        </div>
        <button onClick={next} className="btn btn-route mt-9">Start application <span className="arrow">→</span></button>
        <p className="mt-6 text-[0.82rem] text-slate-light">Being accepted means accepted for a Pathway Assessment — not for representation, by the Agency or by any club.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="mono text-[0.72rem] text-slate-light">{idx < reviewIdx ? `Step ${idx + 1} of ${reviewIdx + 1} — ${step.title}` : `Step ${reviewIdx + 1} of ${reviewIdx + 1} — Review`}</p>
          <button onClick={back} className="mono text-[0.72rem] uppercase tracking-[0.1em] text-slate-light underline">← Back</button>
        </div>
        <div className="mt-3 flex gap-1" aria-hidden>{[...steps, { id: "review" }].map((s, n) => <span key={s.id} className={`h-[3px] flex-1 ${n <= idx ? "bg-route" : "bg-white/12"}`} />)}</div>
      </div>
      {idx < reviewIdx ? (
        <form className="border border-white/15 bg-ink-deep p-6 sm:p-10" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
          <h2 className="display d-md">{step.title}</h2>
          <p className="mt-2 text-white/75">{step.intro}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {step.fields.map((f) => <Field key={f.key} f={f} value={v[f.key]} error={errors[f.key]} onChange={(val) => set(f.key, val)} />)}
          </div>
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
            <p className="mono hidden text-[0.68rem] text-slate-light sm:block">Saved in this browser</p>
            <button type="submit" className="btn btn-route w-full sm:w-auto">Continue <span className="arrow">→</span></button>
          </div>
        </form>
      ) : (
        <div className="border border-white/15 bg-ink-deep p-6 sm:p-10">
          <h2 className="display d-md">Review &amp; submit</h2>
          <p className="mt-2 text-white/75">Check everything before you submit.</p>
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {steps.map((s, n) => (
              <div key={s.id} className="flex items-start justify-between gap-6 py-4">
                <div><p className="font-semibold">{s.title}</p><p className="mt-1 text-[0.85rem] text-white/60">{s.fields.filter((f) => f.type !== "checkbox").map((f) => { const val = v[f.key]; return Array.isArray(val) ? val.join(", ") : val; }).filter(Boolean).slice(0, 4).join(" · ") || "—"}</p></div>
                <button onClick={() => setIdx(n)} className="mono shrink-0 text-[0.7rem] uppercase tracking-[0.1em] text-route underline">Edit</button>
              </div>
            ))}
          </div>
          <button onClick={submit} disabled={submitting} className="btn btn-route mt-8 w-full sm:w-auto">{submitting ? "Submitting…" : "Submit for review"} <span className="arrow">→</span></button>
          <p className="mt-4 text-[0.82rem] text-slate-light">Submitting is free. You’ll see the result immediately.{IS_REVIEW ? " (Review build: the application stays in this browser.)" : ""}</p>
        </div>
      )}
    </div>
  );
}

function Field({ f, value, error, onChange }: { f: F; value: Values[string] | undefined; error?: string; onChange: (v: string | string[] | boolean) => void }) {
  const id = `f-${f.key}`;
  const describedBy = [f.help ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const base = "mt-2 block w-full border bg-ink px-4 py-3.5 text-[1rem] text-white placeholder:text-white/30 focus:border-route focus:outline-none";
  const border = error ? "border-alert" : "border-white/20";
  const wide = f.type === "textarea" || f.type === "multiselect" || f.type === "checkbox";
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      {f.type === "checkbox" ? (
        <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 border p-4 ${error ? "border-alert" : "border-white/15"}`}>
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} aria-invalid={Boolean(error)} aria-describedby={describedBy} className="mt-1 h-5 w-5 shrink-0 accent-[#FFD23F]" />
          <span className="text-[0.95rem] leading-relaxed">{f.label}{f.required && <span className="text-route"> *</span>}{f.pendingLegal && IS_REVIEW && <span className="gate-tag ml-2 align-middle">Legal wording pending</span>}</span>
        </label>
      ) : (
        <label htmlFor={id} className="block text-[0.92rem] font-semibold">{f.label}{f.required && <span className="text-route"> *</span>}</label>
      )}
      {f.type === "select" && (
        <select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`${base} ${border}`}>
          <option value="">Select…</option>{f.options!.map((o) => <option key={o}>{o}</option>)}
        </select>
      )}
      {f.type === "multiselect" && (
        <div role="group" aria-label={f.label} aria-describedby={describedBy} className="mt-3 flex flex-wrap gap-2">
          {f.options!.map((o) => { const arr = (value as string[]) || []; const on = arr.includes(o); return (
            <button type="button" key={o} aria-pressed={on} onClick={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])} className={`min-h-[44px] border px-4 text-[0.9rem] ${on ? "border-route bg-route font-semibold text-ink" : "border-white/20"}`}>{o}</button>
          ); })}
        </div>
      )}
      {f.type === "textarea" && <textarea id={id} rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`${base} ${border}`} />}
      {["text", "email", "tel", "date", "url"].includes(f.type) && (
        <input id={id} type={f.type} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} autoComplete={f.autoComplete} inputMode={f.inputMode} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`${base} ${border} [color-scheme:dark]`} />
      )}
      {f.help && <p id={`${id}-help`} className="mt-2 text-[0.82rem] text-slate-light">{f.help}{f.pendingLegal && f.type !== "checkbox" && IS_REVIEW && <span className="gate-tag ml-2">Wording pending US counsel</span>}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-2 text-[0.85rem] font-semibold text-[#ff7a66]">{error}</p>}
    </div>
  );
}
