"use client";
import Link from "next/link";
import { useMounted } from "@/lib/hooks";
import { lastApplication } from "@/lib/applications/destination";
import { ACCEPTED_MEANING } from "@/content/assessment";
import { FlowLine } from "@/components/funnel/FlowLine";
import { IS_REVIEW } from "@/lib/site-mode";

/** After submitting: the application is RECEIVED. Acceptance only follows the team's review (by email). */
export function ResultScreen() {
  const mounted = useMounted();
  if (!mounted) return <div className="h-64" />;
  const sub = lastApplication();
  const under16 = sub?.triage.route === "under_16";
  return (
    <div className="space-y-8">
      <div className="rounded-[16px] border border-white/15 bg-ink-deep p-7 sm:p-10">
        <h1 className="display d-lg max-w-[18ch]">{under16 ? "Thanks — it’s a little early for an assessment." : "Thanks — we’ve received your application."}</h1>
        {under16 ? (
          <p className="lede mt-5 max-w-2xl text-white/85">We don’t offer assessments to players under 16. At this age, minutes, development and enjoyment matter most. You’re very welcome to apply again later.</p>
        ) : (
          <p className="lede mt-5 max-w-2xl text-white/85">Our team will review your profile and let you know whether we can offer you a Pathway Assessment. No payment is taken to apply.</p>
        )}
        {!under16 && (
          <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div><p className="font-semibold">If you’re accepted</p><p className="mt-1 text-white/75">You’ll get an email confirming you’re accepted for a Pathway Assessment, what it includes and a link to pay $249. Straight after payment, we’ll ask for your football profile and materials.</p></div>
            <div><p className="font-semibold">What “accepted” means</p><p className="mt-1 text-white/75">{ACCEPTED_MEANING}</p></div>
          </div>
        )}
        {sub?.duplicateOf && <p className="mt-6 rounded-[8px] bg-white/10 px-4 py-3 text-[0.9rem] text-white/85">You’ve applied from this device before ({sub.duplicateOf}). We’ve linked the two, so there’s no need to apply again.</p>}
        {sub && <p className="mt-8 text-[0.8rem] text-white/50">Application reference {sub.id} · keep this for your records</p>}
        <div className="mt-8 flex flex-wrap gap-4"><Link href="/assessment" className="btn btn-ghost">What the assessment includes</Link><Link href="/" className="btn btn-ghost">Back to home</Link></div>
      </div>
      {!under16 && <FlowLine current={1} />}
      {IS_REVIEW && sub && (
        <div className="gated rounded-[12px] p-5">
          <span className="gate-tag absolute -top-3 left-2">Review build only · simulates the team’s decision</span>
          <p className="text-[0.9rem] text-white/80">In production the team reviews the application and sends the acceptance email (integration pending). To test the rest of the funnel:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href={`/checkout/assessment/?a=${encodeURIComponent(sub.id)}`} className="btn btn-route !min-h-[42px]">Open the acceptance link</Link>
            <Link href="/review/emails/" className="btn btn-ghost !min-h-[42px]">Preview the emails</Link>
          </div>
        </div>
      )}
    </div>
  );
}
