"use client";
import Link from "next/link";
import { useState } from "react";
import { useMounted } from "@/lib/hooks";
import { lastOrder, materialsFor, paymentConfirmed, fmtDate } from "@/lib/funnel";
import { lastApplication } from "@/lib/applications/destination";
import { assessmentDeadline, currentState, CUSTOMER_TIMELINE, STATE_LABEL, type AssessmentRecord, type AssessmentState } from "@/lib/assessment-status";
import { DELIVERY_FULL } from "@/content/assessment";
import { BookCallButton } from "./BookCallButton";
import { IS_REVIEW } from "@/lib/site-mode";

/**
 * Customer status screen. Built only from what this browser genuinely knows (payment confirmation, materials submitted).
 * Team decisions — materials sufficient, additional information, assessment ready — arrive by email until a backend
 * exposes them (integration pending). Review builds can preview every state via the simulator.
 */
const D = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString();
const PRESETS: { label: string; r: AssessmentRecord }[] = [
  { label: "Under review", r: { paymentReceivedAt: D(-3), materialsSubmittedAt: D(-2), reviewStartedAt: D(-1) } },
  { label: "Additional information required", r: { paymentReceivedAt: D(-3), materialsSubmittedAt: D(-2), additionalInfoRequestedAt: D(-1), additionalInfoItems: ["Recent playing history (last two seasons: club, level, minutes)", "At least one match video link, or tell us none exists"] } },
  { label: "Assessment in progress", r: { paymentReceivedAt: D(-3), materialsSubmittedAt: D(-2), sufficientConfirmedAt: D(-1) } },
  { label: "Sufficient but unpaid", r: { materialsSubmittedAt: D(-2), sufficientConfirmedAt: D(-1) } },
  { label: "Assessment ready", r: { paymentReceivedAt: D(-10), materialsSubmittedAt: D(-9), sufficientConfirmedAt: D(-8), assessmentReadyAt: D(-1) } },
  { label: "Next steps", r: { paymentReceivedAt: D(-14), materialsSubmittedAt: D(-13), sufficientConfirmedAt: D(-12), assessmentReadyAt: D(-6), callCompletedAt: D(-1) } },
];

export function AssessmentStatus() {
  const mounted = useMounted();
  const [preset, setPreset] = useState<number | null>(null);
  if (!mounted) return <div className="h-64" />;
  const order = lastOrder();
  const mat = order ? materialsFor(order.order.id) : null;
  const local: AssessmentRecord = {
    applicationId: lastApplication()?.id,
    paymentReceivedAt: paymentConfirmed(order) ? order?.paidAt : undefined, // preview never counts
    materialsSubmittedAt: mat?.submittedAt,
  };
  const r = preset !== null ? PRESETS[preset].r : local;
  const state = currentState(r);
  const dl = assessmentDeadline(r);

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-white/15 bg-ink-deep p-7 sm:p-10">
        <p className="text-[0.9rem] font-semibold text-route">{STATE_LABEL[state]}</p>
        <StateBody state={state} r={r} startDate={dl.startDate} targetDate={dl.targetDate} />
        <ol className="mt-10 grid gap-2 border-t border-white/10 pt-6 sm:grid-cols-3 lg:grid-cols-5">
          {CUSTOMER_TIMELINE.map((s) => {
            const idx = CUSTOMER_TIMELINE.indexOf(s), cur = CUSTOMER_TIMELINE.indexOf(mapToTimeline(state));
            return <li key={s} className={`rounded-[8px] px-3 py-2 text-[0.82rem] ${idx === cur ? "bg-route font-bold text-ink" : idx < cur ? "bg-white/10 text-white/80" : "border border-white/10 text-white/45"}`}>{STATE_LABEL[s]}</li>;
          })}
        </ol>
        {preset === null && !IS_REVIEW && <p className="mt-6 text-[0.82rem] text-white/50">Updates from our team — materials confirmed, anything missing, assessment ready — arrive by email.</p>}
      </div>
      {IS_REVIEW && (
        <div className="gated rounded-[12px] p-5">
          <span className="gate-tag absolute -top-3 left-2">Review build only · preview team-driven states (computed by the status model)</span>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setPreset(null)} className={`rounded-full px-3 py-1.5 text-[0.8rem] ${preset === null ? "bg-white text-ink" : "border border-white/25"}`}>This device</button>
            {PRESETS.map((p, i) => <button key={p.label} onClick={() => setPreset(i)} className={`rounded-full px-3 py-1.5 text-[0.8rem] ${preset === i ? "bg-white text-ink" : "border border-white/25"}`}>{p.label}</button>)}
          </div>
        </div>
      )}
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

function StateBody({ state, r, startDate, targetDate }: { state: AssessmentState; r: AssessmentRecord; startDate?: string; targetDate?: string }) {
  const h = "display d-lg mt-3 max-w-[20ch]", p = "lede mt-4 max-w-2xl text-white/85";
  switch (state) {
    case "application_received": return <><h1 className={h}>We’ve received your application.</h1><p className={p}>Our team will review your profile and let you know whether we can offer you a Pathway Assessment.</p></>;
    case "accepted_for_assessment": return <><h1 className={h}>You’ve been accepted for a Pathway Assessment.</h1><p className={p}>Use the payment link in your acceptance email to continue.</p></>;
    case "payment_received": case "materials_requested": return <><h1 className={h}>We’re ready to start your Pathway Assessment.</h1><p className={p}>Send your football profile and materials.</p><Link href="/onboarding/" className="btn btn-route mt-6">Send your profile + materials →</Link></>;
    case "materials_submitted": case "materials_under_review": return <><h1 className={h}>Thanks — we’ve received your materials.</h1><p className={p}>Our team will review them to confirm whether we have the information reasonably required to begin your Pathway Assessment.</p><p className="mt-4 text-[0.85rem] text-white/55">{DELIVERY_FULL}</p></>;
    case "additional_information_required": return <><h1 className={h}>We need a little more before we can start.</h1><p className={p}>We’ve reviewed your submission and need some additional information before we can begin your Pathway Assessment:</p><ul className="mt-4 list-disc space-y-1 pl-6 text-white/85">{(r.additionalInfoItems ?? []).map((x) => <li key={x}>{x}</li>)}</ul><p className="mt-4 text-[0.85rem] text-white/55">The 7-day assessment period starts once we have what’s needed and confirm your materials are sufficient.</p><Link href="/onboarding/" className="btn btn-route mt-6">Send the missing information →</Link></>;
    case "materials_sufficient": return <><h1 className={h}>Your materials are ready.</h1><p className={p}>Your assessment starts as soon as your payment is confirmed. No assessment period runs until then.</p></>;
    case "assessment_in_progress": return <><h1 className={h}>Your Pathway Assessment is in progress.</h1><p className={p}>We have the information required to begin your Pathway Assessment.</p><dl className="mt-6 grid gap-4 sm:grid-cols-2"><div><dt className="text-white/55">Assessment start date</dt><dd className="mt-1 text-[1.1rem] font-bold">{fmtDate(startDate)}</dd></div><div><dt className="text-white/55">Target completion</dt><dd className="mt-1 text-[1.1rem] font-bold">Within 7 days — by {fmtDate(targetDate)}</dd></div></dl></>;
    case "assessment_ready": case "call_to_be_scheduled": return <><h1 className={h}>Your Pathway Assessment is ready.</h1><p className={p}>Book your included consultation call of up to 60 minutes.</p><div className="mt-6"><BookCallButton /></div></>;
    case "call_completed": case "next_steps": return <><h1 className={h}>Your next steps.</h1><p className={p}>The decision is yours. If continuing makes sense, European Pathway is $399/month — designed as a 6-month pathway, paid monthly. Any football-agent representation is a separate agreement.</p><Link href="/european-pathway/" className="btn btn-ghost mt-6">About European Pathway</Link></>;
    case "not_accepted": return <><h1 className={h}>We can’t offer you an assessment at this stage.</h1><p className={p}>You’re welcome to apply again when your situation changes.</p></>;
  }
}
