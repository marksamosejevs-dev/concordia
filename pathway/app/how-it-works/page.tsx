import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta } from "@/components/ui/Cta";
import { FaqSection, FinalCta } from "@/components/sections/HomeSections";
import { ASSESSMENT_STEPS } from "@/content/assessment";
import { FlowLine } from "@/components/funnel/FlowLine";

export const metadata: Metadata = { alternates: { canonical: "/how-it-works" }, title: "How it works", description: "Apply free, get accepted for a Pathway Assessment, pay $249, send your profile and video, and get your assessment and a 60-minute call." };

const STEPS: { n: string; t: string; b: string; link?: { href: string; label: string } }[] = ASSESSMENT_STEPS.map((x) => ({ n: x.n, t: x.title + ".", b: x.body }));
const NEVER = ["Promise a trial, a club or a contract", "Contact clubs about you as part of European Pathway", "Sell representation", "Charge for “priority” consideration by the Agency", "Tell everyone to go to Europe"];

export default function HowItWorks() {
  return (
    <>
      <PageHero eyebrow="How it works" title={<>From application <span className="text-route">to your next move.</span></>} lede="From a free application to a professional decision — and, if it fits, a structured plan.">
        <ApplyCta />
      </PageHero>
      <Section tone="ink" label="Steps" className="!pt-8">
        <div className="wrap">
          <FlowLine className="mb-16" />
          <ol className="relative border-l-2 border-route/60 pl-8 sm:pl-14">
            {STEPS.map((s, i) => (
              <li key={s.n} className="relative pb-14 last:pb-0">
                <span className={`absolute top-2 h-5 w-5 rounded-full border-[3px] ${i === STEPS.length - 1 ? "border-white bg-ink" : "border-route bg-ink"} -left-[43px] sm:-left-[67px]`} aria-hidden />
                {i === STEPS.length - 1 && <span className="mono absolute -left-[3px] -top-6 text-[0.6rem] uppercase tracking-[0.12em] text-slate-light sm:-left-[27px]">Separate agreement</span>}
                
                <p className="display d-md mt-1">{s.t}</p>
                <p className="lede mt-3 max-w-2xl text-white/80">{s.b}</p>
                {s.link && <Link href={s.link.href} className="mono mt-3 inline-block text-[0.72rem] uppercase tracking-[0.1em] text-route underline">{s.link.label} →</Link>}
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section tone="paper" label="What we never do">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div><Kicker>What we never do</Kicker><h2 className="display d-lg">The honest list.</h2></div>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">{NEVER.map((n) => <li key={n} className="flex gap-4 py-4 text-[1.1rem] font-semibold"><span className="text-alert">×</span>{n}</li>)}</ul>
        </div>
      </Section>
      <FaqSection />
      <FinalCta />
    </>
  );
}
