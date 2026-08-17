"use client";

import { useMemo, useState, type ReactNode } from "react";
import { players, positionFilters, type PositionGroup } from "@/data/players";
import PlayerCard from "./PlayerCard";
import PlayerProfile from "./PlayerProfile";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import { cn } from "@/lib/utils";

export default function PlayerRoster({
  playerPhotos,
}: {
  playerPhotos: Record<string, ReactNode>;
}) {
  const [filter, setFilter] = useState<PositionGroup | "All">("All");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const roster = players.filter((p) => p.active);
  const filtered = useMemo(
    () => (filter === "All" ? roster : roster.filter((p) => p.positionGroup === filter)),
    [filter, roster],
  );
  const selectedPlayer = players.find((p) => p.slug === openSlug) ?? null;

  return (
    <section id="roster" className="bg-paper px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionLabel index="03" label="Our Roster" className="text-grey-500" />
            <h2 className="mt-4 text-[clamp(2.4rem,6vw,5rem)] font-bold uppercase leading-[0.94] tracking-[-0.02em]">
              The people
              <br />
              we represent.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {positionFilters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "border px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors",
                    filter === f.value
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-grey-500 hover:border-ink hover:text-ink",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px bg-line sm:mt-16 sm:grid-cols-2 sm:gap-px lg:grid-cols-3">
          {filtered.map((player, i) => (
            <Reveal key={player.id} delay={Math.min(i * 0.06, 0.3)} className="bg-paper">
              <PlayerCard player={player} photo={playerPhotos[player.slug]} onOpen={setOpenSlug} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.15em] text-grey-500">
            No players in this category yet.
          </p>
        )}
      </div>

      <PlayerProfile
        player={selectedPlayer}
        photo={selectedPlayer ? playerPhotos[selectedPlayer.slug] : null}
        onClose={() => setOpenSlug(null)}
      />
    </section>
  );
}
