import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta } from "@/components/ui/Cta";
import { NotRepresentation, FinalCta } from "@/components/sections/HomeSections";

export const metadata: Metadata = { alternates: { canonical: "/representation" }, description: "How representation by Concordia Sports Agency works: separate from European Pathway, selective, and never for sale.", title: "European Pathway is not representation" };

const BLOCKS = [
  ["What representation is", "Football Agent Services: communicating with clubs on a specific player’s behalf, negotiating, and concluding transfers and employment contracts. Provided only by Concordia Sports Agency, under a separate representation agreement."],
  ["What European Pathway is", "Career assessment and advisory to the player: level, markets, timing, profile, opportunity vetting and decision support. It never involves contacting clubs about you."],
  ["Why we keep them apart", "Independence. Because we’re paid for advice — not for placing you — we can tell you not to go. Keeping advisory and representation separate also keeps us on the right side of the rules that govern agents."],
  ["How the Agency selects", "Realistic level for paid football in a market the Agency knows, availability, professionalism and capacity. Nothing you buy changes that."],
  ["Agency players on this site", "Players presented as represented by Concordia Sports Agency are shown as Agency credibility. They did not necessarily take part in European Pathway, and buying a Pathway service does not make a player a represented player."],
  ["If a player is selected", "A separate representation agreement is required. European Pathway ends and the subscription is cancelled; any amount already paid for the period after it ends is refunded."],
];

export default function RepresentationPage() {
  return (
    <>
      <PageHero eyebrow="Representation" title={<>Separate. Selective. <span className="text-route">Never for sale.</span></>} lede="European Pathway is not representation. Buying an assessment or European Pathway does not make a player a represented player of Concordia Sports Agency." />
      <Section tone="paper" label="Details">
        <div className="wrap"><Kicker>How it works</Kicker>
          <dl className="divide-y divide-ink/10 border-y border-ink/10">{BLOCKS.map(([t, b]) => <div key={t} className="grid gap-3 py-7 md:grid-cols-[0.8fr_1.2fr]"><dt className="display text-[1.8rem] leading-none">{t}</dt><dd className="text-[1.05rem] text-ink/80">{b}</dd></div>)}</dl>
          <p className="mt-8 font-semibold">Paying for any Pathway service does not increase any player’s right, entitlement or chance to be represented.</p>
        </div>
      </Section>
      <NotRepresentation />
      <Section tone="ink" label="Apply" className="!py-20"><div className="wrap flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end"><h2 className="display d-lg max-w-[18ch]">Start with an assessment — which is not representation.</h2><ApplyCta /></div></Section>
      <FinalCta />
    </>
  );
}
