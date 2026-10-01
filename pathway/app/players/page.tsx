import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { agencyPlayers } from "@/content/agency-players";
import { FinalCta } from "@/components/sections/HomeSections";

export const metadata: Metadata = { title: "Players represented by Concordia Sports Agency" };

export default function PlayersRoster() {
  return (
    <>
      <PageHero eyebrow="Concordia Sports Agency" title="Players represented by Concordia Sports Agency." lede="From established internationals to young players starting out. Their experience informs how we think about football careers." />
      <Section tone="ink" label="Roster" className="!pt-6">
        <div className="wrap">
          <p className="mb-12 max-w-3xl border-l-2 border-route pl-5 text-white/85">These players are represented by Concordia Sports Agency. They did not necessarily take part in European Pathway, and buying a Pathway product does not make you a represented player.</p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">{agencyPlayers.map((p) => <PlayerCard key={p.slug} p={p} />)}</div>
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
