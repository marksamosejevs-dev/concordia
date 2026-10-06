"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PARENT_QUESTIONS, PLAYER_QUESTIONS } from "@/content/pathway";
import { useAudience } from "@/components/layout/Audience";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Emotional section: the questions families ask, floating around a photograph, landing on one message. */
export function ParentsPlayers({ photo }: { photo: React.ReactNode }) {
  const { audience, setAudience } = useAudience();
  const parent = audience === "parent";
  const qs = parent ? PARENT_QUESTIONS : PLAYER_QUESTIONS;
  const reduced = usePrefersReducedMotion();
  const [hi, setHi] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setHi((h) => (h + 1) % qs.length), 1800);
    return () => clearInterval(id);
  }, [reduced, qs.length]);
  // Desktop positions around the photo (percentages of the stage).
  const spots = [[2, 6], [52, 2], [60, 30], [4, 40], [48, 58], [8, 74], [56, 86]];

  return (
    <section className="on-paper relative overflow-hidden py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="pp-title">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Stage: photo + floating questions */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full max-w-[560px] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">{photo}<div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" aria-hidden /></div>
          <ul className="absolute inset-0 hidden lg:block" aria-hidden>
            {qs.map((q, n) => (
              <li key={q} className="float-q absolute" style={{ left: `${spots[n][0]}%`, top: `${spots[n][1]}%`, animationDelay: `${n * 0.6}s` }}>
                <span className={`display block whitespace-nowrap px-3.5 py-2 text-[1.15rem] leading-none shadow-lg transition-colors duration-500 ${n === hi ? "bg-route text-ink" : "bg-white text-ink"}`}>{q}</span>
              </li>
            ))}
          </ul>
          {/* Mobile: questions as a cycling stack over the photo */}
          <div className="absolute inset-x-4 bottom-[4.5rem] lg:hidden" aria-hidden>
            {qs.map((q, n) => <span key={q} className={`display absolute bottom-0 left-0 bg-route px-3.5 py-2 text-[1.35rem] leading-none text-ink transition-all duration-500 ${n === hi ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>{q}</span>)}
          </div>
        </div>

        <div>
          <div role="radiogroup" aria-label="I am a" className="inline-flex rounded-full border border-ink/20 p-1 text-sm">
            {(["parent", "player"] as const).map((a) => (
              <button key={a} role="radio" aria-checked={audience === a} onClick={() => setAudience(a)} className={`rounded-full px-4 py-2 font-semibold transition-colors ${audience === a ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}>{a === "parent" ? "Parents" : "Players"}</button>
            ))}
          </div>
          <h2 id="pp-title" className="display d-xl mt-8 max-w-[14ch]">
            {parent ? <>You don’t have to figure out your child’s football career <span className="bg-route px-1 box-decoration-clone">alone.</span></> : <>You don’t have to figure out your football career <span className="bg-route px-1 box-decoration-clone">alone.</span></>}
          </h2>
          <p className="lede mt-6 max-w-md text-ink/75">{parent ? "Clear answers, a written plan and a career team you can call — before money and time are spent." : "A clear read on your level, a plan for the window and people in your corner who work in European football."}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={parent ? "/for/parents" : "/for/players"} className="btn btn-ink">{parent ? "The parents’ guide" : "The players’ guide"} <span className="arrow" aria-hidden>→</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
