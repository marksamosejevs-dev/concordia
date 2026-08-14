"use client";

import type { ReactNode } from "react";
import type { Player } from "@/data/players";
import { getAge } from "@/data/players";
import AnimatedArrow from "./AnimatedArrow";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

export default function FeaturedPlayer({
  player,
  photo,
  onOpen,
}: {
  player: Player;
  photo: ReactNode;
  onOpen: (slug: string) => void;
}) {
  const age = getAge(player.dateOfBirth);

  const facts: { label: string; value: string }[] = [
    { label: "Position", value: player.positionLabel },
    ...(player.nationality ? [{ label: "Nationality", value: player.nationality }] : []),
    ...(age ? [{ label: "Age", value: String(age) }] : []),
    ...(player.club ? [{ label: "Club", value: player.club }] : []),
    ...(player.marketValue ? [{ label: "Market Value", value: player.marketValue }] : []),
  ];

  return (
    <div className="grid grid-cols-1 border border-line lg:grid-cols-12">
      <div className="relative order-1 aspect-[4/5] lg:col-span-7 lg:aspect-auto">{photo}</div>

      <div className="order-2 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:col-span-5 lg:px-12">
        <Reveal>
          <SectionLabel label="Featured Player" className="text-grey-500" />
        </Reveal>

        <Reveal delay={0.08}>
          <h3 className="mt-6 text-[clamp(2.4rem,5.5vw,4.25rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em]">
            {player.firstName}
            <br />
            {player.lastName}
          </h3>
        </Reveal>

        <Reveal delay={0.16}>
          <dl className="mt-10 space-y-5 border-t border-line pt-8">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4 font-mono text-xs uppercase tracking-[0.15em]">
                <dt className="text-grey-500">{fact.label}</dt>
                <dd className="text-right text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.24}>
          <button
            type="button"
            onClick={() => onOpen(player.slug)}
            className="group mt-10 inline-flex items-center gap-3 border-b border-ink pb-1.5 font-mono text-sm uppercase tracking-[0.15em] transition-opacity hover:opacity-60"
          >
            View Profile
            <AnimatedArrow />
          </button>
        </Reveal>
      </div>
    </div>
  );
}
