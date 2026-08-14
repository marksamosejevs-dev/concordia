"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Player } from "@/data/players";
import { getAge } from "@/data/players";

export default function PlayerProfile({
  player,
  photo,
  onClose,
}: {
  player: Player | null;
  photo: ReactNode;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!player) return;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [player, onClose]);

  const age = getAge(player?.dateOfBirth);

  const facts: { label: string; value: string }[] = player
    ? [
        ...(player.nationality ? [{ label: "Nationality", value: player.nationality }] : []),
        { label: "Position", value: player.positionLabel },
        ...(age ? [{ label: "Age", value: String(age) }] : []),
        ...(player.club ? [{ label: "Club", value: player.club }] : []),
        ...(player.height ? [{ label: "Height", value: player.height }] : []),
        ...(player.preferredFoot ? [{ label: "Preferred Foot", value: player.preferredFoot }] : []),
        ...(player.marketValue ? [{ label: "Market Value", value: player.marketValue }] : []),
        ...(player.nationalTeam ? [{ label: "International Status", value: player.nationalTeam }] : []),
      ]
    : [];

  return (
    <AnimatePresence>
      {player && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${player.fullName} profile`}
          className="fixed inset-0 z-[60] flex items-stretch bg-ink/95 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label="Close profile"
            className="absolute inset-0 cursor-default"
            onClick={onClose}
            tabIndex={-1}
          />

          <motion.div
            ref={dialogRef}
            initial={{ y: "3%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "3%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 m-auto grid max-h-[92vh] w-full max-w-5xl grid-cols-1 overflow-y-auto bg-paper text-ink lg:grid-cols-12"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border border-ink bg-paper font-mono text-lg leading-none"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="relative order-1 aspect-[4/5] lg:col-span-5 lg:aspect-auto">{photo}</div>

            <div className="order-2 flex flex-col justify-center px-6 py-12 sm:px-10 lg:col-span-7 lg:px-14">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-grey-500">
                {player.nationalTeam ?? player.nationality ?? "Concordia Sports Agency"}
              </p>
              <h2 className="mt-4 text-[clamp(2.2rem,5vw,3.75rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em]">
                {player.firstName}
                <br />
                {player.lastName}
              </h2>

              {facts.length > 0 ? (
                <dl className="mt-10 divide-y divide-line border-y border-line">
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex items-baseline justify-between gap-4 py-4 font-mono text-xs uppercase tracking-[0.15em]">
                      <dt className="text-grey-500">{fact.label}</dt>
                      <dd className="text-right">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-10 border-y border-line py-6 font-mono text-xs uppercase tracking-[0.15em] text-grey-500">
                  Full profile in preparation.
                </p>
              )}

              {player.transfermarktUrl && (
                <a
                  href={player.transfermarktUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] underline underline-offset-4"
                >
                  View Transfermarkt Profile ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
