import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta } from "@/components/ui/Cta";
import { PriceCard } from "@/components/cards/PriceCard";
import { WindowClock } from "@/components/programmes/WindowClock";
import { DecisionSet } from "@/components/sections/DecisionSet";
import { BEFORE_AFTER, product, programmeFor, ASSESSMENT_CREDIT, LADDER } from "@/content/products";
import { NotRepresentation, FinalCta } from "@/components/sections/HomeSections";
import { usd } from "@/lib/format";

export const metadata: Metadata = { title: "Programmes", description: "The assessment gives you direction. A programme gives you structure — built around the transfer windows." };

export default function ProgrammesPage() {
  return (
    <>
      <PageHero eyebrow="European Pathway programmes" title={<>The assessment gives you direction. <span className="text-route">A programme gives you structure.</span></>}
        lede="Knowing what to do is half of it. Doing it — through a transfer window, with regular review and someone to check each decision — is the other half." >
        <ApplyCta label="Start with an assessment" />
      </PageHero>

      <Section tone="paper" label="Before and after">
        <div className="wrap">
          <Kicker>From random activity to professional process</Kicker>
          <h2 className="display d-lg max-w-[18ch]">Sell structure, not dreams.</h2>
          <div className="mt-12 grid border-t-2 border-ink sm:grid-cols-2">
            <p className="eyebrow border-b border-ink/15 py-3 text-ink/60">Before</p><p className="eyebrow hidden border-b border-ink/15 py-3 sm:block">With a programme</p>
            {BEFORE_AFTER.map(([b, a]) => (<div key={b} className="contents"><p className="border-b border-ink/10 py-4 pr-6 text-ink/50 line-through decoration-ink/30">{b}</p><p className="border-b border-ink/10 py-4 font-semibold"><span className="mr-2 text-route-deep sm:hidden">→</span>{a}</p></div>))}
          </div>
          <p className="mt-10 max-w-2xl text-[1rem] text-ink/75">A programme gives you better information, better structure and better decisions. It doesn’t give you a club, a trial or a contract — and nobody honest can sell you one.</p>
        </div>
      </Section>

      <Section tone="ink" label="Window clock">
        <div className="wrap">
          <Kicker>Why programmes follow the transfer window</Kicker>
          <h2 className="display d-lg mb-14 max-w-[18ch]">Football careers move in windows. So do our programmes.</h2>
          <WindowClock />
        </div>
      </Section>

      <Section tone="deep" label="Programmes" className="!pt-16">
        <div className="wrap" data-hide-sticky>
          <Kicker>Choose after your assessment</Kicker>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {["window", "two-window", "cohort", "elite"].map((id) => <PriceCard key={id} p={product(id)} c={programmeFor(id)} featured={id === "window"} />)}
          </div>
          <div className="mt-6 flex flex-col justify-between gap-4 border border-white/12 p-6 sm:flex-row sm:items-center">
            <div><p className="display text-[1.6rem] leading-none">Pathway Club · {usd(product("club").price)}/month</p><p className="mt-1 text-white/70">{programmeFor("club").concept} {programmeFor("club").footnote}</p></div>
            <Link href="/programmes/pathway-club" className="btn btn-ghost">Details →</Link>
          </div>
          <p className="mono mt-8 text-[0.72rem] text-slate-light">Every programme starts with an assessment · ${ASSESSMENT_CREDIT.amount} of your assessment credited toward a programme booked within {ASSESSMENT_CREDIT.days} days</p>
        </div>
      </Section>

      <Section tone="ink" label="What the programme answers">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div><Kicker>The ladder</Kicker><h2 className="display d-lg">Your journey doesn’t end at $249.</h2></div>
          <ol className="space-y-4">{LADDER.map((l, i) => <li key={l.step} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/10 pb-4"><span className="mono text-route">{String(i + 1).padStart(2, "0")}</span><div><p className="display text-[1.4rem] leading-none">{l.step} <span className="mono ml-2 text-[0.7rem] text-slate-light">{l.price}</span></p><p className="mt-1.5 text-white/70">{l.answers}</p></div></li>)}</ol>
        </div>
      </Section>
      <DecisionSet intro={false} />
      <NotRepresentation />
      <FinalCta />
    </>
  );
}
