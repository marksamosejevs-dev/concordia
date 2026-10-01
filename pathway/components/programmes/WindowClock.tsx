"use client";
import { useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RHYTHM = [
  { m: [0], title: "Month 1", body: "Onboarding, written roadmap, profile rebuild, target-market brief." },
  { m: [1, 2], title: "Months 2–3", body: "Match analysis, development focus, outreach education." },
  { m: [3], title: "Month 4", body: "Pre-window review. Vetting of any offers or trials. Trial budget plan." },
  { m: [4, 5], title: "Months 5–6", body: "Window support, offer evaluation, quarterly written review, next-step decision." },
];
type Prog = "window" | "two-window";

/**
 * Window Clock — a 12-month dial with two indicative transfer windows.
 * Window arcs are illustrative only: registration windows vary by country and are confirmed per market.
 */
export function WindowClock() {
  const [prog, setProg] = useState<Prog>("window");
  const [step, setStep] = useState(0);
  const R = 150, C = 200;
  const pt = (deg: number, r = R) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)];
  const arc = (from: number, to: number, r = R) => { const [x1, y1] = pt(from, r); const [x2, y2] = pt(to, r); return `M${x1} ${y1} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`; };
  const start = 60; // programme starts in March (illustrative)
  const span = prog === "window" ? 180 : 359.9;
  const stepDeg = start + RHYTHM[step].m[0] * 30;
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
      <div className="mx-auto w-full max-w-[460px]">
        <svg viewBox="0 0 400 400" className="w-full" role="img" aria-label={`Window clock: ${prog === "window" ? "6-month" : "12-month"} programme across indicative transfer windows`}>
          <circle cx={C} cy={C} r={R} fill="none" stroke="#7D8797" strokeOpacity="0.35" strokeWidth="2" />
          {/* indicative windows */}
          <path d={arc(165, 240, R + 22)} stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="10" fill="none" />
          <path d={arc(0, 30, R + 22)} stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="10" fill="none" />
          {/* programme arc */}
          <path d={arc(start, start + span, R)} stroke="#FFD23F" strokeWidth="8" fill="none" style={{ transition: "d .6s" }} />
          {MONTHS.map((m, i) => { const [x, y] = pt(i * 30 + 15, R - 26); return <text key={m} x={x} y={y + 4} textAnchor="middle" fill="#AEB6C4" style={{ font: "500 11px var(--font-mono)" }}>{m.toUpperCase()}</text>; })}
          {(() => { const [x, y] = pt(stepDeg + 15); return <circle cx={x} cy={y} r="11" fill="#FFD23F" stroke="#0D1B36" strokeWidth="4" />; })()}
          <text x={C} y={C - 6} textAnchor="middle" fill="#fff" style={{ font: "400 40px var(--font-display)" }}>{prog === "window" ? "6 MONTHS" : "12 MONTHS"}</text>
          <text x={C} y={C + 20} textAnchor="middle" fill="#AEB6C4" style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.1em" }}>{prog === "window" ? "ONE WINDOW" : "TWO WINDOWS"}</text>
        </svg>
        <p className="mono mt-2 text-center text-[0.65rem] text-slate-light"><span className="mr-2 inline-block h-2 w-5 bg-white align-middle" />Transfer windows — indicative; dates vary by country</p>
      </div>
      <div>
        <div role="tablist" aria-label="Programme length" className="inline-flex border border-white/20 p-1">
          {(["window", "two-window"] as Prog[]).map((p) => (
            <button key={p} role="tab" aria-selected={prog === p} onClick={() => setProg(p)} className={`px-4 py-2 text-sm font-semibold ${prog === p ? "bg-route text-ink" : "text-white/75"}`}>{p === "window" ? "Window · 6 months" : "Two-Window · 12 months"}</button>
          ))}
        </div>
        <ol className="mt-8 space-y-2">
          {RHYTHM.map((r, i) => (
            <li key={r.title}>
              <button onClick={() => setStep(i)} aria-current={step === i} className={`w-full border-l-2 py-3 pl-5 text-left transition-colors ${step === i ? "border-route" : "border-white/15 opacity-60 hover:opacity-100"}`}>
                <span className="display block text-[1.5rem] leading-none">{r.title}</span>
                <span className="mt-1.5 block text-[0.95rem] text-white/80">{r.body}</span>
              </button>
            </li>
          ))}
        </ol>
        {prog === "two-window" && <p className="mt-6 text-[0.95rem] text-white/75">The second six months repeat the rhythm for the next window — with four full-match analyses across the year and an end-of-year re-assessment.</p>}
      </div>
    </div>
  );
}
