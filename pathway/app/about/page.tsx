import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { TeamGrid } from "@/components/team/TeamGrid";
import { InsideFootballStrip, FinalCta } from "@/components/sections/HomeSections";
import { LEGAL_ENTITY } from "@/content/site";

export const metadata: Metadata = { alternates: { canonical: "/about/" }, title: "About Concordia Soccer", description: "A professional team, led by a FIFA Licensed Football Agent, working inside European football." };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Concordia Soccer · European Pathway" title={<>Built inside football. <span className="text-route">Led by people who work in it.</span></>}
        lede="European Pathway makes professional football career thinking available to players beyond a representation roster — honestly, with evidence, and without selling the dream." />
      <Section tone="paper" label="What European Pathway is">
        <div className="wrap grid gap-12 lg:grid-cols-3">
          <div><p className="eyebrow text-ink/60">What it is</p><p className="mt-4 text-[1.05rem] text-ink/85">Professional football career assessment and advisory: an honest read on level, market fit and the next decision — and, where it helps, structured support through the transfer windows.</p></div>
          <div><p className="eyebrow text-ink/60">What it isn’t</p><p className="mt-4 text-[1.05rem] text-ink/85">A trial seller, an academy, a showcase, a placement agency or representation. We don’t contact clubs about you and we don’t guarantee outcomes.</p></div>
          <div><p className="eyebrow text-ink/60">How it relates to the Agency</p><p className="mt-4 text-[1.05rem] text-ink/85">Concordia Sports Agency is the professional football agency. Its experience informs European Pathway; its representation is separate, selective and never for sale. <Link href="/agency" className="underline underline-offset-4">More</Link></p></div>
        </div>
      </Section>
      <Section tone="ink" label="How we work" className="!py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <h2 className="display d-lg">One framework. Senior review. Every time.</h2>
          <p className="lede text-white/80">Every assessment follows Concordia’s professional assessment framework and receives senior review, led by FIFA Licensed Football Agent Marks Amosejevs. The service is built by a team so that the standard doesn’t depend on one person’s calendar.</p>
        </div>
      </Section>
      <Section id="team" tone="paper" label="The team" className="!pt-10">
        <div className="wrap">
          <Kicker>The team</Kicker>
          <h2 className="display d-xl">The people behind the assessment.</h2>
          <p className="lede mt-5 max-w-2xl text-ink/75">A professional team, led by a FIFA Licensed Football Agent, working inside European football.</p>
          <div className="mt-14"><TeamGrid variant="full" tone="paper" /></div>
          <p className="mono mt-10 text-[0.72rem] text-ink/55">Further analysts and advisers will be introduced here as the team grows.</p>
        </div>
      </Section>
      <Section tone="ink" label="Inside European football">
        <div className="wrap">
          <Kicker>Inside European football</Kicker>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6"><h2 className="display d-lg max-w-[16ch]">Moments from a career spent inside the game.</h2><Link href="/about/inside-football" className="mono text-[0.75rem] uppercase tracking-[0.1em] underline">Full archive →</Link></div>
          <InsideFootballStrip />
          <p className="mt-6 max-w-2xl text-[0.85rem] text-slate-light">Photographs document presence in the professional football environment. They do not imply partnership, endorsement or a client relationship with anyone pictured.</p>
        </div>
      </Section>
      <Section tone="paper" label="Company" className="!py-14">
        <div className="wrap text-ink/80"><p className="font-semibold text-ink">{LEGAL_ENTITY.name}</p><p>Reg. No. {LEGAL_ENTITY.registrationNo} · VAT {LEGAL_ENTITY.vatNo} · {LEGAL_ENTITY.address.join(", ")}</p><p className="mt-2">{LEGAL_ENTITY.note}</p></div>
      </Section>
      <FinalCta />
    </>
  );
}
