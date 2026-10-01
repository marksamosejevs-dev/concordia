"use client";
import Link from "next/link";
import { useState } from "react";
import { useMounted } from "@/lib/hooks";
import { lastApplication } from "@/lib/applications/destination";
import type { ApplicationSubmission, TriageRoute } from "@/lib/applications/schema";
import { IS_REVIEW } from "@/lib/site-mode";

const COPY: Record<TriageRoute, { title: string; body: string }> = {
  accepted: { title: "You’ve been accepted for a Pathway Assessment.", body: "Based on what you’ve told us, an assessment makes sense. Complete your purchase to begin — your report arrives within 7 business days of payment and footage." },
  guardian_payment: { title: "Accepted — a parent or guardian completes payment.", body: "The player has been accepted for a Pathway Assessment. Because the player is under 18, a parent or guardian completes the purchase and joins the process." },
  needs_full_match: { title: "Add a full match to continue.", body: "We can’t assess a player honestly from highlights alone. Add a link to any full, unedited match and we’ll review your application again." },
  under_16: { title: "It’s too early for an assessment — and that’s not a bad thing.", body: "We don’t sell assessments to players under 16. At this age, minutes, development and enjoyment matter most. Here’s what to focus on." },
  not_now: { title: "An assessment isn’t the right step yet.", body: "Right now there isn’t enough for an assessment to work with. Here’s what would change that — and you’re welcome to apply again." },
};

export function ResultScreen() {
  const mounted = useMounted();
  const [demo, setDemo] = useState<TriageRoute>("accepted");
  const sub: ApplicationSubmission | null | undefined = mounted ? lastApplication() : undefined;
  if (sub === undefined) return <div className="h-64" />;
  const route: TriageRoute = sub?.triage.route ?? demo;
  const c = COPY[route];
  const paying = route === "accepted" || route === "guardian_payment";
  return (
    <div>
      {!sub && IS_REVIEW && (
        <div className="gated mb-8 p-4">
          <span className="gate-tag absolute -top-3 left-2">Review only · preview each result</span>
          <div className="flex flex-wrap gap-2">{(Object.keys(COPY) as TriageRoute[]).map((r) => <button key={r} onClick={() => setDemo(r)} className={`px-3 py-1.5 text-[0.75rem] ${demo === r ? "bg-white text-ink" : "border border-white/20"}`}>{r}</button>)}</div>
        </div>
      )}
      <div className={`border p-7 sm:p-10 ${paying ? "border-route/70 bg-ink-deep" : "border-white/15 bg-ink-deep"}`}>
        {paying && <p className="mono inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-route"><span className="inline-block h-2 w-2 rounded-full bg-route" />Accepted for an assessment</p>}
        <h1 className="display d-lg mt-4 max-w-[18ch]">{c.title}</h1>
        <p className="lede mt-5 max-w-2xl text-white/85">{c.body}</p>
        {paying && (
          <>
            <div className="mt-8 flex flex-col justify-between gap-6 border-y border-white/10 py-6 sm:flex-row sm:items-center">
              <div><p className="font-semibold">Player Pathway Assessment</p><p className="mono mt-1 text-[0.72rem] text-slate-light">Written report · full-match review · level band · three markets · 90-day plan · review call</p></div>
              <p className="display text-[3.5rem] leading-none text-route">$249</p>
            </div>
            <Link href="/checkout/assessment" className="btn btn-route mt-8 w-full sm:w-auto">Continue to checkout <span className="arrow">→</span></Link>
            <div className="mt-8 border-l-2 border-white/30 pl-5 text-[0.92rem] text-white/80">
              <p className="font-semibold text-white">What “accepted” means</p>
              <p className="mt-1">You’ve been accepted for a Pathway Assessment — a career advisory service. This is not acceptance for representation, not selection by Concordia Sports Agency, and not selection by any club.</p>
            </div>
          </>
        )}
        {route === "needs_full_match" && <ul className="mt-6 space-y-2 text-white/85"><li>— Any full 90 minutes, unedited</li><li>— A wide angle from the stand is better than nothing</li><li>— Add your highlights too</li></ul>}
        {!paying && <div className="mt-8 flex flex-wrap gap-4"><Link href="/apply" className="btn btn-route">Update my application</Link><Link href="/for/parents" className="btn btn-ghost">Read the guide</Link></div>}
        {sub && <p className="mono mt-10 text-[0.68rem] text-slate">Reference {sub.id}</p>}
      </div>
    </div>
  );
}
