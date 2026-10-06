"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EuropeDots } from "@/components/route/EuropeDots";
import { Parallax } from "@/components/ui/Parallax";
import { HERO, HERO_PROFILE } from "@/content/hero";
import { CTA } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { ReactNode } from "react";

/**
 * Hero — layered composition: pointer-reactive dot-matrix Europe, oversized drifting "EUROPE",
 * a masked editorial photo, and a floating player-profile UI whose market cycles in sync with the map route.
 */
export function HeroV3({ pricePair }: { pricePair: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((x) => (x + 1) % HERO_PROFILE.markets.length), 2800);
    return () => clearInterval(id);
  }, [reduced]);
  const m = HERO_PROFILE.markets[i];

  return (
    <Parallax as="section" className="on-ink relative isolate overflow-hidden pt-[var(--header-h)]">
      {/* Dot-matrix Europe */}
      <div className="absolute inset-0 -z-10 lg:left-[12%] lg:right-[14%]" style={{ transform: "translate3d(calc(var(--px) * -10px), calc(var(--sp) * 80px), 0)" }}>
        <EuropeDots className="h-full w-full" highlight={HERO_PROFILE.markets.map((x) => x.iso)} target={m.iso} align={0.1} zoom={1.12} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_15%_60%,#0D1B36_35%,transparent_75%)] lg:bg-[radial-gradient(34%_62%_at_16%_52%,#0D1B36_40%,transparent_78%)]" aria-hidden />

      {/* Oversized drifting word */}
      <p className="display pointer-events-none absolute -bottom-[0.12em] left-0 -z-10 select-none whitespace-nowrap text-[clamp(9rem,30vw,30rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.13)]" style={{ transform: "translate3d(calc(var(--sp) * -22vw + var(--px) * 12px), 0, 0)" }} aria-hidden>EUROPE · EUROPE</p>

      <div className="wrap relative grid gap-10 pb-14 pt-8 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-20 lg:pt-0">
        <div className="relative z-10">
          <h1 className="display max-w-[15ch] text-[clamp(2.8rem,5.8vw,6.3rem)] leading-[0.9]">Think you can play in Europe? <span className="text-route">Ask people who work in it.</span></h1>
          <p className="lede mt-6 max-w-lg text-white/85">An honest assessment of where you stand. Then a career team that manages your pathway into European football — month by month.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col items-start gap-2">
              <Link href="/apply" className="btn btn-route" data-magnetic data-cta="apply">{CTA.apply} <span className="arrow" aria-hidden>→</span></Link>
              <p className="mono text-[0.7rem] tracking-[0.06em] text-white/70">{CTA.micro}</p>
            </div>
            <Link href="/european-pathway" className="btn btn-ghost" data-magnetic>{CTA.pathway} <span className="arrow" aria-hidden>→</span></Link>
          </div>
          <div className="mt-9 max-w-[560px]">{pricePair}</div>
        </div>

        {/* Stage: masked photo + floating football UI */}
        <div className="relative mx-auto h-[min(118vw,560px)] w-full max-w-[520px] lg:h-[min(76vh,680px)] lg:max-w-none">
          <div className="absolute inset-y-0 right-[6%] w-[74%] overflow-hidden rounded-t-[999px] rounded-b-[18px] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)] lg:right-[-2%] lg:w-[56%]"
            style={{ transform: "translate3d(calc(var(--px) * 14px), calc(var(--sp) * -50px + var(--py) * 10px), 0)" }}>
            <div className="absolute inset-[-6%]" style={{ transform: "translate3d(calc(var(--px) * -18px), calc(var(--sp) * 60px), 0) scale(1.06)" }}>
              <Image src={HERO.photo.src} alt={HERO.photo.alt} fill priority sizes="(min-width:1024px) 36vw, 80vw" className="photo-grade object-cover" style={{ objectPosition: HERO.position }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden />
          </div>
          {/* Yellow route ring behind the frame */}
          <div className="absolute right-[1%] top-[8%] h-[46%] w-[46%] rounded-full border-2 border-route/70 lg:right-0" style={{ transform: "translate3d(calc(var(--px) * -24px), calc(var(--py) * -16px), 0)" }} aria-hidden />

          {/* Floating player profile */}
          <div className="absolute bottom-[8%] left-0 w-[64%] max-w-[300px] rounded-[14px] border border-white/15 bg-ink/80 p-4 shadow-2xl backdrop-blur-md sm:p-5" style={{ transform: "translate3d(calc(var(--px) * 26px), calc(var(--py) * 18px + var(--sp) * -30px), 0)" }} aria-label="Illustrative player profile">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.95rem] font-bold leading-tight">{HERO_PROFILE.title}</p>
                <p className="text-[0.75rem] text-white/60">{HERO_PROFILE.meta}</p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-route text-[0.8rem] font-bold text-route">{m.fit}</span>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3" aria-live="polite">
              <p className="text-[0.7rem] text-white/55">Best market fit right now</p>
              <p key={m.iso} className="display word-in mt-1 text-[1.9rem] leading-none">{m.name}</p>
              <p className="mt-1 text-[0.78rem] text-white/70">{m.level} · fit {m.fit}/100</p>
              <div className="mt-3 grid grid-cols-4 gap-1">{HERO_PROFILE.markets.map((x, n) => <span key={x.iso} className={`h-1 rounded-full transition-colors duration-500 ${n === i ? "bg-route" : "bg-white/15"}`} />)}</div>
            </div>
            <p className="mt-3 text-[0.62rem] text-white/45">Illustrative · fictional player</p>
          </div>

          {/* Floating window chip */}
          <div className="absolute right-0 top-[52%] rounded-full bg-route px-4 py-2 text-[0.8rem] font-bold text-ink shadow-xl lg:right-[-2%]" style={{ transform: "translate3d(calc(var(--px) * -30px), calc(var(--py) * -22px), 0)" }} aria-hidden>
            Next window → planned
          </div>
        </div>
      </div>
    </Parallax>
  );
}
