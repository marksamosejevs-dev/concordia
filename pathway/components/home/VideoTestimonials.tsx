"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import type { Testimonial } from "@/content/testimonials";
import { track } from "@/lib/analytics";

export interface VideoCard { t: Testimonial; tag?: string }
export interface SlotCard { slot: number }

/**
 * Video testimonial carousel. Every card has a human poster frame; the video file loads only on play.
 * Review-mode slots (no video yet) show a muted editorial image and a clear slot label — never a blank box.
 */
export function VideoTestimonials({ cards, slots }: { cards: VideoCard[]; slots: SlotCard[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const nudge = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * (rail.current.clientWidth * 0.7), behavior: "smooth" });

  return (
    <div>
      <div className="mb-6 hidden justify-end gap-2 sm:flex">
        {[-1, 1].map((d) => <button key={d} onClick={() => nudge(d as 1 | -1)} aria-label={d < 0 ? "Previous testimonials" : "Next testimonials"} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-lg transition-colors hover:border-route hover:bg-route hover:text-ink">{d < 0 ? "←" : "→"}</button>)}
      </div>
      <div ref={rail} className="rail -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 pt-5">
        {cards.map(({ t, tag }) => {
          const on = playing === t.id;
          return (
            <article key={t.id} className={`relative w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[23%] ${tag ? "outline-[1.5px] outline-dashed outline-route/75 outline-offset-4" : ""}`}>
              {tag && <span className="gate-tag absolute -top-3 left-2 z-20">{tag}</span>}
              <div className="group relative aspect-[9/16] overflow-hidden rounded-[10px] bg-ink-soft">
                {on && t.media ? (
                  <video src={t.media.src} poster={t.media.poster} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-cover" aria-label={`Testimonial video — ${t.speaker}`} />
                ) : (
                  <button onClick={() => { setPlaying(t.id); track("testimonial_play", { id: t.id }); }} className="absolute inset-0 text-left" aria-label={`Play testimonial — ${t.speaker}`}>
                    {t.media?.poster && <Image src={t.media.poster} alt="" fill sizes="(min-width:1024px) 23vw, 72vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />}
                    <span className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/10 to-transparent" aria-hidden />
                    <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-route text-ink shadow-xl transition-transform duration-300 group-hover:scale-110" aria-hidden>
                      <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6"><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-4">
                      {t.approvedExcerpt && <span className="display mb-3 block text-[1.35rem] leading-[1.02]">“{t.approvedExcerpt}”</span>}
                      <span className="block text-[1rem] font-bold">{t.speaker}</span>
                      <span className="mono mt-0.5 block text-[0.62rem] uppercase tracking-[0.1em] text-white/75">{t.relationship === "Other" ? t.entity : `${t.relationship} · ${t.entity}`}</span>
                    </span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {slots.map((s) => (
          <article key={s.slot} className="relative w-[72%] shrink-0 snap-start outline-[1.5px] outline-dashed outline-route/60 outline-offset-4 sm:w-[42%] lg:w-[23%]">
            <span className="gate-tag absolute -top-3 left-2 z-20">Slot {s.slot} · video to come · E15</span>
            <div className="relative aspect-[9/16] overflow-hidden rounded-[10px] bg-blue">
              <span className="display absolute left-4 top-2 text-[9rem] leading-none text-route/90" aria-hidden>“</span>
              <svg viewBox="0 0 100 125" className="absolute inset-x-0 bottom-0 h-[62%] w-full opacity-20" aria-hidden preserveAspectRatio="xMidYMax meet"><circle cx="50" cy="42" r="17" fill="#fff" /><path d="M14 125c2-28 17-44 36-44s34 16 36 44z" fill="#fff" /></svg>
              <span className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 to-transparent" aria-hidden />
              <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white/40 text-white/60" aria-hidden><svg viewBox="0 0 24 24" className="ml-1 h-6 w-6"><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg></span>
              <span className="absolute inset-x-0 bottom-0 p-4"><span className="block text-[1rem] font-bold text-white/80">Player or parent testimonial</span><span className="mono mt-0.5 block text-[0.62rem] uppercase tracking-[0.1em] text-white/55">Name · context · short verified quote</span></span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
