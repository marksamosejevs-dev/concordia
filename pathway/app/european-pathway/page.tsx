import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ApplyCta } from "@/components/ui/Cta";
import { Pending } from "@/components/ui/Gate";
import { Reveal } from "@/components/ui/Reveal";
import { CareerDashboard } from "@/components/pathway/CareerDashboard";
import { PricePair, FinalOffer } from "@/components/home/HomeV2";
import { PATHWAY_TERMS, PILLARS, MONTHS, PATHWAY_INCLUDED, ASSESSMENT_POINTS } from "@/content/pathway";
import { product } from "@/content/products";
import { photos } from "@/content/photos";
import { LICENCE } from "@/content/site";
import { usd } from "@/lib/format";
import { IS_REVIEW } from "@/lib/site-mode";

export const metadata: Metadata = { alternates: { canonical: "/european-pathway/" }, title: "European Pathway — $399/month career management",
  description: "Monthly football career management for players targeting Europe: strategy, match analysis, market matching, contract and offer review, and transfer-window planning. Designed as a 6-month pathway, paid monthly.",
};

const FAQ: [string, string][] = [
  ["Do I need the assessment first?", "Yes. The pathway is built on your Player Pathway Assessment — your level, your markets and your next move. It starts after your assessment, when it makes sense for you."],
  ["Is it really paid monthly?", `Yes. European Pathway is ${usd(product("pathway").price)} per month — you don’t pay the six months upfront. ${PATHWAY_TERMS.cancellation}`],
  ["Why six months?", "Football careers move in transfer windows. Six months gives your career team time to plan, reposition you and prepare properly for a window — not just react to it."],
  ["Is contract review included?", "Yes. Your career team reviews offers and contracts with you and explains what they commit you to before you sign. Where formal legal advice is needed in a specific country, we’ll tell you."],
  ["Does the pathway get me a club?", "No one honest can promise that. The pathway gives you a professional plan, better positioning and better decisions — and it tells you when an opportunity isn’t right."],
  ["Is this representation?", "No. European Pathway is career management and advisory. Representation by Concordia Sports Agency is a separate, selective agreement."],
];

export default function EuropeanPathwayPage() {
  const p = product("pathway");
  return (
    <>
      {/* HERO */}
      <section className="on-ink relative overflow-hidden pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-24" aria-label="European Pathway">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mono mb-5 text-[0.72rem] uppercase tracking-[0.14em] text-route">European Pathway · ongoing career management</p>
            <h1 className="display d-hero max-w-[12ch]">Your career team in European football.</h1>
            <p className="display mt-6 text-[clamp(4.5rem,11vw,8.5rem)] leading-[0.8] text-route">{usd(p.price)}<span className="ml-2 align-top text-[0.3em] text-white">/ month</span></p>
            <p className="mt-5 max-w-md text-[1.1rem] font-semibold">{PATHWAY_TERMS.horizon}</p>
            <p className="mt-1.5 max-w-md text-[0.9rem] text-white/70">{PATHWAY_TERMS.cancellation}{IS_REVIEW && <sup className="mono ml-1 text-[0.6em] text-route">{PATHWAY_TERMS.evidence.ref}</sup>}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
              <ApplyCta />
              <Link href="#included" className="btn btn-ghost">What’s included <span className="arrow" aria-hidden>↓</span></Link>
            </div>
          </div>
          <CareerDashboard className="text-white" />
        </div>
      </section>

      {/* HOW YOU GET THERE */}
      <section className="on-route py-10" aria-label="How to start">
        <div className="wrap grid items-center gap-6 lg:grid-cols-[1fr_1.2fr]">
          <p className="display d-md max-w-[18ch]">It starts with your assessment. Then the pathway runs month by month.</p>
          <PricePair tone="light" />
        </div>
      </section>

      {/* EIGHT PILLARS */}
      <section className="on-white py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="pillars-title" id="included">
        <div className="wrap">
          <p className="mono mb-4 text-[0.72rem] uppercase tracking-[0.14em] text-ink/55">What your career team does</p>
          <h2 id="pillars-title" className="display d-xl max-w-[16ch]">Eight jobs. One career team.</h2>
          <div className="mt-12 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((x, n) => (
              <Reveal key={x.key} delay={(n % 4) * 80} className="tile bg-white p-6">
                <p className="mono tile-muted text-[0.7rem] text-ink/50">{x.n}</p>
                <h3 className="display mt-6 text-[1.8rem] leading-[0.95]">{x.name}</h3>
                <p className="tile-muted mt-2 text-[0.92rem] text-ink/70">{x.line}</p>
                <ul className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-[0.88rem]">
                  {x.detail.map((d) => <li key={d} className="flex gap-2.5"><span className="mt-[0.5em] h-[5px] w-[5px] shrink-0 bg-current" aria-hidden />{d}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SIX MONTHS */}
      <section className="on-blue relative overflow-hidden py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="months-title">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <h2 id="months-title" className="display d-xl max-w-[14ch]">Six months, built around the window.</h2>
            <p className="max-w-sm text-white/80">An illustrative shape. Your plan follows your assessment — and changes when your situation does.</p>
          </div>
          <ol className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {MONTHS.map((m, n) => (
              <Reveal as="li" key={m.m} delay={n * 90} className="border-t-[3px] border-route bg-white/[0.06] p-5">
                <p className="mono text-[0.65rem] uppercase tracking-[0.12em] text-route">Month {m.m}</p>
                <p className="display mt-2 text-[1.7rem] leading-none">{m.t}</p>
                <p className="mt-2 text-[0.9rem] text-white/80">{m.b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FULL INCLUSIONS + PHOTO */}
      <section className="on-paper py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="list-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <h2 id="list-title" className="display d-lg max-w-[12ch]">Everything in the pathway.</h2>
            <div className="relative mt-8 hidden aspect-[4/5] max-w-sm overflow-hidden lg:block"><Image src={photos.okmk.src} alt={photos.okmk.alt} fill sizes="380px" className="photo-grade object-cover" style={{ objectPosition: "50% 25%" }} /></div>
            <p className="mono mt-4 text-[0.66rem] uppercase tracking-[0.1em] text-ink/55">Career team led by FIFA Licensed Football Agent {LICENCE.holder}</p>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {PATHWAY_INCLUDED.map((x) => <li key={x.t} className="flex gap-3 border-b border-ink/10 py-4 text-[1.02rem] font-semibold"><span className="mt-[0.45em] h-2 w-2 shrink-0 bg-route-deep" aria-hidden />{x.e ? <Pending evidence={x.e}>{x.t}</Pending> : x.t}</li>)}
          </ul>
        </div>
      </section>

      {/* ASSESSMENT vs PATHWAY */}
      <section className="on-white py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="compare-title">
        <div className="wrap">
          <h2 id="compare-title" className="display d-xl max-w-[16ch]">Assessment gives direction. The pathway gets it done.</h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <div className="border-2 border-ink p-7">
              <p className="mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/55">Assessment · {usd(product("assessment").price)} one time</p>
              <p className="display mt-3 text-[2rem] leading-none">Where am I? What should I do next?</p>
              <ul className="mt-5 space-y-2 text-ink/80">{ASSESSMENT_POINTS.map((a) => <li key={a}>— {a}</li>)}</ul>
            </div>
            <div className="on-ink p-7">
              <p className="mono text-[0.68rem] uppercase tracking-[0.14em] text-route">European Pathway · {usd(p.price)} / month</p>
              <p className="display mt-3 text-[2rem] leading-none">What do I do this month — and is this offer right?</p>
              <ul className="mt-5 space-y-2 text-white/85">{PILLARS.slice(0, 6).map((a) => <li key={a.key}>— {a.name}</li>)}<li>— and more</li></ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="on-paper py-[clamp(4rem,9vw,7rem)]" aria-labelledby="pfaq-title">
        <div className="wrap grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
          <h2 id="pfaq-title" className="display d-lg">Questions about the pathway.</h2>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[1.08rem] font-semibold">{q}<span className="mt-0.5 text-route-deep transition-transform group-open:rotate-45" aria-hidden>+</span></summary>
                <p className="mt-3 max-w-3xl leading-relaxed text-ink/75">{a}{q === "Is this representation?" && <> <Link href="/representation" className="underline underline-offset-4">How representation works</Link>.</>}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FinalOffer />
    </>
  );
}
