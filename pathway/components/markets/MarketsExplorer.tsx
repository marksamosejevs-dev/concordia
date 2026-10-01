"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MAP, countries, COUNTRY_TABS, type Country } from "@/content/countries";
import { IS_REVIEW } from "@/lib/site-mode";
import { track } from "@/lib/analytics";

/**
 * European Market Explorer. Map is an enhancement; the list view is the accessible path.
 * Only countries with sourced, verified data are "live". Nothing is fabricated.
 */
export function MarketsExplorer() {
  const [sel, setSel] = useState<string | null>(null);
  const [tab, setTab] = useState<(typeof COUNTRY_TABS)[number]>("Overview");
  const [view, setView] = useState<"map" | "list">("map");
  const byIso = useMemo(() => Object.fromEntries(countries.map((c) => [c.iso, c])), []);
  const country: Country | undefined = sel ? byIso[sel] : undefined;
  const live = countries.filter((c) => c.marketStatus === "live");
  const pick = (iso: string) => { setSel(iso); setTab("Overview"); track("market_explorer_interaction", { country: iso, action: "select" }); };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="mono text-[0.72rem] text-slate-light">{live.length} live market guides · {countries.length - live.length} in preparation</p>
        <div role="tablist" aria-label="View" className="inline-flex border border-white/20 p-1">
          {(["map", "list"] as const).map((v) => <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`px-4 py-1.5 text-sm font-semibold capitalize ${view === v ? "bg-white text-ink" : "text-white/75"}`}>{v}</button>)}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {view === "map" ? (
          <div className="relative overflow-hidden border border-white/10 bg-ink-deep">
            <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="h-auto w-full" role="group" aria-label="Map of European football markets">
              {MAP.countries.map((c) => {
                const active = c.iso && c.iso === sel;
                const isLive = c.iso && byIso[c.iso]?.marketStatus === "live";
                if (!c.launchSet) return <path key={c.name} d={c.d} fill="#0F1E3D" stroke="#24345A" strokeWidth="0.8" />;
                return (
                  <path key={c.name} d={c.d} tabIndex={0} role="button" aria-label={`${byIso[c.iso!]?.name ?? c.name}${isLive ? "" : " — market guide in preparation"}`}
                    onClick={() => pick(c.iso!)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(c.iso!); } }}
                    fill={active ? "#FFD23F" : isLive ? "#1E3C9C" : "#16295A"} stroke={active ? "#FFD23F" : "#3B5BB5"} strokeWidth={active ? 2 : 0.9}
                    className="cursor-pointer outline-none transition-[fill] duration-200 hover:fill-[#2a4cc0] focus-visible:fill-[#2a4cc0]" />
                );
              })}
              {sel && (() => { const c = MAP.countries.find((x) => x.iso === sel); return c ? <g pointerEvents="none"><circle cx={c.cx} cy={c.cy} r="12" fill="#FFD23F" className="pulse" /><circle cx={c.cx} cy={c.cy} r="6" fill="#0D1B36" /></g> : null; })()}
            </svg>
            <p className="mono absolute bottom-3 left-4 text-[0.6rem] text-slate">Map: Natural Earth (public domain)</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-px self-start border border-white/10 bg-white/10 sm:grid-cols-3">
            {countries.map((c) => (
              <li key={c.iso}><button onClick={() => pick(c.iso)} className={`w-full bg-ink-deep px-4 py-3 text-left text-[0.92rem] ${sel === c.iso ? "text-route" : ""}`}>{c.name}<span className="mono block text-[0.6rem] text-slate">{c.marketStatus === "live" ? "Live guide" : "In preparation"}</span></button></li>
            ))}
          </ul>
        )}
        <aside aria-live="polite" className="border border-white/10 bg-ink-deep p-6 lg:sticky lg:top-24 lg:self-start">
          {!country ? (
            <>
              <p className="display d-sm">Select a market.</p>
              <p className="mt-3 text-white/75">Each market guide covers league structure, calendar and windows, registration and passports, style of play, entry routes and who it suits — every fact sourced and dated.</p>
              <p className="mt-6 border-l-2 border-route pl-4 text-[0.92rem] text-white/80">We publish a market only when its facts are sourced and verified. Better a few excellent guides than dozens of guesses.</p>
            </>
          ) : (
            <>
              <p className="mono text-[0.68rem] text-slate-light">{country.iso}</p>
              <p className="display d-md mt-1">{country.name}</p>
              {country.marketStatus !== "live" && <p className="mono mt-3 inline-block border border-white/25 px-2 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-slate-light">Market guide in preparation</p>}
              {IS_REVIEW && (
                <div className="gated mt-6 p-3">
                  <span className="gate-tag absolute -top-3 left-2">Template · sourced data required</span>
                  <div className="rail flex gap-1 overflow-x-auto" role="tablist">
                    {COUNTRY_TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`shrink-0 px-3 py-1.5 text-[0.75rem] ${tab === t ? "bg-white text-ink" : "border border-white/15 text-white/70"}`}>{t}</button>)}
                  </div>
                  <div className="mt-4 space-y-2 text-[0.85rem] text-white/60">
                    <p>[{tab.toUpperCase()} — SOURCE REQUIRED]</p>
                    <p className="mono text-[0.65rem]">Each fact: source title · URL · last verified date</p>
                  </div>
                </div>
              )}
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="font-semibold">Is this market realistic for you?</p>
                <p className="mt-1 text-[0.92rem] text-white/70">That depends on your level, position, passport, timing and goals — which is exactly what the assessment works out.</p>
                <Link href="/apply" className="btn btn-route mt-5 w-full" onClick={() => track("market_explorer_interaction", { country: country.iso, action: "apply" })}>Apply for your assessment →</Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
