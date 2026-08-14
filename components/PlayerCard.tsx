"use client";

import type { ReactNode } from "react";
import type { Player } from "@/data/players";
import { getAge } from "@/data/players";
import AnimatedArrow from "./AnimatedArrow";
import { cn } from "@/lib/utils";

export default function PlayerCard({
  player,
  photo,
  onOpen,
}: {
  player: Player;
  photo: ReactNode;
  onOpen: (slug: string) => void;
}) {
  const age = getAge(player.dateOfBirth);
  const hasDetails = Boolean(player.club || age || player.nationality);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(player.slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(player.slug);
        }
      }}
      className="group relative flex cursor-pointer flex-col border border-line transition-colors duration-500 hover:bg-ink focus-visible:bg-ink"
      aria-label={`View ${player.fullName}'s profile`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">{photo}</div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-grey-500 transition-colors duration-500 group-hover:text-paper/50">
            {player.positionLabel}
          </p>
          <h3 className="mt-2 text-[clamp(1.4rem,2.4vw,2rem)] font-bold uppercase leading-[0.95] tracking-tight transition-all duration-500 group-hover:translate-x-1 group-hover:text-paper">
            {player.firstName}
            <br />
            {player.lastName}
          </h3>
        </div>

        {hasDetails ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-4 font-mono text-xs transition-colors duration-500 group-hover:border-line-invert">
            {player.nationality && (
              <div>
                <p className="text-grey-400 transition-colors duration-500 group-hover:text-paper/40">
                  Nationality
                </p>
                <p className="mt-1 uppercase transition-colors duration-500 group-hover:text-paper">
                  {player.nationality}
                </p>
              </div>
            )}
            {age && (
              <div>
                <p className="text-grey-400 transition-colors duration-500 group-hover:text-paper/40">Age</p>
                <p className="mt-1 transition-colors duration-500 group-hover:text-paper">{age}</p>
              </div>
            )}
            {player.club && (
              <div className="col-span-2">
                <p className="text-grey-400 transition-colors duration-500 group-hover:text-paper/40">
                  Current Club
                </p>
                <p className="mt-1 uppercase transition-colors duration-500 group-hover:text-paper">
                  {player.club}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 border-t border-line pt-4 font-mono text-xs text-grey-400 transition-colors duration-500 group-hover:border-line-invert group-hover:text-paper/50">
            Profile in preparation
          </div>
        )}

        <div
          className={cn(
            "mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-500 group-hover:text-paper",
          )}
        >
          View Profile <AnimatedArrow />
        </div>
      </div>
    </div>
  );
}
