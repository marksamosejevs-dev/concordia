"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { decisions } from "@/content/decisions";
import { track } from "@/lib/analytics";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * THE DECISION SET — compact signature element (one viewport).
 * A giant kinetic word cycles through the nine possible outcomes of an assessment;
 * the chip strip below lets the visitor pick one. Autoplay stops on first interaction,
 * pauses off-screen and is disabled for reduced motion.
 */
export function DecisionSet({ tone = "blue", intro = true }: { tone?: "blue" | "ink"; intro?: boolean }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !visible || reduced) return;
    const id = setInterval(() => setI((x) => (x + 1) % decisions.length), 2200);
    return () => clearInterval(id);
  }, [auto, visible, reduced]);
  useEffect(() => {
    const chip = strip.current?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    const s = strip.current;
    if (chip && s && s.scrollWidth > s.clientWidth) s.scrollTo({ left: chip.offsetLeft - s.clientWidth / 2 + chip.offsetWidth / 2, behavior: reduced ? "auto" : "smooth" });
  }, [i, reduced]);

  const pick = (n: number) => { setAuto(false); setI(n); track("decision_open", { id: decisions[n].key }); };
  const d = decisions[i];
  const bg = tone === "blue" ? "on-blue" : "on-deep";

  return (
    <section ref={ref} className={`${bg} relative overflow-hidden py-[clamp(4rem,9vw,7rem)]`} aria-labelledby="decision-title">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="wrap relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            {intro && <p className="mono mb-4 text-[0.72rem] uppercase tracking-[0.14em] text-white/70">You sent the reel. Nobody replied. Now what?</p>}
            <h2 id="decision-title" className="display d-lg max-w-[18ch]">The right football decision is not always <span className="text-route">“go.”</span></h2>
          </div>
          <p className="max-w-xs text-[0.95rem] text-white/80">Every assessment ends with a clear decision. Nine possible answers. One is yours.</p>
        </div>

        {/* Kinetic word */}
        <div className="relative mt-10 grid min-h-[clamp(10rem,22vw,17rem)] items-center border-y border-white/20 py-6 lg:grid-cols-[1fr_0.55fr] lg:gap-10" aria-live="polite">
          <div className="flex items-baseline gap-5 overflow-hidden">
            <span className="mono shrink-0 text-[0.8rem] text-white/60">{String(i + 1).padStart(2, "0")}/09</span>
            <p key={d.key} className="display word-in text-[clamp(3.6rem,13vw,11.5rem)] leading-[0.85] text-white">{d.label.replace(".", "")}<span className="text-route">.</span></p>
          </div>
          <p key={d.key + "-l"} className="word-in mt-4 max-w-md text-[clamp(1.05rem,1.6vw,1.35rem)] leading-snug text-white/90 lg:mt-0">{d.line}</p>
          {auto && !reduced && <span key={`bar-${i}`} className="bar-grow absolute bottom-[-1px] left-0 h-[2px] w-full bg-route" style={{ animationDuration: "2.2s", animationTimingFunction: "linear" }} aria-hidden />}
        </div>

        {/* Chip strip */}
        <div ref={strip} className="rail -mx-[var(--gutter)] mt-6 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1" role="tablist" aria-label="Possible decisions">
          {decisions.map((x, n) => (
            <button key={x.key} data-i={n} role="tab" aria-selected={n === i} onClick={() => pick(n)} onMouseEnter={() => { if (window.matchMedia("(hover: hover)").matches) pick(n); }}
              className={`display shrink-0 rounded-full border px-4 py-2 text-[1.05rem] leading-none transition-colors duration-300 ${n === i ? "border-route bg-route text-ink" : "border-white/30 text-white hover:border-white"}`}>
              {x.label.replace(".", "")}
            </button>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/assessment" className="inline-flex items-center gap-2 font-semibold underline decoration-white/40 underline-offset-[6px] hover:decoration-white">How the assessment decides <span aria-hidden>→</span></Link>
        </div>
      </div>
    </section>
  );
}
