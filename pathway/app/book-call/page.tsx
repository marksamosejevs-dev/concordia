import type { Metadata } from "next";
import Link from "next/link";
import { CALL_COVERS, CALL_MINUTES } from "@/content/assessment";
import { BookCallButton } from "@/components/funnel/BookCallButton";

export const metadata: Metadata = { title: "Your 60-minute assessment call", robots: { index: false, follow: false } };
export default function BookCallPage() {
  return (
    <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]">
      <div className="wrap-narrow">
        <div className="rounded-[16px] border border-white/15 bg-ink-deep p-7 sm:p-10">
          <h1 className="display d-lg max-w-[18ch]">Your {CALL_MINUTES}-minute assessment call.</h1>
          <p className="lede mt-4 max-w-2xl text-white/85">When your Pathway Assessment is ready, we walk you through it — parents and guardians welcome.</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">{CALL_COVERS.map((c) => <li key={c} className="rounded-[8px] bg-white/5 px-3 py-2 text-[0.92rem]">{c}</li>)}</ul>
          <p className="mt-6 text-[0.9rem] text-white/65">The call is advisory. It doesn’t promise a club, a trial, representation, an offer, a contract or a transfer.</p>
          <div className="mt-8"><BookCallButton /></div>
          <Link href="/" className="mt-6 inline-block text-[0.9rem] underline underline-offset-4">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
