import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { VerifyLedger } from "@/components/verify/VerifyLedger";
import { FinalCta } from "@/components/sections/HomeSections";

// Not part of the customer journey (no marketing-site links); kept technically, excluded from indexing and the sitemap.
export const metadata: Metadata = { robots: { index: false, follow: false }, alternates: { canonical: "/verify/" }, title: "Verify us", description: "Every claim, with a way to check it." };

export default function VerifyPage() {
  return (
    <>
      <PageHero eyebrow="Verify us" title={<>Don’t just trust us. <span className="text-route">Verify us.</span></>} lede="Every claim on this site comes with a way to check it. Where a credential can be verified publicly, we tell you how." />
      <Section tone="ink" label="Evidence ledger" className="!pt-6">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap gap-6 text-[0.85rem] text-white/75">
            <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-route" />Confirmed</span>
            <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full border-2 border-route" />Document viewable</span>
          </div>
          <VerifyLedger mode="full" />
          <p className="mt-10 max-w-3xl text-[0.9rem] text-slate-light"><Link href="/legal/terms#notices" className="underline underline-offset-2">Key notices</Link></p>
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
