import type { Metadata } from "next";
import Link from "next/link";
import { PricePair, FinalOffer } from "@/components/home/HomeV2";
import { CTA } from "@/content/site";

/** Former programme catalogue. Round 1 replaces it with one recurring product: European Pathway. */
export const metadata: Metadata = { title: "Programmes", description: "Concordia Soccer programmes are now one monthly product: European Pathway, $399/month after your assessment.", robots: { index: false, follow: true } };

export default function ProgrammesPage() {
  return (
    <>
      <section className="on-ink pb-16 pt-[calc(var(--header-h)+3rem)]" aria-label="Programmes">
        <div className="wrap">
          <p className="mono mb-5 text-[0.72rem] uppercase tracking-[0.14em] text-route">Programmes</p>
          <h1 className="display d-hero max-w-[14ch]">One pathway. <span className="text-route">Paid monthly.</span></h1>
          <p className="lede mt-6 max-w-xl text-white/80">Our programmes are now a single ongoing service: European Pathway. Start with the assessment, then continue month by month.</p>
          <PricePair className="mt-10 max-w-[620px]" />
          <Link href="/european-pathway" className="btn btn-route mt-8">{CTA.pathway} <span className="arrow" aria-hidden>→</span></Link>
        </div>
      </section>
      <FinalOffer />
    </>
  );
}
