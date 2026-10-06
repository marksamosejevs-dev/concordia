import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta } from "@/components/ui/Cta";
import { AgencyPlayersRail, NotRepresentation, FinalCta } from "@/components/sections/HomeSections";
import { LEGAL_ENTITY } from "@/content/site";

export const metadata: Metadata = { alternates: { canonical: "/agency/" }, title: "Concordia Sports Agency — the relationship", description: "How Concordia Sports Agency and Concordia Soccer · European Pathway relate — and why they stay separate." };

export default function AgencyPage() {
  return (
    <>
      <PageHero eyebrow="Concordia Sports Agency" title={<>The Agency provides the credibility. <span className="text-route">The Pathway is the advisory product.</span></>}
        lede="Concordia Sports Agency, co-founded by FIFA Licensed Football Agent Marks Amosejevs, represents selected professional and developing players. European Pathway brings that experience to players beyond the roster — as advice, not representation." />
      <Section tone="paper" label="Three layers">
        <div className="wrap">
          <Kicker>How it fits together</Kicker>
          <ol className="grid gap-px bg-ink/15 lg:grid-cols-3">
            {[
              ["Concordia Sports Agency", "Professional football agency", "Selective representation of players under separate representation agreements: club communication, negotiation, transfers and contracts on a represented player’s behalf."],
              ["Concordia Soccer", "Consumer football career brand", "The brand under which players and families can access professional career assessment and advisory."],
              ["European Pathway", "The product family", "Player Pathway Assessment and European Pathway: assessment, structure, review and decision support. Never club outreach, trials or representation."],
            ].map(([t, s, b], i) => (
              <li key={t} className="bg-paper p-7"><span className="mono text-[0.72rem] text-route-deep">0{i + 1}</span><p className="display mt-3 text-[2rem] leading-none">{t}</p><p className="mono mt-2 text-[0.72rem] uppercase tracking-[0.1em] text-ink/60">{s}</p><p className="mt-4 text-ink/80">{b}</p></li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl text-ink/75">Concordia Soccer · European Pathway services are provided by {LEGAL_ENTITY.name} (Reg. No. {LEGAL_ENTITY.registrationNo}). Purchasing a Pathway service does not create a football-agent representation agreement.</p>
        </div>
      </Section>
      <AgencyPlayersRail />
      <NotRepresentation />
      <Section tone="ink" label="Apply" className="!py-20"><div className="wrap flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end"><h2 className="display d-lg max-w-[16ch]">Start with an honest read on where you stand.</h2><ApplyCta /></div></Section>
      <FinalCta />
    </>
  );
}
