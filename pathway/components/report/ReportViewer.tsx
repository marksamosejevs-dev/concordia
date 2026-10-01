"use client";
import { useRef, useState } from "react";
import { activeSample as s } from "@/content/sample-report";
import { decisions } from "@/content/decisions";
import { Mark } from "@/components/brand/Logo";
import { track } from "@/lib/analytics";

const dec = (k: string) => decisions.find((d) => d.key === k)!.label;

function PageShell({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="on-paper relative flex aspect-[1/1.36] w-full flex-col overflow-hidden p-[6%] text-ink shadow-[0_30px_70px_-25px_rgba(0,0,0,0.65)]">
      <div className="sample-mark">SAMPLE</div>
      <div className="relative flex items-center justify-between border-b border-ink/15 pb-[3%]">
        <span className="flex items-center gap-2"><Mark className="h-5 w-5" ink="#0D1B36" route="#B98A00" /><span className="mono text-[clamp(0.5rem,0.8vw,0.62rem)] uppercase tracking-[0.12em]">Player Pathway Assessment</span></span>
        <span className="mono text-[clamp(0.5rem,0.8vw,0.62rem)] text-slate">{s.player.code} · p.{n}</span>
      </div>
      <p className="display relative mt-[5%] text-[clamp(1.4rem,3.2vw,2.4rem)] leading-none">{title}</p>
      <div className="relative mt-[4%] flex-1 text-[clamp(0.62rem,1vw,0.8rem)] leading-relaxed">{children}</div>
      <p className="mono relative mt-[3%] border-t border-ink/15 pt-[2.5%] text-[clamp(0.45rem,0.7vw,0.55rem)] uppercase tracking-[0.12em] text-slate">Sample assessment · Illustrative example · Fictional player — not a real Pathway client</p>
    </div>
  );
}

const PAGES = [
  {
    key: "cover", title: "Summary", render: () => (
      <>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          {([["Age", s.player.age], ["Position", s.player.position], ["Foot", s.player.foot], ["Context", s.player.context], ["Passports", s.player.passports], ["Footage", s.player.footage]] as const).map(([k, v]) => (
            <div key={k}><dt className="mono text-[0.85em] uppercase tracking-[0.08em] text-slate">{k}</dt><dd className="font-semibold">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-[6%]">{s.summary}</p>
        <div className="mt-[6%] bg-ink p-[5%] text-white">
          <p className="mono text-[0.85em] uppercase tracking-[0.12em] text-route">Recommended next decision</p>
          <p className="display mt-2 text-[2.2em] leading-none">{s.decision.map(dec).join(" → ")}</p>
        </div>
      </>
    ),
  },
  {
    key: "level", title: "Level band", render: () => (
      <>
        <p className="text-[1.15em] font-bold">{s.levelBand.range}</p>
        <p className="mono mt-1 text-[0.85em] text-slate">Confidence: {s.levelBand.confidence}</p>
        <div className="relative mt-[6%] h-[18%] min-h-[48px]">
          <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-ink/15" />
          {["Amateur", "Semi-pro", "Lower pro", "Mid pro", "Top pro"].map((l, i) => (
            <span key={l} className="mono absolute top-[62%] -translate-x-1/2 text-[0.75em] text-slate" style={{ left: `${10 + i * 20}%` }}>{l}</span>
          ))}
          <div className="absolute top-1/2 h-[12px] -translate-y-1/2 bg-ink" style={{ left: "34%", width: "28%" }} />
        </div>
        <p className="mono mt-[4%] text-[0.85em] uppercase tracking-[0.1em] text-slate">Reasoning</p>
        <ul className="mt-2 space-y-1.5">{s.levelBand.reasoning.map((r) => <li key={r} className="flex gap-2"><span className="text-route-deep">—</span>{r}</li>)}</ul>
      </>
    ),
  },
  {
    key: "strengths", title: "Strengths & gaps", render: () => (
      <div className="grid gap-[5%] sm:grid-cols-2">
        <div><p className="mono text-[0.85em] uppercase tracking-[0.1em] text-slate">Lead with</p>{s.strengths.map((x, i) => <div key={x.t} className="mt-3"><p className="font-bold">{i + 1}. {x.t}</p><p className="text-ink/75">{x.b}</p></div>)}</div>
        <div><p className="mono text-[0.85em] uppercase tracking-[0.1em] text-slate">Close next</p>{s.gaps.map((x, i) => <div key={x.t} className="mt-3"><p className="font-bold">{i + 1}. {x.t}</p><p className="text-ink/75">{x.b}</p></div>)}</div>
      </div>
    ),
  },
  {
    key: "markets", title: "Markets & passport", render: () => (
      <>
        {s.markets.map((m, i) => (
          <div key={m.name} className="mb-[4%] grid grid-cols-[auto_1fr] gap-3 border-b border-ink/10 pb-[3%]">
            <span className="display text-[2em] leading-none text-route-deep">{String.fromCharCode(65 + i)}</span>
            <div><p className="font-bold">{m.name} <span className="mono font-normal text-slate">· {m.tier}</span></p><p>{m.why}</p><p className="text-ink/60">Caution: {m.caution}</p></div>
          </div>
        ))}
        <p className="mono text-[0.85em] uppercase tracking-[0.1em] text-slate">Passport</p>
        <ul className="mt-1 space-y-1">{s.passport.map((p) => <li key={p}>— {p}</li>)}</ul>
      </>
    ),
  },
  {
    key: "plan", title: "90-day plan", render: () => (
      <div className="space-y-[5%]">
        {s.plan.map((p) => (
          <div key={p.window} className="grid grid-cols-[28%_1fr] gap-3">
            <p className="display text-[1.5em] leading-none">{p.window}</p>
            <ul className="space-y-1">{p.actions.map((a) => <li key={a} className="flex gap-2"><span className="mt-[0.45em] inline-block h-[6px] w-[6px] shrink-0 bg-route-deep" />{a}</li>)}</ul>
          </div>
        ))}
        <p className="border-t border-ink/15 pt-[4%] text-ink/75">Review call: we go through every page with you — and your parent or guardian, if you’d like.</p>
      </div>
    ),
  },
];

export function ReportViewer() {
  const [i, setI] = useState(0);
  const [full, setFull] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const go = (n: number) => { setI(n); track("assessment_sample_view", { page: s.pages[n].key }); };
  return (
    <div id="sample">
      {/* Desktop: sticky deliverable list + stacked page */}
      <div className="hidden gap-14 lg:grid lg:grid-cols-[0.8fr_1.2fr]">
        <ol className="space-y-1 self-center">
          {s.pages.map((p, n) => (
            <li key={p.key}>
              <button onClick={() => go(n)} aria-current={i === n} className={`w-full border-l-2 py-4 pl-6 text-left transition-colors ${i === n ? "border-route" : "border-white/15 opacity-60 hover:opacity-100"}`}>
                <span className="mono text-[0.7rem] text-slate-light">0{n + 1}</span>
                <span className="display mt-1 block text-[1.8rem] leading-none">{p.title}</span>
                {i === n && <span className="mt-2 block text-[0.95rem] text-white/80">{p.caption}</span>}
              </button>
            </li>
          ))}
        </ol>
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute inset-0 translate-x-6 translate-y-6 bg-white/5" aria-hidden />
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-white/10" aria-hidden />
          <div key={i} className="relative animate-[fadein_.5s_ease]"><PageShell n={i + 1} title={PAGES[i].title}>{PAGES[i].render()}</PageShell></div>
        </div>
      </div>
      {/* Mobile: swipe viewer */}
      <div className="lg:hidden">
        <div ref={railRef} className="rail -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)]"
          onScroll={(e) => { const el = e.currentTarget; setI(Math.round(el.scrollLeft / (el.clientWidth * 0.86))); }}>
          {PAGES.map((p, n) => (
            <button key={p.key} onClick={() => setFull(n)} className="w-[86%] shrink-0 snap-center text-left" aria-label={`Open sample page ${n + 1} full screen`}>
              <PageShell n={n + 1} title={p.title}>{p.render()}</PageShell>
              <p className="mt-3 text-[0.9rem] text-white/80">{s.pages[n].caption}</p>
            </button>
          ))}
        </div>
        <p className="mono mt-4 text-center text-[0.75rem] text-slate-light">{Math.min(i, 4) + 1} / 5 · Tap a page to open</p>
      </div>
      {full !== null && (
        <div role="dialog" aria-modal="true" aria-label="Sample assessment page" className="fixed inset-0 z-[80] overflow-y-auto bg-ink p-4" onClick={() => setFull(null)}>
          <button className="btn btn-ghost mb-4 !min-h-[40px]" autoFocus onClick={() => setFull(null)}>Close</button>
          <PageShell n={full + 1} title={PAGES[full].title}>{PAGES[full].render()}</PageShell>
        </div>
      )}
      <style>{`@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
