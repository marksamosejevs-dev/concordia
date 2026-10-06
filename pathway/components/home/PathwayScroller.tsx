"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { MONTH_STATES, PILLARS, PATHWAY_TERMS } from "@/content/pathway";
import { CTA } from "@/content/site";
import { usd } from "@/lib/format";

const pillar = (k: string) => PILLARS.find((p) => p.key === k)!.name;

/**
 * SIGNATURE — "Your career, month by month".
 * Month 1–6 are OPTIONAL tabs (Month 1 selected by default): the visitor can inspect any month directly or
 * simply scroll past. No pinning, no scroll-driven or automatic month changes — page scrolling is never affected.
 */
export function PathwayScroller({ price }: { price: number }) {
  const [m, setM] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, n: number) => {
    const last = MONTH_STATES.length - 1;
    const to = e.key === "ArrowRight" ? (n === last ? 0 : n + 1) : e.key === "ArrowLeft" ? (n === 0 ? last : n - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (to < 0) return;
    e.preventDefault(); setM(to); tabs.current[to]?.focus();
  };
  const s = MONTH_STATES[m];

  return (
    <section className="on-route relative" aria-labelledby="pathway-title" data-hide-sticky>
      <div>
        <div className="py-[clamp(4rem,9vw,6rem)]">
          <div className="wrap grid w-full items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            {/* Offer */}
            <div>
              <h2 id="pathway-title" className="display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.92]">Then build your pathway.</h2>
              <div className="mt-6 flex items-end gap-3">
                <p className="display text-[clamp(5rem,11vw,8.8rem)] leading-[0.78]">{usd(price)}</p>
                <p className="pb-1 text-[1.1rem] font-bold leading-tight">per<br />month</p>
              </div>
              <p className="mt-4 text-[1.25rem] font-bold">6-month European Pathway</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {PATHWAY_TERMS.points.map((p) => <li key={p} className="rounded-full bg-ink px-3.5 py-1.5 text-[0.85rem] font-semibold text-white">{p}</li>)}
              </ul>
              {/* Pay-as-you-go strip */}
              <div className="mt-6" aria-label="Payment, one month at a time">
                <div role="tablist" aria-label="Pathway months" className="-mx-1 flex snap-x gap-1 overflow-x-auto px-1 pb-1 pt-1.5 [scrollbar-width:none] sm:grid sm:grid-cols-6 sm:overflow-visible">
                  {MONTH_STATES.map((x, n) => (
                    <button key={x.m} ref={(el) => { tabs.current[n] = el; }} type="button" role="tab" id={`pathway-tab-${n}`} aria-controls="pathway-panel" aria-selected={n === m} tabIndex={n === m ? 0 : -1}
                      onClick={() => setM(n)} onKeyDown={(e) => onKey(e, n)}
                      className={`min-w-[4.6rem] shrink-0 snap-start rounded-[6px] px-1.5 py-2 text-left transition-[background-color,color,transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:min-w-0 ${n === m ? "-translate-y-1 bg-ink text-white shadow-lg" : "bg-white/45 text-ink/70 hover:-translate-y-0.5 hover:bg-white/80 hover:text-ink"}`}>
                      <span className="block text-[0.62rem] font-semibold">Month {x.m}</span>
                      <span className="display block text-[1.05rem] leading-none">{usd(price)}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[0.82rem] text-ink/75">You pay for one month at a time — never six months upfront. <Link href={PATHWAY_TERMS.termsHref} className="underline underline-offset-2">{PATHWAY_TERMS.footnote}</Link></p>
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/european-pathway" className="btn btn-ink" data-magnetic>{CTA.pathway} <span className="arrow" aria-hidden>→</span></Link>
                <Link href="/apply" className="btn btn-ghost">Start with the assessment</Link>
              </div>
            </div>

            {/* Player board */}
            <div className="on-ink relative overflow-hidden rounded-[16px] border border-ink/20 shadow-[0_50px_100px_-30px_rgba(8,17,39,0.6)]" role="tabpanel" id="pathway-panel" aria-labelledby={`pathway-tab-${m}`}>
              <div className="flex items-center justify-between border-b border-white/10 bg-ink-deep px-5 py-3">
                <p className="text-[0.8rem] text-white/60">Your pathway · sample player</p>
                <p className="text-[0.8rem] font-semibold">Month <span className="text-route">{s.m}</span> of 6</p>
              </div>
              <div className="grid gap-px bg-white/10 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col items-center justify-center bg-ink p-6">
                  <Ring value={s.done} />
                  <p key={s.t} className="display word-in mt-4 text-[2rem] leading-none">{s.t}</p>
                  <p key={s.note} className="word-in mt-2 max-w-[22ch] text-center text-[0.85rem] text-white/70">{s.note}</p>
                </div>
                <div className="bg-ink p-5">
                  <p className="text-[0.72rem] text-white/50">Current level</p>
                  <p key={s.level} className="display word-in mt-1 text-[1.6rem] leading-none">{s.level}</p>
                  <p className="mt-5 text-[0.72rem] text-white/50">Market shortlist</p>
                  <ul className="mt-2 space-y-1.5">
                    {s.markets.map((x) => (
                      <li key={x.c} className="grid grid-cols-[5rem_1fr_2rem] items-center gap-2 text-[0.82rem]">
                        <span className="font-semibold">{x.c}</span>
                        <span className="h-1.5 rounded-full bg-white/10"><span className="block h-full rounded-full bg-route transition-[width] duration-700" style={{ width: `${x.fit}%` }} /></span>
                        <span className="text-right text-[0.7rem] text-white/60">{x.fit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="grid gap-px bg-white/10 sm:grid-cols-2">
                <div className="bg-ink p-5">
                  <p className="text-[0.72rem] text-white/50">Your career team this month</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{s.focus.map((f) => <span key={f} className="word-in rounded-full bg-route px-3 py-1 text-[0.78rem] font-semibold text-ink">{pillar(f)}</span>)}</div>
                </div>
                <div className="bg-ink p-5">
                  <p className="text-[0.72rem] text-white/50">Ready</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{s.ready.map((r, n) => <span key={r} className={`rounded-full border px-2.5 py-0.5 text-[0.72rem] ${n === s.ready.length - 1 ? "border-route text-route" : "border-white/20 text-white/75"}`}>✓ {r}</span>)}</div>
                </div>
              </div>
              <p className="bg-ink-deep px-5 py-2.5 text-[0.65rem] text-white/45">Illustrative · fictional player · your plan follows your assessment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ring({ value }: { value: number }) {
  const C = 2 * Math.PI * 52;
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="#FFD23F" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - value / 100)} style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.22,.7,.2,1)" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><p className="display text-[2.6rem] leading-none">{value}%</p><p className="text-[0.62rem] text-white/55">market-ready profile</p></div>
      </div>
    </div>
  );
}
