"use client";
import { useEffect, useRef, useState } from "react";
import { DASHBOARD as D, MONTHS } from "@/content/pathway";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Product mockup — what ongoing career management looks like month to month.
 * Fictional player, illustrative data. Animates once when scrolled into view.
 */
export function CareerDashboard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [seen, setSeen] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!seen || reduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % D.actions.length), 2600);
    return () => clearInterval(id);
  }, [seen, reduced]);
  const on = seen || reduced;

  return (
    <div ref={ref} className={`relative ${className}`} aria-label="Illustration: a sample European Pathway career dashboard (fictional player)" role="img">
      <div className="on-ink relative overflow-hidden rounded-[14px] border border-white/10 shadow-[0_50px_100px_-30px_rgba(8,17,39,0.65)]">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-white/10 bg-ink-deep px-4 py-3">
          <div className="flex items-center gap-1.5" aria-hidden><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /></div>
          <span className="mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-light">Your pathway · {D.player}</span>
          <span className="mono rounded-full bg-route px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-ink">Live</span>
        </div>

        <div className="grid gap-px bg-white/10 sm:grid-cols-2">
          {/* month progress */}
          <div className="bg-ink p-4 sm:col-span-2">
            <div className="flex items-baseline justify-between">
              <p className="mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-light">Pathway progress</p>
              <p className="display text-[1.05rem] leading-none">Month <span className="text-route">{D.month}</span> of 6</p>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-1">
              {MONTHS.map((m, i) => (
                <div key={m.m}>
                  <div className={`h-1.5 ${i < D.month ? "bg-route" : "bg-white/12"} ${i < D.month ? (on ? "bar-grow" : "scale-x-0") : ""}`} style={{ animationDelay: `${i * 120}ms` }} />
                  <p className={`mono mt-1.5 truncate text-[0.55rem] uppercase tracking-[0.06em] ${i === D.month - 1 ? "text-white" : "text-slate"}`}>{m.t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* level */}
          <div className="bg-ink p-4">
            <p className="mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-light">{D.level.label}</p>
            <p className="display mt-2 text-[1.5rem] leading-none">{D.level.value}</p>
            <p className="mono mt-3 text-[0.6rem] uppercase tracking-[0.12em] text-slate-light">Player positioning</p>
            <div className="mt-1.5 h-1.5 bg-white/12"><div className={`h-full bg-white ${on ? "bar-grow" : "scale-x-0"}`} style={{ width: `${D.positioning}%` }} /></div>
          </div>

          {/* target markets */}
          <div className="bg-ink p-4">
            <p className="mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-light">Target markets · league fit</p>
            <ul className="mt-2.5 space-y-2">
              {D.markets.map((m, i) => (
                <li key={m.c} className="grid grid-cols-[4.6rem_1fr_2rem] items-center gap-2 text-[0.78rem]">
                  <span className="font-semibold">{m.c}</span>
                  <span className="h-1.5 bg-white/12"><span className={`block h-full bg-route ${on ? "bar-grow" : "scale-x-0"}`} style={{ width: `${m.fit}%`, animationDelay: `${300 + i * 150}ms` }} /></span>
                  <span className="mono text-right text-[0.65rem] text-slate-light">{m.fit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* strengths / priorities */}
          <div className="bg-ink p-4">
            <p className="mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-light">Strengths</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{D.strengths.map((s) => <span key={s} className="rounded-full border border-white/20 px-2.5 py-1 text-[0.7rem]">{s}</span>)}</div>
            <p className="mono mt-3 text-[0.6rem] uppercase tracking-[0.14em] text-slate-light">Development priorities</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{D.priorities.map((s) => <span key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem]">{s}</span>)}</div>
          </div>

          {/* next window + actions */}
          <div className="bg-ink p-4">
            <div className="flex items-baseline justify-between">
              <p className="mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-light">Next window</p>
              <p className="text-[0.75rem] font-semibold text-route">{D.nextWindow}</p>
            </div>
            <p className="mono mt-3 text-[0.6rem] uppercase tracking-[0.14em] text-slate-light">Next actions</p>
            <ul className="mt-2 space-y-1.5">
              {D.actions.map((a, i) => (
                <li key={a} className={`flex items-center gap-2 text-[0.75rem] transition-colors duration-500 ${i === tick ? "text-white" : "text-white/55"}`}>
                  <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[3px] border transition-colors duration-500 ${i < tick ? "border-route bg-route text-ink" : i === tick ? "border-route" : "border-white/25"}`} aria-hidden>{i < tick && <svg viewBox="0 0 10 10" className="h-2 w-2"><path d="M1.5 5.2 4 7.5 8.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>}</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="mono mt-3 text-[0.6rem] uppercase tracking-[0.12em] opacity-70">Illustrative dashboard · fictional player</p>
    </div>
  );
}
