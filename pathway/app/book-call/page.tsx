import type { Metadata } from "next";
import Link from "next/link";
import { CALL_COVERS, CALL_MINUTES } from "@/content/assessment";

export const metadata: Metadata = { title: "Your consultation call", robots: { index: false, follow: false } };
/** Informational. The booking link itself is personal: it is emailed when the assessment is ready and shown on the status page. */
export default function BookCallPage() {
  return (
    <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]">
      <div className="wrap-narrow">
        <div className="rounded-[16px] border border-white/15 bg-ink-deep p-7 sm:p-10">
          <h1 className="display d-lg max-w-[18ch]">Your consultation call — up to {CALL_MINUTES} minutes.</h1>
          <p className="lede mt-4 max-w-2xl text-white/85">When your Pathway Assessment is ready, we walk you through it. Parents and guardians are welcome.</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">{CALL_COVERS.map((c) => <li key={c} className="rounded-[8px] bg-white/5 px-3 py-2 text-[0.92rem]">{c}</li>)}</ul>
          <p className="mt-6 text-[0.9rem] text-white/65">The call is advisory. It doesn’t promise a club, a trial, representation, an offer, a contract or a transfer.</p>
          <p className="mt-6 rounded-[8px] border border-white/15 px-4 py-3 text-[0.92rem] text-white/80">Your personal booking link arrives by email when your assessment is ready, and is shown on your status page.</p>
          <Link href="/" className="mt-6 inline-block text-[0.9rem] underline underline-offset-4">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
