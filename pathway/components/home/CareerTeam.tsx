"use client";
import { useState } from "react";
import { PILLARS } from "@/content/pathway";

/** What your career team does — eight tactile tiles; hover (desktop) or tap (mobile) reveals the detail. */
export function CareerTeam() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="grid grid-cols-2 border-l border-t border-ink/15 lg:grid-cols-4">
      {PILLARS.map((p) => {
        const active = open === p.key;
        return (
          <li key={p.key} className="tile border-b border-r border-ink/15" data-active={active}>
            <button onClick={() => setOpen(active ? null : p.key)} aria-expanded={active} className="flex h-full min-h-[118px] w-full flex-col items-start p-4 text-left sm:min-h-[200px] sm:p-6">
                            <span className="display mt-auto block pt-4 text-[clamp(1.3rem,2.2vw,2rem)] leading-[0.95]">{p.name}</span>
              <span className={`tile-muted mt-2 block text-[0.85rem] leading-snug text-ink/65 ${active ? "" : "hidden sm:block"}`}>{p.line}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
