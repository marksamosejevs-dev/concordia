"use client";
import Link from "next/link";
import { useState } from "react";
import { usePlayerView, fmtDate, type PlayerView } from "@/lib/client/player";
import { CUSTOMER_TIMELINE, STATE_LABEL, type AssessmentState } from "@/lib/assessment-status";
import { DELIVERY_FULL, ACCEPTED_MEANING } from "@/content/assessment";
import { Loading, InvalidLink, LoadError } from "./LinkStates";

/** Player / parent status — from the server record via the signed link. Team decisions arrive by email too. */
export function StatusView() {
  const { token, view, state, reload } = usePlayerView();
  if (state === "loading") return <Loading />;
  if (state === "invalid") return <InvalidLink />;
  if (state === "error" || !view || !token) return <LoadError retry={reload} />;
  const t = encodeURIComponent(token);
  const cur = CUSTOMER_TIMELINE.indexOf(mapToTimeline(view.state));
  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-white/15 bg-ink-deep p-7 sm:p-10">
        <p className="text-[0.9rem] font-semibold text-route">{view.label} · {view.id}</p>
        <Body v={view} t={t} />
        {!view.notAccepted && (
          <ol className="mt-10 grid gap-2 border-t border-white/10 pt-6 sm:grid-cols-3 lg:grid-cols-5" aria-label="Your progress">
            {CUSTOMER_TIMELINE.map((s, idx) => <li key={s} aria-current={idx === cur ? "step" : undefined} className={`rounded-[8px] px-3 py-2 text-[0.82rem] ${idx === cur ? "bg-route font-bold text-ink" : idx < cur ? "bg-white/10 text-white/80" : "border border-white/10 text-white/45"}`}>{STATE_LABEL[s]}</li>)}
          </ol>
        )}
      </div>
      {view.subscription && <Subscription v={view} token={token} />}
    </div>
  );
}

function mapToTimeline(s: AssessmentState): AssessmentState {
  if (s === "materials_requested") return "payment_received";
  if (s === "additional_information_required" || s === "materials_sufficient") return "materials_under_review";
  if (s === "call_completed") return "next_steps";
  if (s === "not_accepted") return "application_received";
  return CUSTOMER_TIMELINE.includes(s) ? s : "application_received";
}

function Body({ v, t }: { v: PlayerView; t: string }) {
  const h = "display d-lg mt-3 max-w-[20ch]", p = "lede mt-4 max-w-2xl text-white/85";
  switch (v.state) {
    case "application_received": return <><h1 className={h}>We’ve received your application.</h1><p className={p}>Our team will review the profile and let you know by email whether we can offer a Pathway Assessment. No payment has been taken.</p></>;
    case "accepted_for_assessment": return <><h1 className={h}>Accepted for a Pathway Assessment.</h1><p className={p}>{ACCEPTED_MEANING}</p>
      {v.paymentStatus === "checkout_open" && <p className="mt-4 text-white/70">If you’ve just paid, confirmation can take a minute — refresh this page.</p>}
      <Link href={`/checkout/assessment?t=${t}`} className="btn btn-route mt-6">Continue to the $249 Pathway Assessment <span className="arrow" aria-hidden>→</span></Link></>;
    case "payment_received": case "materials_requested": return <><h1 className={h}>Payment received — send your materials.</h1><p className={p}>Send your football profile and materials so we can start.</p>{v.earlyStartRequested === false && <p className="mt-3 text-white/70">You asked us to wait until your withdrawal period ends ({fmtDate(v.withdrawalEndsAt)}) before starting.</p>}<Link href={`/onboarding?t=${t}`} className="btn btn-route mt-6">Send your profile + materials <span className="arrow" aria-hidden>→</span></Link></>;
    case "materials_submitted": case "materials_under_review": return <><h1 className={h}>Thanks — we’ve received your materials.</h1><p className={p}>Our team is checking whether we have the information reasonably required to begin your Pathway Assessment.</p><p className="mt-4 text-[0.85rem] text-white/55">{DELIVERY_FULL}</p><Link href={`/onboarding?t=${t}`} className="btn btn-ghost mt-6">Send something else</Link></>;
    case "additional_information_required": return <><h1 className={h}>We need a little more before we can start.</h1><p className={p}>Please send:</p><ul className="mt-3 list-disc space-y-1 pl-6 text-white/85">{v.additionalInfoItems.map((x) => <li key={x}>{x}</li>)}</ul><p className="mt-4 text-[0.85rem] text-white/55">The 7-day assessment period starts once we have what’s needed and confirm your materials are sufficient.</p><Link href={`/onboarding?t=${t}`} className="btn btn-route mt-6">Send the additional information <span className="arrow" aria-hidden>→</span></Link></>;
    case "materials_sufficient": return <><h1 className={h}>Your materials are confirmed.</h1><p className={p}>Your assessment starts once your payment is confirmed. No assessment period runs until then.</p></>;
    case "assessment_in_progress": return <><h1 className={h}>Your Pathway Assessment is in progress.</h1><dl className="mt-6 grid gap-4 sm:grid-cols-2"><div><dt className="text-white/55">Assessment start date</dt><dd className="mt-1 text-[1.1rem] font-bold">{fmtDate(v.deadline?.startDate)}</dd></div><div><dt className="text-white/55">Target completion</dt><dd className="mt-1 text-[1.1rem] font-bold">Within 7 days — by {fmtDate(v.deadline?.targetDate)}</dd></div></dl></>;
    case "assessment_ready": case "call_to_be_scheduled": return <><h1 className={h}>Your Pathway Assessment is ready.</h1><p className={p}>The next step is your consultation call of up to 60 minutes. Parents and guardians are welcome.</p><div className="mt-6 flex flex-wrap gap-3">{v.reportUrl && <a href={v.reportUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Open your assessment</a>}{v.bookingUrl ? <a href={v.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-route">Book your call <span className="arrow" aria-hidden>→</span></a> : <p className="rounded-[8px] border border-white/15 px-4 py-3 text-[0.92rem] text-white/80">We’ll contact you by email to arrange the call.</p>}</div></>;
    case "call_completed": case "next_steps": return <><h1 className={h}>Your next steps.</h1><p className={p}>The decision is yours. European Pathway is $399/month — designed as a 6-month European career pathway, paid monthly.{v.credit ? ` Your $150 assessment credit makes your first payment $249 (available until ${fmtDate(v.credit.expiresAt)}).` : ""}</p>{v.pathwayOffered && !v.subscription ? <Link href={`/checkout/pathway?t=${t}`} className="btn btn-route mt-6">Continue with European Pathway <span className="arrow" aria-hidden>→</span></Link> : <Link href="/european-pathway" className="btn btn-ghost mt-6">About European Pathway</Link>}</>;
    case "not_accepted": return <><h1 className={h}>We can’t offer an assessment at this stage.</h1><p className={p}>No payment has been taken. You’re welcome to apply again when your situation changes.</p></>;
  }
}

function Subscription({ v, token }: { v: PlayerView; token: string }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const s = v.subscription!;
  const open = async () => {
    setBusy(true); setErr("");
    const r = await fetch("/api/billing-portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ t: token }) }).catch(() => null);
    const j = await r?.json().catch(() => ({}));
    if (r?.ok && j?.url) window.location.assign(j.url); else { setBusy(false); setErr("We couldn’t open subscription management just now. Please try again, or email us."); }
  };
  return (
    <div className="rounded-[16px] border border-white/15 bg-ink-deep p-7 sm:p-9">
      <p className="eyebrow text-route">European Pathway</p>
      <p className="mt-3 text-[1.1rem] font-semibold">Subscription: {s.status === "active" ? "active" : s.status === "past_due" ? "payment overdue — please update your card" : s.status === "cancelled" ? "ended" : s.status}{s.cancelAt ? ` · ends ${fmtDate(s.cancelAt)}` : ""}</p>
      {s.manageable && s.status !== "cancelled" && <button onClick={open} disabled={busy} className="btn btn-ghost mt-5">{busy ? "Opening…" : "Manage or cancel subscription"}</button>}
      {err && <p role="alert" className="mt-3 text-[#ff7a66]">{err}</p>}
    </div>
  );
}
