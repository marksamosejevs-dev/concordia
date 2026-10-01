"use client";
import Link from "next/link";
import { useMounted } from "@/lib/hooks";
import type { Order } from "@/lib/commerce/types";
import type { CheckoutSession } from "@/lib/commerce/provider";
import { LEGAL_ENTITY } from "@/content/site";

export function Confirmation() {
  const mounted = useMounted();
  let data: { order: Order; session: CheckoutSession } | null = null;
  if (mounted) { try { data = JSON.parse(sessionStorage.getItem("cs_last_order") || "null"); } catch {} }
  const preview = !data || data.session.status === "preview";
  return (
    <div className="border border-white/15 bg-ink-deep p-7 sm:p-10">
      {preview && <p className="gate-tag inline-block">Preview — payments not active · no card was charged</p>}
      <h1 className="display d-lg mt-5">What happens next.</h1>
      <p className="lede mt-4 max-w-2xl text-white/85">Once payment is confirmed, your assessment begins. Here’s the timeline.</p>
      <ol className="mt-10 grid gap-px bg-white/10 sm:grid-cols-4">
        {[["Today", "Confirmation email and receipt from " + LEGAL_ENTITY.name + "."], ["Days 1–2", "Your profile and footage are prepared for review."], ["Within 7 business days", "Your written report is delivered."], ["After the report", "Book your 30-minute review call — family welcome."]].map(([t, b], i) => (
          <li key={t} className="bg-ink-deep p-5"><span className="mono text-[0.7rem] text-route">0{i + 1}</span><p className="display mt-2 text-[1.3rem] leading-none">{t}</p><p className="mt-2 text-[0.88rem] text-white/75">{b}</p></li>
        ))}
      </ol>
      {data && <p className="mono mt-8 text-[0.7rem] text-slate">Order {data.order.id} · {data.order.playerName} · ${data.order.amount}</p>}
      <p className="mt-8 text-[0.9rem] text-white/70">Reminder: European Pathway is career advisory. It is not representation by Concordia Sports Agency.</p>
      <Link href="/" className="btn btn-ghost mt-8">Back to home</Link>
    </div>
  );
}
