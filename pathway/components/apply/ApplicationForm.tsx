"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ApplicationData } from "@/lib/applications/schema";
import { ageFrom } from "@/lib/applications/triage";
import { MIN_AGE, GUARDIAN_UNDER } from "@/lib/applications/validate";
import { readAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { useMounted } from "@/lib/hooks";
import { JourneyCompact } from "@/components/funnel/JourneyCompact";

/**
 * FREE APPLICATION — submitted to /api/applications (persistent record + emails).
 * The draft is kept in sessionStorage for this tab only (strictly necessary, no consent needed) and cleared on success.
 */
type FieldType = "text" | "email" | "tel" | "date" | "url" | "select" | "multiselect" | "textarea" | "checkbox";
interface F { key: string; label: React.ReactNode; type: FieldType; required?: boolean; options?: string[]; help?: string; placeholder?: string; autoComplete?: string; inputMode?: "text" | "email" | "tel" | "url" | "numeric" }
interface Step { id: string; title: string; intro: string; fields: F[]; when?: (v: Values) => boolean }
type Values = Record<string, string | string[] | boolean>;

const POSITIONS = ["Goalkeeper", "Centre-back", "Full-back / wing-back", "Defensive midfield", "Central midfield", "Attacking midfield", "Winger", "Forward"];
const COUNTRIES = ["Spain", "France", "Italy", "Germany", "Belgium", "Netherlands", "Portugal", "Poland", "Czechia", "Sweden", "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Latvia", "Lithuania", "Estonia", "Ireland", "United Kingdom", "Not sure"];
const minor = (v: Values) => { const a = ageFrom(String(v.dateOfBirth || "")); return a !== null && a < GUARDIAN_UNDER; };

const STEPS: Step[] = [
  { id: "about", title: "About the player", intro: "The basics, so we know who we’re assessing.", fields: [
    { key: "applicant", label: "Who is filling this in?", type: "select", required: true, options: ["The player", "A parent or guardian"] },
    { key: "fullName", label: "Player’s full name", type: "text", required: true, autoComplete: "name" },
    { key: "footballCategory", label: "The player plays in", type: "select", required: true, options: ["Women’s football", "Men’s football"] },
    { key: "dateOfBirth", label: "Player’s date of birth", type: "date", required: true, autoComplete: "bday", help: `Pathway Assessments are for players aged ${MIN_AGE}+. Under 18, a parent or guardian joins the application.` },
    { key: "nationality", label: "Nationality", type: "text", required: true },
    { key: "residence", label: "Country of residence", type: "text", required: true, autoComplete: "country-name" },
    { key: "email", label: "Player’s email", type: "email", required: true, autoComplete: "email", inputMode: "email" },
    { key: "whatsapp", label: "Phone / WhatsApp (optional)", type: "tel", autoComplete: "tel", inputMode: "tel" },
  ] },
  { id: "guardian", title: "Parent or guardian", intro: "For players under 18, a parent or legal guardian applies with them, is our main contact and is the person who would pay.", when: minor, fields: [
    { key: "guardianName", label: "Parent / guardian full name", type: "text", required: true, autoComplete: "name" },
    { key: "guardianRelationship", label: "Relationship to the player", type: "text", required: true, placeholder: "e.g. Mother, Father, Legal guardian" },
    { key: "guardianEmail", label: "Parent / guardian email", type: "email", required: true, autoComplete: "email", inputMode: "email" },
    { key: "guardianPhone", label: "Parent / guardian phone (optional)", type: "tel", autoComplete: "tel", inputMode: "tel" },
    { key: "guardianConsent", label: "I am the player’s parent or legal guardian. I make (or approve) this application on their behalf and agree that Concordia may use the information in it to review the application.", type: "checkbox", required: true },
  ] },
  { id: "football", title: "Football", intro: "Position, level, clubs and minutes. Be accurate — the assessment is only as honest as the information behind it.", fields: [
    { key: "positions", label: "Position(s)", type: "multiselect", required: true, options: POSITIONS },
    { key: "foot", label: "Preferred foot", type: "select", options: ["Right", "Left", "Both"] },
    { key: "height", label: "Height (optional)", type: "text", placeholder: "e.g. 182 cm" },
    { key: "currentClub", label: "Current club / team", type: "text" },
    { key: "level", label: "Current level", type: "select", required: true, options: ["College", "Academy", "Semi-professional", "Professional", "Amateur", "Not currently playing"] },
    { key: "minutesLastSeason", label: "Competitive minutes last season", type: "text", help: "Estimates are fine — tell us if they are.", inputMode: "numeric" },
    { key: "previousClubs", label: "Recent football history / previous clubs", type: "textarea" },
    { key: "nationalTeam", label: "National-team experience (if any)", type: "text", placeholder: "e.g. U19 — 4 appearances" },
    { key: "educationStatus", label: "School, college or academy (if relevant)", type: "select", options: ["In college", "Graduated", "High school", "Academy", "Not in education"] },
    { key: "college", label: "Name of school / college / academy", type: "text" },
    { key: "division", label: "College division (if applicable)", type: "select", options: ["NCAA D1", "NCAA D2", "NCAA D3", "NAIA", "NJCAA", "Other", "Not applicable"] },
    { key: "eligibilityYears", label: "College eligibility remaining (if applicable)", type: "text", help: "We don’t advise on college eligibility rules — your school’s compliance office can." },
  ] },
  { id: "status", title: "Contract, profile & passports", intro: "Contract status, any current agent, what footage you have and every passport you hold.", fields: [
    { key: "contractStatus", label: "Contract status", type: "select", required: true, options: ["Free agent / no contract", "Under contract", "Contract ending within 6 months", "Amateur / college registration", "Not applicable"] },
    { key: "contractEnds", label: "Contract end date (if any)", type: "date" },
    { key: "hasAgent", label: "Do you currently have an agent?", type: "select", required: true, options: ["No", "Yes", "Not sure"] },
    { key: "offers", label: "Any current offers? (optional)", type: "textarea" },
    { key: "fullMatchUrl", label: "Full-match link (if you have one)", type: "url", inputMode: "url", placeholder: "https://", help: "Not required to apply. A phone recording from the stand is fine; more video comes after acceptance." },
    { key: "highlightsUrl", label: "Highlights link (optional)", type: "url", inputMode: "url", placeholder: "https://" },
    { key: "transfermarktUrl", label: "Transfermarkt profile (optional)", type: "url", inputMode: "url", placeholder: "https://" },
    { key: "instagram", label: "Other profile link (optional)", type: "text", placeholder: "Instagram, club page, Wyscout…" },
    { key: "passports", label: "Passport(s) held", type: "text", required: true, placeholder: "e.g. United States, Italy" },
    { key: "ancestry", label: "Possible EU ancestry (optional)", type: "text", help: "Country and generation, if you think it might qualify you for a passport." },
  ] },
  { id: "goals", title: "Your goals", intro: "What you want, where you’re thinking about, and when. “Not sure” is a perfectly good answer.", fields: [
    { key: "objective", label: "What are you trying to achieve?", type: "select", required: true, options: ["First professional contract", "A better level", "Europe specifically", "Decide between Europe and college", "Not sure"] },
    { key: "lookingFor", label: "In a few words: why Europe, and what are you looking for? (optional)", type: "textarea" },
    { key: "targetCountries", label: "Countries you’re considering", type: "multiselect", options: COUNTRIES },
    { key: "availableFrom", label: "Available from", type: "date" },
    { key: "relocation", label: "Ready to relocate?", type: "select", options: ["Yes", "Within 6 months", "Within a year", "Not sure"] },
  ] },
];

const KEY = "cs_application_draft";
const loadDraft = (): Values => { try { return JSON.parse(sessionStorage.getItem(KEY) || "null") ?? { positions: [], targetCountries: [] }; } catch { return { positions: [], targetCountries: [] }; } };

export function ApplicationForm() {
  const mounted = useMounted();
  if (!mounted) return <div className="min-h-[70vh]" />;
  return <ApplicationInner />;
}

type Done = { id: string; firstName: string; emailed: boolean; email: string };

function ApplicationInner() {
  const [v, setV] = useState<Values>(loadDraft);
  const [idx, setIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!done) { try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch { /* */ } } }, [v, done]);
  const steps = useMemo(() => STEPS.filter((s) => !s.when || s.when(v)), [v]);
  const reviewIdx = steps.length;
  const step = steps[idx];
  const scrollTop = () => top.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const set = (k: string, val: string | string[] | boolean) => { setV((x) => ({ ...x, [k]: val })); setErrors((e) => ({ ...e, [k]: "" })); };
  const focusFirstError = () => setTimeout(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0);
  const validate = (fields: F[]) => {
    const e: Record<string, string> = {};
    for (const f of fields) {
      const val = v[f.key];
      if (f.required && (val === undefined || val === "" || val === false || (Array.isArray(val) && val.length === 0))) e[f.key] = f.type === "checkbox" ? "Required to continue." : "Please complete this field.";
      if (f.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(val))) e[f.key] = "Please enter a valid email.";
      if (f.type === "url" && val && !/^https?:\/\/\S+\.\S+/.test(String(val))) e[f.key] = "Please enter a full link starting with https://";
    }
    if (fields.some((f) => f.key === "dateOfBirth") && v.dateOfBirth) {
      const age = ageFrom(String(v.dateOfBirth));
      if (age === null || age > 60) e.dateOfBirth = "Please check the date of birth.";
      else if (age < MIN_AGE) e.dateOfBirth = `We offer Pathway Assessments from age ${MIN_AGE}. At this age, minutes, development and enjoyment matter most — you’re very welcome to apply later.`;
    }
    setErrors(e);
    if (Object.keys(e).length) focusFirstError();
    return Object.keys(e).length === 0;
  };
  const next = () => { if (!validate(step.fields)) return; if (idx === 0) track("application_start"); track("application_step_complete", { step: step.id }); setIdx(idx + 1); scrollTop(); };
  const back = () => { setIdx(Math.max(0, idx - 1)); scrollTop(); };

  const consentFields: F[] = [
    { key: "cTerms", type: "checkbox", required: true, label: <>I have read and agree to the <Link href="/legal/terms" target="_blank" className="underline underline-offset-2">Terms of Service</Link> and the <Link href="/legal/privacy" target="_blank" className="underline underline-offset-2">Privacy Policy</Link>.</> },
    { key: "cAgency", type: "checkbox", label: "Optional: Concordia Sports Agency may also view this application. This creates no representation, priority or obligation, and saying no has no effect on the assessment." },
    { key: "cMarketing", type: "checkbox", label: "Optional: email me occasional news about European Pathway. I can unsubscribe at any time." },
  ];

  const submit = async () => {
    if (submitting) return;
    if (!validate(consentFields)) return;
    setSubmitting(true); setSubmitError("");
    const str = (k: string) => String(v[k] ?? "").trim();
    const data: Partial<ApplicationData> & Record<string, unknown> = {
      applicant: v.applicant === "A parent or guardian" ? "guardian" : "player",
      fullName: str("fullName"), footballCategory: str("footballCategory"), dateOfBirth: str("dateOfBirth"), nationality: str("nationality"), residence: str("residence"), email: str("email"), whatsapp: str("whatsapp"),
      guardian: minor(v) ? { name: str("guardianName"), relationship: str("guardianRelationship"), email: str("guardianEmail"), phone: str("guardianPhone"), consent: v.guardianConsent === true } : undefined,
      positions: (v.positions as string[]) ?? [], foot: str("foot"), height: str("height"), currentClub: str("currentClub"), level: str("level"), minutesLastSeason: str("minutesLastSeason"), previousClubs: str("previousClubs"), nationalTeam: str("nationalTeam"),
      education: { status: str("educationStatus"), college: str("college"), division: str("division"), eligibilityYears: str("eligibilityYears") },
      contractStatus: str("contractStatus"), contractEnds: str("contractEnds"), offers: str("offers"), hasAgent: str("hasAgent"),
      fullMatchUrl: str("fullMatchUrl"), highlightsUrl: str("highlightsUrl"), transfermarktUrl: str("transfermarktUrl"), instagram: str("instagram"),
      passports: str("passports").split(",").map((s) => s.trim()).filter(Boolean), ancestry: str("ancestry"),
      objective: str("objective"), lookingFor: str("lookingFor"), targetCountries: (v.targetCountries as string[]) ?? [], availableFrom: str("availableFrom"), relocation: str("relocation"),
      consents: { terms: v.cTerms === true, assessmentData: true, agencyView: v.cAgency === true, marketing: v.cMarketing === true },
    };
    try {
      const res = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data, attribution: readAttribution(), website: honeypot.current?.value ?? "" }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok && j.id) {
        track("application_complete", { route: "submitted" });
        try { sessionStorage.removeItem(KEY); } catch { /* */ }
        setDone({ id: j.id, firstName: j.firstName, emailed: Boolean(j.confirmationEmailSent), email: j.email });
        scrollTop();
        return;
      }
      if (res.status === 422 && j.errors) {
        setErrors(j.errors);
        const first = steps.findIndex((s) => s.fields.some((f) => j.errors[f.key]));
        if (first >= 0) setIdx(first);
        setSubmitError("Some answers need another look — they’re highlighted.");
        focusFirstError();
      } else {
        setSubmitError("We couldn’t submit your application just now. Your answers are still here. Please try again.");
        track("application_delivery_failed", { status: res.status });
      }
    } catch {
      setSubmitError("We couldn’t submit your application just now. Your answers are still here. Please try again.");
    } finally { setSubmitting(false); }
  };

  if (done) return <Received d={done} />;

  return (
    <div ref={top} className="scroll-mt-28">
      <header>
        <p className="eyebrow text-route">Free application</p>
        <h1 className="display mt-3 text-[clamp(2.4rem,6vw,4.2rem)] leading-[0.92]">Apply for your Pathway Assessment.</h1>
        <p className="lede mt-4 max-w-2xl text-white/85">Tell us about your football. We review every application and let you know whether a Pathway Assessment is right for you.</p>
        <ul className="mt-5 flex flex-wrap gap-2 text-[0.85rem] font-semibold">
          {["Free to apply", "About 10 minutes", "No payment to apply"].map((x) => <li key={x} className="rounded-full border border-white/20 px-3 py-1.5">{x}</li>)}
        </ul>
        <details className="group mt-5 max-w-3xl border-y border-white/10 py-3 text-white/80">
          <summary className="cursor-pointer list-none text-[0.88rem] font-semibold"><span className="text-route">+</span> How it works after you apply</summary>
          <JourneyCompact className="mt-4" />
        </details>
      </header>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="mono text-[0.72rem] text-slate-light" aria-live="polite">{idx < reviewIdx ? `Step ${idx + 1} of ${reviewIdx + 1} — ${step.title}` : `Step ${reviewIdx + 1} of ${reviewIdx + 1} — Review & submit`}</p>
          {idx > 0 && <button type="button" onClick={back} className="mono text-[0.72rem] uppercase tracking-[0.1em] text-slate-light underline underline-offset-4">← Back</button>}
        </div>
        <div className="mb-5 flex gap-1" aria-hidden>{[...steps, { id: "review" }].map((s, n) => <span key={s.id} className={`h-[3px] flex-1 ${n <= idx ? "bg-route" : "bg-white/12"}`} />)}</div>

        {idx < reviewIdx ? (
          <form className="border border-white/15 bg-ink-deep p-5 sm:p-9" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
            <h2 className="display d-md">{step.title}</h2>
            <p className="mt-2 text-white/75">{step.intro}</p>
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {step.fields.map((f) => <Field key={f.key} f={f} value={v[f.key]} error={errors[f.key]} onChange={(val) => set(f.key, val)} />)}
            </div>
            <div className="mt-9 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
              <p className="mono text-[0.68rem] text-slate-light">Saved in this browser tab as you go</p>
              <button type="submit" className="btn btn-route w-full sm:w-auto">Continue <span className="arrow" aria-hidden>→</span></button>
            </div>
          </form>
        ) : (
          <div className="border border-white/15 bg-ink-deep p-5 sm:p-9">
            <h2 className="display d-md">Review &amp; submit</h2>
            <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {steps.map((s, n) => (
                <div key={s.id} className="flex items-start justify-between gap-6 py-4">
                  <div className="min-w-0"><p className="font-semibold">{s.title}</p><p className="mt-1 truncate text-[0.85rem] text-white/60">{s.fields.filter((f) => f.type !== "checkbox").map((f) => { const val = v[f.key]; return Array.isArray(val) ? val.join(", ") : val; }).filter(Boolean).slice(0, 4).join(" · ") || "—"}</p></div>
                  <button type="button" onClick={() => { setIdx(n); scrollTop(); }} className="mono shrink-0 text-[0.7rem] uppercase tracking-[0.1em] text-route underline underline-offset-4">Edit</button>
                </div>
              ))}
            </div>
            <fieldset className="mt-7 grid gap-3">
              <legend className="sr-only">Consents</legend>
              {consentFields.map((f) => <Field key={f.key} f={f} value={v[f.key]} error={errors[f.key]} onChange={(val) => set(f.key, val)} />)}
            </fieldset>
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
            <p className="mt-6 text-[0.88rem] text-white/70">We review every application and email you the outcome. Being accepted means accepted for a Pathway Assessment — not for representation, by Concordia Sports Agency or by any club. No payment is taken to apply.</p>
            {submitError && <p role="alert" className="mt-5 border-l-2 border-alert pl-4 text-[0.95rem] text-white">{submitError}</p>}
            <button type="button" onClick={submit} disabled={submitting} aria-busy={submitting} className="btn btn-route mt-6 w-full disabled:opacity-60 sm:w-auto">{submitting ? "Submitting…" : "Submit application"} <span className="arrow" aria-hidden>→</span></button>
          </div>
        )}
      </div>
    </div>
  );
}

function Received({ d }: { d: Done }) {
  return (
    <div className="border border-route/60 bg-ink-deep p-7 sm:p-10">
      <p className="eyebrow text-route">Application received</p>
      <h1 className="display d-lg mt-4">Thank you{d.firstName ? `, ${d.firstName}` : ""}.</h1>
      <p className="mt-6 text-white/70">Your application reference</p>
      <p className="display mt-1 text-[clamp(2rem,6vw,3rem)] leading-none text-route">{d.id}</p>
      <p className="lede mt-6 max-w-2xl text-white/85">Our team will review your profile and contact you by email.</p>
      <ul className="mt-5 space-y-1 text-white/85"><li>Applying is free.</li><li>No payment has been taken.</li></ul>
      <p className="mt-5 max-w-2xl text-white/75">If you’re accepted, you’ll receive an invitation to continue with the $249 Pathway Assessment.</p>
      <p className="mt-5 text-[0.9rem] text-white/60">{d.emailed ? `We’ve sent a confirmation to ${d.email}.` : "Please keep your reference — we’ll email you at the address you gave us."}</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link href="/assessment" className="btn btn-ghost">What the assessment includes</Link><Link href="/" className="btn btn-ghost">Back to home</Link></div>
    </div>
  );
}

function Field({ f, value, error, onChange }: { f: F; value: Values[string] | undefined; error?: string; onChange: (v: string | string[] | boolean) => void }) {
  const id = `f-${f.key}`;
  const describedBy = [f.help ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const base = "mt-2 block w-full border bg-ink px-4 py-3.5 text-[1rem] text-white placeholder:text-white/30 focus:border-route focus:outline-none focus-visible:ring-2 focus-visible:ring-route/50";
  const border = error ? "border-alert" : "border-white/20";
  const wide = f.type === "textarea" || f.type === "multiselect" || f.type === "checkbox";
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      {f.type === "checkbox" ? (
        <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 border p-4 ${error ? "border-alert" : "border-white/15"}`}>
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} aria-invalid={Boolean(error)} aria-describedby={describedBy} aria-required={f.required} className="mt-1 h-5 w-5 shrink-0 accent-[#FFD23F]" />
          <span className="text-[0.95rem] leading-relaxed">{f.label}{f.required && <span className="text-route" aria-hidden> *</span>}</span>
        </label>
      ) : (
        <label htmlFor={id} className="block text-[0.92rem] font-semibold">{f.label}{f.required && <span className="text-route" aria-hidden> *</span>}{f.required && <span className="sr-only"> (required)</span>}</label>
      )}
      {f.type === "select" && (
        <select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} aria-required={f.required} className={`${base} ${border}`}>
          <option value="">Select…</option>{f.options!.map((o) => <option key={o}>{o}</option>)}
        </select>
      )}
      {f.type === "multiselect" && (
        <div role="group" aria-labelledby={`${id}-lbl`} aria-describedby={describedBy} className="mt-3 flex flex-wrap gap-2">
          <span id={`${id}-lbl`} className="sr-only">{typeof f.label === "string" ? f.label : ""}</span>
          {f.options!.map((o) => { const arr = (value as string[]) || []; const on = arr.includes(o); return (
            <button type="button" key={o} aria-pressed={on} onClick={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])} className={`min-h-[44px] border px-4 text-[0.9rem] focus-visible:outline-2 focus-visible:outline-route ${on ? "border-route bg-route font-semibold text-ink" : "border-white/20"}`}>{o}</button>
          ); })}
        </div>
      )}
      {f.type === "textarea" && <textarea id={id} rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`${base} ${border}`} />}
      {["text", "email", "tel", "date", "url"].includes(f.type) && (
        <input id={id} type={f.type} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} autoComplete={f.autoComplete} inputMode={f.inputMode} aria-invalid={Boolean(error)} aria-describedby={describedBy} aria-required={f.required} className={`${base} ${border} [color-scheme:dark]`} />
      )}
      {f.help && <p id={`${id}-help`} className="mt-2 text-[0.82rem] text-slate-light">{f.help}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-2 text-[0.85rem] font-semibold text-[#ff7a66]">{error}</p>}
    </div>
  );
}
