"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { EuropeDots } from "@/components/route/EuropeDots";
import { track } from "@/lib/analytics";

/**
 * SIGNATURE — "Where in Europe do you fit?"
 * The visitor changes the player; the shortlist re-ranks (rows glide to new positions) and the
 * dot-matrix map re-lights the top markets with a route to the best fit.
 * Scores are an ILLUSTRATIVE model, clearly labelled — real direction comes only from the assessment.
 */
const MARKETS = [
  { iso: "PL", name: "Poland" }, { iso: "CZ", name: "Czechia" }, { iso: "SE", name: "Sweden" }, { iso: "PT", name: "Portugal" },
  { iso: "DK", name: "Denmark" }, { iso: "LV", name: "Latvia" }, { iso: "BE", name: "Belgium" }, { iso: "NO", name: "Norway" },
] as const;
type Iso = (typeof MARKETS)[number]["iso"];

const LEVELS = ["College", "Semi-pro", "Pro-ready"] as const;
const POSITIONS = ["Defender", "Midfielder", "Forward"] as const;
const PASSPORTS = ["US passport", "EU passport"] as const;

const BASE: Record<(typeof LEVELS)[number], Record<Iso, number>> = {
  College: { PL: 58, CZ: 56, SE: 60, PT: 48, DK: 50, LV: 66, BE: 44, NO: 55 },
  "Semi-pro": { PL: 68, CZ: 65, SE: 64, PT: 58, DK: 60, LV: 70, BE: 54, NO: 62 },
  "Pro-ready": { PL: 76, CZ: 72, SE: 68, PT: 70, DK: 71, LV: 64, BE: 69, NO: 67 },
};
const POS: Record<(typeof POSITIONS)[number], Partial<Record<Iso, number>>> = {
  Defender: { SE: 5, NO: 5, DK: 3, PL: 2 },
  Midfielder: { CZ: 4, PT: 4, BE: 3, PL: 3 },
  Forward: { PT: 5, BE: 5, LV: 3, PL: 2 },
};
const EU_BOOST: Partial<Record<Iso, number>> = { PT: 9, BE: 9, DK: 8, SE: 5, NO: 3, CZ: 4, PL: 3 };
const TIER = (score: number) => (score >= 75 ? "2nd tier" : score >= 64 ? "2nd–3rd tier" : "3rd tier");

function Seg<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div>
      <p className="mb-2 text-[0.85rem] font-semibold text-white/70">{label}</p>
      <div role="radiogroup" aria-label={label} className="relative grid rounded-full bg-white/10 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        <span className="absolute inset-y-1 rounded-full bg-route transition-transform duration-500 ease-[cubic-bezier(.22,.7,.2,1)]" style={{ width: `calc((100% - 0.5rem) / ${options.length})`, left: "0.25rem", transform: `translateX(${options.indexOf(value) * 100}%)` }} aria-hidden />
        {options.map((o) => (
          <button key={o} role="radio" aria-checked={o === value} onClick={() => onChange(o)} className={`relative z-[1] rounded-full px-2 py-2 text-[0.85rem] font-bold transition-colors duration-300 ${o === value ? "text-ink" : "text-white/80 hover:text-white"}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}

export function MarketMatch() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("College");
  const [pos, setPos] = useState<(typeof POSITIONS)[number]>("Midfielder");
  const [pass, setPass] = useState<(typeof PASSPORTS)[number]>("US passport");
  const ranked = useMemo(() => MARKETS.map((m) => {
    const score = Math.min(92, BASE[level][m.iso] + (POS[pos][m.iso] ?? 0) + (pass === "EU passport" ? EU_BOOST[m.iso] ?? 0 : 0));
    return { ...m, score };
  }).sort((a, b) => b.score - a.score), [level, pos, pass]);
  const rank = Object.fromEntries(ranked.map((m, i) => [m.iso, i]));
  const top = ranked.slice(0, 3);
  const change = <T,>(set: (v: T) => void, key: string) => (v: T) => { set(v); track("market_match", { [key]: String(v) }); };
  const ROW = 46;

  return (
    <section className="on-deep relative overflow-hidden py-[clamp(4.5rem,10vw,7.5rem)]" aria-labelledby="match-title">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 id="match-title" className="display text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.9]">Where in Europe <span className="text-route">do you fit?</span></h2>
          <p className="lede mt-5 max-w-md text-white/80">Europe isn’t one market. Change the player — watch the map move.</p>
          <div className="mt-8 space-y-5">
            <Seg label="Level today" options={LEVELS} value={level} onChange={change(setLevel, "level")} />
            <Seg label="Position" options={POSITIONS} value={pos} onChange={change(setPos, "position")} />
            <Seg label="Passport" options={PASSPORTS} value={pass} onChange={change(setPass, "passport")} />
          </div>
          <p className="mt-6 text-[0.8rem] text-white/50">An illustrative model, not advice. Your assessment looks at your full match, your passports and your timing — and names real markets and league levels.</p>
          <Link href="/apply" className="btn btn-route mt-6" data-magnetic>Get your real market fit <span className="arrow" aria-hidden>→</span></Link>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[18px] border border-white/10 bg-ink sm:min-h-[520px]">
          <EuropeDots className="absolute inset-0 h-full w-full" highlight={top.map((t) => t.iso)} target={top[0].iso} align={0.75} zoom={1.25} />
          <div className="absolute bottom-3 left-3 w-[min(300px,calc(100%-1.5rem))] rounded-[12px] border border-white/15 bg-ink/85 p-4 backdrop-blur-md">
            <div className="flex items-baseline justify-between"><p className="text-[0.8rem] text-white/60">Market fit</p><p className="text-[0.7rem] text-white/40">Illustrative</p></div>
            <div className="relative mt-2" style={{ height: ROW * 5 }}>
              {ranked.map((m) => {
                const r = rank[m.iso];
                return (
                  <div key={m.iso} className="absolute inset-x-0 grid grid-cols-[1.6rem_1fr_auto] items-center gap-2 transition-all duration-700 ease-[cubic-bezier(.22,.7,.2,1)]" style={{ transform: `translateY(${r * ROW}px)`, opacity: r < 5 ? 1 : 0, height: ROW - 6 }}>
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-[0.72rem] font-bold ${r === 0 ? "bg-route text-ink" : "bg-white/10"}`}>{r + 1}</span>
                    <div>
                      <p className="text-[0.92rem] font-bold leading-tight">{m.name}</p>
                      <div className="mt-1 h-1 rounded-full bg-white/10"><div className="h-full rounded-full bg-route transition-[width] duration-700" style={{ width: `${m.score}%` }} /></div>
                    </div>
                    <span className="text-right text-[0.7rem] leading-tight text-white/65">{m.score}<br /><span className="text-white/40">{TIER(m.score)}</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
