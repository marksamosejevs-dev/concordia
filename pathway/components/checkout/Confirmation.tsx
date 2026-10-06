"use client";
import Link from "next/link";
import { useMounted } from "@/lib/hooks";
import { lastOrder, fmtDate } from "@/lib/funnel";
import { FlowLine } from "@/components/funnel/FlowLine";
import { DELIVERY, ACCEPTED_MEANING } from "@/content/assessment";
import { LEGAL_ENTITY } from "@/content/site";

/** Payment confirmed → onboarding starts immediately (no waiting days for materials). */
export function Confirmation() {
  const mounted = useMounted();
  if (!mounted) return <div className="h-64" />;
  const data = lastOrder();
  if (!data) return (
    <div className="rounded-[16px] border border-white/15 bg-ink-deep p-8">
      <h1 className="display d-md">No payment found on this device.</h1>
      <p className="mt-3 text-white/75">If you’ve paid, use the onboarding link in your confirmation email.</p>
      <Link href="/apply" className="btn btn-ghost mt-6">Apply</Link>
    </div>
  );
  const preview = data.session.status === "preview";
  const href = `/onboarding/?order=${encodeURIComponent(data.order.id)}`;
  return (
    <div className="space-y-8">
      <div className="rounded-[16px] border border-route/60 bg-ink-deep p-7 sm:p-10">
        {preview && <p className="gate-tag inline-block">Preview — payments not active · no card was charged</p>}
        <h1 className="display d-lg mt-4 max-w-[18ch]">We’re ready to start your Pathway Assessment.</h1>
        <p className="lede mt-4 max-w-2xl text-white/85">One thing first: send us your football profile, CV and video. The sooner we have them, the sooner we start.</p>
        <Link href={href} className="btn btn-route mt-8" data-magnetic>Send your football profile + video <span className="arrow" aria-hidden>→</span></Link>
        <dl className="mt-10 grid gap-4 border-t border-white/10 pt-6 text-[0.9rem] sm:grid-cols-3">
          <div><dt className="text-white/55">Payment</dt><dd className="mt-1 font-semibold">{preview ? "Preview — not charged" : "Confirmed"} · ${data.order.amount}</dd></div>
          <div><dt className="text-white/55">Reference</dt><dd className="mt-1 font-semibold">{data.order.id}{data.order.applicationId ? ` · ${data.order.applicationId}` : ""}</dd></div>
          <div><dt className="text-white/55">Date</dt><dd className="mt-1 font-semibold">{fmtDate(data.paidAt ?? data.order.createdAt)}</dd></div>
        </dl>
        <p className="mt-6 text-[0.85rem] text-white/60">{DELIVERY}</p>
        <p className="mt-2 text-[0.85rem] text-white/60">{ACCEPTED_MEANING}</p>
        <p className="mt-2 text-[0.8rem] text-white/45">Receipts are issued by {LEGAL_ENTITY.name}.</p>
      </div>
      <FlowLine current={4} />
    </div>
  );
}
