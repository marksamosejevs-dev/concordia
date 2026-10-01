"use client";
import { useEffect, useRef, useState } from "react";

const ITEMS: [string, string][] = [
  ["PLAY", "Regular minutes where you are."],
  ["WAIT", "The right window, not the first one."],
  ["STAY", "Another season where you’re developing."],
  ["RECOVER", "A plan back after injury or a bad season."],
  ["IMPROVE", "Knowing exactly what to work on."],
  ["AVOID THE WRONG MOVE", "Not paying for the trial that was never going to lead anywhere."],
  ["UNDERSTAND THE CONTRACT", "Signing something fair — or not signing it."],
  ["CHOOSE THE RIGHT ENVIRONMENT", "Where a player like you actually gets to play."],
  ["GET MOVING AGAIN", "A realistic plan when the career has stalled."],
];

/** Transfer-window "departures board": the one orchestrated motion in this section. */
export function SplitFlap() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="border border-white/15 bg-ink-deep">
      <div className="mono flex justify-between border-b border-white/10 px-5 py-3 text-[0.62rem] uppercase tracking-[0.14em] text-slate"><span>Outcome</span><span>What it means</span></div>
      <ul>
        {ITEMS.map(([k, v], i) => (
          <li key={k} className="grid grid-cols-1 gap-1 border-b border-white/[0.07] px-5 py-3.5 last:border-0 sm:grid-cols-[1fr_1.1fr] sm:items-center sm:gap-6"
            style={{ opacity: on ? 1 : 0, transform: on ? "none" : "rotateX(80deg)", transformOrigin: "top", transition: `opacity .5s ${i * 0.09}s, transform .6s cubic-bezier(.22,.7,.2,1) ${i * 0.09}s` }}>
            <span className="display text-[1.35rem] leading-none text-route">{k}</span>
            <span className="text-[0.9rem] text-white/75">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
