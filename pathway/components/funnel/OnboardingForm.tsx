"use client";
import Link from "next/link";
import { useState } from "react";
import { ONBOARDING, UPLOAD, type OnbField } from "@/content/onboarding";
import { DELIVERY_FULL } from "@/content/assessment";
import { usePlayerView, fmtDate } from "@/lib/client/player";
import { track } from "@/lib/analytics";
import { Loading, InvalidLink, LoadError } from "./LinkStates";

/**
 * Onboarding — opens only after a VERIFIED payment (server-checked). Submitting does NOT start the 7-day period:
 * Concordia first confirms the materials are sufficient for this player (lib/assessment-status.ts).
 */
type Vals = Record<string, string | boolean>;
const MB = 1024 * 1024;
const isUrl = (s: string) => /^https?:\/\/\S+\.\S+/i.test(s.trim());

export function OnboardingForm() {
  const { token, view, state, reload } = usePlayerView();
  const [edits, setEdits] = useState<Vals | null>(null);
  const v: Vals = edits ?? view?.prefill ?? {};
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [healthConsent, setHealthConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [sent, setSent] = useState<{ at: string; n: number } | null>(null);
  const [adding, setAdding] = useState(false);

  if (state === "loading") return <Loading />;
  if (state === "invalid") return <InvalidLink />;
  if (state === "error" || !view || !token) return <LoadError retry={reload} />;
  const t = encodeURIComponent(token);
  if (!view.paid) return (
    <div className="rounded-[16px] border border-white/15 bg-ink-deep p-8">
      <h1 className="display d-md">Onboarding opens after payment is confirmed.</h1>
      <p className="mt-3 text-white/75">Your payment confirmation comes directly from our payment provider. If you’ve just paid, give it a minute and refresh — you’ll also receive an email.</p>
      <Link href={`/status?t=${t}`} className="btn btn-ghost mt-6">Your status</Link>
    </div>
  );
  const received = sent ?? (view.materialsCount > 0 && !adding && view.state !== "additional_information_required" ? { at: view.lastMaterialsAt ?? "", n: view.materialsCount } : null);
  if (received && !adding) return <Received at={received.at} n={received.n} onAddMore={() => { setSent(null); setAdding(true); }} t={t} />;

  const set = (k: string, val: string | boolean) => { setEdits((x) => ({ ...(x ?? view.prefill ?? {}), [k]: val })); setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const skipped = (f: OnbField) => Boolean(f.skipIf && v[f.skipIf]);
  const update = view.materialsCount > 0;

  const validate = () => {
    const e: Record<string, string> = {};
    for (const s of ONBOARDING) for (const f of s.fields) {
      const val = v[f.name];
      if (f.required && !skipped(f) && (!val || (typeof val === "string" && !val.trim()))) e[f.name] = "Required";
      if (f.type === "url" && !skipped(f) && typeof val === "string" && val.trim() && !isUrl(val)) e[f.name] = "Please paste a full link starting with https://";
    }
    if (String(v.has_agent ?? "").startsWith("Yes") && !String(v.agent_details ?? "").trim()) e.agent_details = "Tell us who represents you and until when";
    if (String(v.injuries ?? "").trim() && !healthConsent) e.healthConsent = "Please give explicit consent, or leave the injury field empty";
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
    if (sending || !validate()) return;
    setSending(true); setDeliveryError("");
    const fd = new FormData();
    fd.append("t", token);
    const values: Record<string, string | boolean> = {};
    for (const s of ONBOARDING) for (const f of s.fields) if (f.type !== "file") values[f.name] = f.type === "checkbox" ? v[f.name] === true : String(v[f.name] ?? "");
    fd.append("values", JSON.stringify(values));
    fd.append("healthConsent", String(healthConsent));
    for (const [k, file] of Object.entries(files)) if (file) fd.append(k, file);
    try {
      const r = await fetch("/api/onboarding", { method: "POST", body: fd });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { setSent({ at: new Date().toISOString(), n: j.submissions }); setAdding(false); setFiles({}); window.scrollTo({ top: 0, behavior: "smooth" }); track("onboarding_submitted", { step: update ? "update" : "initial" }); return; }
      if (j.errors) setErrors(j.errors);
      setDeliveryError(j.errors ? "Some details need another look — they’re highlighted above." : r.status === 413 ? "Your files are too large to send together. Please share larger files as links." : "We couldn’t send your materials just now. Your answers are still here — please try again.");
    } catch { setDeliveryError("We couldn’t send your materials just now. Your answers are still here — please try again."); }
    setSending(false);
  };

  const inp = "mt-2 block w-full rounded-[8px] border border-white/20 bg-ink px-4 py-3 text-white focus:border-route focus:outline-none focus-visible:ring-2 focus-visible:ring-route/50 aria-[invalid=true]:border-alert [color-scheme:dark]";
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate className="space-y-6">
      <div className="rounded-[16px] border border-route/50 bg-ink-deep p-7 sm:p-9">
        <h1 className="display d-lg max-w-[18ch]">{update ? "Send more or corrected materials." : "Send your football profile + materials."}</h1>
        {view.additionalInfoItems.length > 0 && <div className="mt-4 rounded-[8px] bg-white/10 px-4 py-3"><p className="font-semibold">We asked for:</p><ul className="mt-1 list-disc pl-5 text-white/85">{view.additionalInfoItems.map((x) => <li key={x}>{x}</li>)}</ul></div>}
        <p className="lede mt-4 max-w-2xl text-white/85">{update ? "Anything you send now is added to your earlier submission." : "Everything we need for your Pathway Assessment, in one go. Links are best for video. If something doesn’t exist yet — no Transfermarkt profile, no highlight video, no current club — just tick it. That’s not a problem in itself."}</p>
        <p className="mt-4 text-[0.88rem] text-white/60">{DELIVERY_FULL}</p>
        <p className="mt-2 text-[0.8rem] text-white/45">Reference {view.id}</p>
      </div>

      {ONBOARDING.map((s) => (
        <fieldset key={s.key} className="rounded-[16px] border border-white/12 bg-ink-deep p-6 sm:p-8">
          <legend className="sr-only">{s.title}</legend>
          <h2 className="display text-[1.8rem] leading-none" aria-hidden>{s.title}</h2>
          {s.intro && <p className="mt-2 text-[0.9rem] text-white/65">{s.intro}</p>}
          {s.key === "representation" && String(v.has_agent ?? "").startsWith("Yes") && <p className="mt-3 rounded-[8px] bg-white/10 px-3 py-2 text-[0.85rem] text-white/80">That’s fine — the assessment is advisory and doesn’t affect your existing agreement. Please tell us who represents you and until when.</p>}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {s.fields.map((f) => {
              const err = errors[f.name]; const dis = skipped(f); const id = `o-${f.name}`;
              const wide = f.type === "textarea" || f.type === "checkbox" || f.name === "objective";
              if (f.type === "checkbox") return <label key={f.name} className="flex items-center gap-3 text-[0.92rem] sm:col-span-2"><input type="checkbox" checked={Boolean(v[f.name])} onChange={(e) => set(f.name, e.target.checked)} className="h-5 w-5 accent-[#FFD23F]" />{f.label}</label>;
              return (
                <div key={f.name} className={`${wide ? "sm:col-span-2" : ""} ${dis ? "opacity-40" : ""}`}>
                  <label htmlFor={id} className="text-[0.92rem] font-semibold">{f.label}{f.required && <span className="text-route" aria-hidden> *</span>}</label>
                  {f.type === "textarea" ? <textarea id={id} rows={3} disabled={dis} aria-invalid={Boolean(err)} aria-describedby={err ? `${id}-e` : undefined} className={inp} value={String(v[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />
                    : f.type === "select" ? <select id={id} aria-invalid={Boolean(err)} className={inp} value={String(v[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)}><option value="">Choose…</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
                    : f.type === "file" ? <input id={id} type="file" accept={UPLOAD.accept} aria-invalid={Boolean(err)} className={`${inp} file:mr-3 file:rounded-full file:border-0 file:bg-route file:px-3 file:py-1 file:font-semibold file:text-ink`} onChange={(e) => { setFiles((x) => ({ ...x, [f.name]: e.target.files?.[0] ?? null })); setErrors((er) => { const n = { ...er }; delete n[f.name]; return n; }); }} />
                    : <input id={id} type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"} inputMode={f.type === "url" ? "url" : undefined} disabled={dis} aria-invalid={Boolean(err)} className={inp} value={String(v[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder ?? (f.type === "url" ? "https://" : undefined)} />}
                  {f.help && <span className="mt-1 block text-[0.78rem] text-white/50">{f.help}</span>}
                  {err && <span id={`${id}-e`} role="alert" className="mt-1 block text-[0.82rem] font-semibold text-[#ff7a66]">{err}</span>}
                </div>
              );
            })}
            {s.key === "health" && String(v.injuries ?? "").trim() && (
              <label className={`flex items-start gap-3 border p-4 text-[0.9rem] sm:col-span-2 ${errors.healthConsent ? "border-alert" : "border-white/15"}`}>
                <input type="checkbox" checked={healthConsent} onChange={(e) => { setHealthConsent(e.target.checked); setErrors((x) => { const n = { ...x }; delete n.healthConsent; return n; }); }} aria-invalid={Boolean(errors.healthConsent)} className="mt-1 h-5 w-5 shrink-0 accent-[#FFD23F]" />
                <span>I explicitly consent to Concordia using the injury information above for the Pathway Assessment only{view.isMinor ? " (as the player’s parent or legal guardian)" : ""}. I can withdraw this consent at any time; the information is then deleted. {errors.healthConsent && <span role="alert" className="block font-semibold text-[#ff7a66]">{errors.healthConsent}</span>}</span>
              </label>
            )}
          </div>
        </fieldset>
      ))}

      <div className="rounded-[16px] border border-white/12 bg-ink-deep p-6 sm:p-8">
        {deliveryError && <p role="alert" className="mb-4 border-l-2 border-alert pl-4 text-white">{deliveryError}</p>}
        <button type="submit" disabled={sending} aria-busy={sending} className="btn btn-route w-full disabled:opacity-60 sm:w-auto">{sending ? "Sending…" : update ? "Send additional materials" : "Send my materials"} <span className="arrow" aria-hidden>→</span></button>
        {adding && <button type="button" onClick={() => setAdding(false)} className="ml-0 mt-3 block text-[0.9rem] underline underline-offset-4 sm:ml-4 sm:mt-0 sm:inline">Cancel</button>}
        <p className="mt-4 text-[0.82rem] text-white/55">Your materials go to the Concordia assessment team and are used only for your assessment. See our <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.</p>
      </div>
    </form>
  );
}

function Received({ at, n, onAddMore, t }: { at: string; n: number; onAddMore: () => void; t: string }) {
  return (
    <div className="rounded-[16px] border border-route/60 bg-ink-deep p-7 sm:p-10">
      <h1 className="display d-lg max-w-[18ch]">Thanks — we’ve received your materials.</h1>
      <p className="lede mt-4 max-w-2xl text-white/85">Our team will review them to confirm whether we have the information reasonably required to begin your Pathway Assessment. We’ll email you either way — to confirm your assessment has started, or to ask for anything we still need.</p>
      <dl className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-[0.9rem] sm:grid-cols-3">
        <div><dt className="text-white/55">Received</dt><dd className="mt-1 font-semibold">{fmtDate(at)}{n > 1 ? ` · ${n} submissions` : ""}</dd></div>
        <div><dt className="text-white/55">Status</dt><dd className="mt-1 font-semibold">We’re checking your materials</dd></div>
        <div><dt className="text-white/55">Assessment start</dt><dd className="mt-1 font-semibold">After our materials check</dd></div>
      </dl>
      <div className="mt-8 flex flex-wrap gap-3"><button onClick={onAddMore} className="btn btn-ghost">Send something else</button><Link href={`/status?t=${t}`} className="btn btn-ghost">Your status</Link></div>
    </div>
  );
}
