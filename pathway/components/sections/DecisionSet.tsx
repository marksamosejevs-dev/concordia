"use client";
import { useEffect, useRef, useState } from "react";
import { decisions } from "@/content/decisions";
import { track } from "@/lib/analytics";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * THE DECISION SET — signature concept.
 * Desktop: pinned; scroll lights one of nine branches leaving the "Your assessment" node.
 * Mobile: vertical Route stem, branches peel left/right, tap to expand; ends in a 3×3 grid.
 */
export function DecisionSet({ intro = true }: { intro?: boolean }) {
  return (
    <section className="on-deep relative" aria-labelledby="decision-title">
      <div className="wrap pt-[clamp(4.5rem,10vw,8rem)]">
        <p className="eyebrow text-slate-light">The Decision Set</p>
        <h2 id="decision-title" className="display d-xl mt-5 max-w-[14ch]">The right football decision is not always <span className="text-route">“go.”</span></h2>
        {intro && <p className="lede mt-6 max-w-2xl text-white/80">Most of the pathway industry gets paid when you book something — a trial, a showcase, a flight. We’re paid for the assessment. That means we can tell you the truth, whatever it is.</p>}
      </div>
      <DesktopBranches />
      <MobileStem />
    </section>
  );
}

function DesktopBranches() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const on = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      setActive(p >= 0.94 ? 9 : Math.floor(p * 9.6) - 0);
    };
    on(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  const all = reduced || active >= 9;
  const node = { x: 230, y: 330 };
  const ends = decisions.map((_, i) => ({ x: 640, y: 50 + i * 70 }));
  const current = decisions[Math.min(Math.max(active, 0), 8)];
  return (
    <div ref={ref} className="relative hidden lg:block" style={{ height: reduced ? "auto" : "300vh" }}>
      <div className={`${reduced ? "" : "sticky top-0"} flex h-screen items-center`}>
        <div className="wrap grid w-full grid-cols-[1fr_0.7fr] items-center gap-12">
          <svg viewBox="0 0 1060 680" className="w-full" role="img" aria-label="The Route reaches your assessment and branches into nine possible decisions">
            <path d="M0 330 H230" stroke="#FFD23F" strokeWidth="3" />
            {ends.map((e, i) => {
              const lit = all || i === active;
              return (
                <g key={i} style={{ transition: "opacity .5s" }} opacity={lit ? 1 : 0.32}>
                  <path d={`M${node.x} ${node.y} C 380 ${node.y}, 450 ${e.y}, ${e.x} ${e.y}`} fill="none" stroke={lit ? "#FFD23F" : "#7D8797"} strokeWidth={lit && !all ? 3 : 1.6} />
                  <circle cx={e.x} cy={e.y} r={lit ? 6 : 4} fill={lit ? "#FFD23F" : "#7D8797"} />
                  <text x={e.x + 22} y={e.y + 13} fill={lit ? "#FFFFFF" : "#7D8797"} style={{ font: "400 38px var(--font-display)", textTransform: "uppercase" }}>{decisions[i].label}</text>
                </g>
              );
            })}
            <circle cx={node.x} cy={node.y} r="16" fill="#FFD23F" />
            <circle cx={node.x} cy={node.y} r="7" fill="#081127" />
            <text x={node.x - 10} y={node.y + 50} fill="#AEB6C4" textAnchor="middle" style={{ font: "500 14px var(--font-mono)", letterSpacing: "0.12em" }}>YOUR ASSESSMENT</text>
          </svg>
          <div aria-live="polite" className="min-h-[220px]">
            {all ? (
              <>
                <p className="display d-md text-route">Nine possible answers.</p>
                <p className="lede mt-5 text-white/85">The assessment exists to find out which one is yours.</p>
              </>
            ) : active >= 0 ? (
              <>
                <p className="mono text-[0.75rem] tracking-[0.14em] text-slate-light">{String(active + 1).padStart(2, "0")} / 09</p>
                <p className="display d-lg mt-3">{current.label}</p>
                <p className="lede mt-4 text-white/85">{current.line}</p>
              </>
            ) : (
              <p className="lede text-white/70">Scroll — the line doesn’t automatically end in Europe.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileStem() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="wrap pb-[clamp(4rem,12vw,6rem)] pt-12 lg:hidden">
      <div className="relative">
        <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-route/80" aria-hidden />
        <div className="relative mx-auto mb-8 flex w-fit flex-col items-center">
          <span className="block h-5 w-5 rounded-full border-[5px] border-route bg-ink-deep" aria-hidden />
          <span className="mono mt-2 bg-ink-deep px-2 text-[0.65rem] tracking-[0.14em] text-slate-light">YOUR ASSESSMENT</span>
        </div>
        <ul className="space-y-5">
          {decisions.map((d, i) => {
            const left = i % 2 === 0;
            const isOpen = open === d.key;
            return (
              <li key={d.key} className={`relative flex ${left ? "justify-start pr-[52%]" : "justify-end pl-[52%]"}`}>
                <span className={`absolute top-6 h-[2px] w-[2%] bg-route/70 ${left ? "left-[48%]" : "left-[50%]"}`} aria-hidden />
                <span className="absolute left-1/2 top-[19px] h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-route" aria-hidden />
                <button aria-expanded={isOpen} onClick={() => { setOpen(isOpen ? null : d.key); track("decision_open", { id: d.key }); }}
                  className={`w-full border p-3 text-left transition-colors ${isOpen ? "border-route bg-route text-ink" : "border-white/15 bg-ink-deep"}`}>
                  <span className="display block text-[1.45rem] leading-none">{d.label}</span>
                  <span className={`mt-2 block text-[0.82rem] leading-snug ${isOpen ? "" : "hidden"}`}>{d.line}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-14 border-t border-white/10 pt-8">
        <p className="eyebrow mb-4 text-slate-light">Your report ends with one of these</p>
        <div className="grid grid-cols-3 gap-px bg-white/10">
          {decisions.map((d) => <div key={d.key} className="display bg-ink-deep px-2 py-5 text-center text-[1.05rem] leading-none">{d.label.replace(".", "")}</div>)}
        </div>
        <p className="lede mt-6 text-white/85">The assessment exists to find out which one is yours.</p>
      </div>
    </div>
  );
}
