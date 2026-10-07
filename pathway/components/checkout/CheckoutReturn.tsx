"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUrlParam, type PlayerView } from "@/lib/client/player";
import { InvalidLink } from "@/components/funnel/LinkStates";

/**
 * After Stripe redirects back. The redirect itself proves nothing: we wait for the verified webhook to update the
 * record (polling /api/status), and only then show the next step.
 */
export function CheckoutReturn() {
  const t = useUrlParam("t");
  const pathway = useUrlParam("p") === "pathway";
  const [view, setView] = useState<PlayerView | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (!t) return;
    let n = 0, stop = false;
    const tick = async () => {
      if (stop) return;
      const r = await fetch(`/api/status?t=${encodeURIComponent(t)}`, { cache: "no-store" }).catch(() => null);
      const j = await r?.json().catch(() => null);
      if (j?.ok) { setView(j.view); const done = pathway ? j.view.subscription?.status === "active" : j.view.paid; if (done) return; }
      if (++n > 30) { setTimedOut(true); return; }
      setTimeout(tick, 2000);
    };
    tick();
    return () => { stop = true; };
  }, [t, pathway]);
  if (t === undefined) return <div className="h-64" />;
  if (!t) return <InvalidLink />;
  const e = encodeURIComponent(t);
  const confirmed = view && (pathway ? view.subscription?.status === "active" : view.paid);
  return (
    <div className="rounded-[16px] border border-white/15 bg-ink-deep p-7 sm:p-10" aria-live="polite">
      {confirmed ? (pathway ? (
        <><h1 className="display d-lg">Welcome to European Pathway.</h1><p className="lede mt-4 text-white/85">Your subscription is active. We’ll be in touch to plan month one.</p><Link href={`/status?t=${e}`} className="btn btn-route mt-8">Your status & subscription</Link></>
      ) : (
        <><h1 className="display d-lg">Payment confirmed.</h1><p className="lede mt-4 text-white/85">Next: send your football profile and materials so we can start your Pathway Assessment.</p><Link href={`/onboarding?t=${e}`} className="btn btn-route mt-8">Send your materials <span className="arrow" aria-hidden>→</span></Link></>
      )) : timedOut ? (
        <><h1 className="display d-md">We haven’t received confirmation yet.</h1><p className="mt-3 text-white/80">Payments are confirmed directly by our payment provider, which can take a few minutes. You’ll receive an email as soon as it’s confirmed — no need to pay again.</p><Link href={`/status?t=${e}`} className="btn btn-ghost mt-6">Check your status</Link></>
      ) : (
        <><h1 className="display d-md">Confirming your payment…</h1><p className="mt-3 text-white/80">This usually takes a few seconds. Please keep this page open.</p></>
      )}
    </div>
  );
}
