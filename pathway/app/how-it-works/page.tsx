import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta } from "@/components/ui/Cta";
import { FaqSection, FinalCta } from "@/components/sections/HomeSections";

export const metadata: Metadata = { alternates: { canonical: "/how-it-works/" }, title: "How it works", description: "Four steps. No guesswork. Representation is separate." };

const STEPS = [
  { n: "01", t: "Apply free.", b: "Your profile, a full match and your goals. We review every application before accepting payment." },
  { n: "02", t: "Get assessed.", b: "Full-match review, written report and a strategy call. Every assessment follows Concordia’s professional assessment framework and receives senior review." },
  { n: "03", t: "Decide.", b: "Your report ends with a decision: go, wait, stay, move, play more, change market, improve first, say no — or read it again.", link: { href: "/#decision-title", label: "The Decision Set" } },
  { n: "04", t: "Build the plan.", b: "If it fits, continue with European Pathway — $399/month, built around the transfer windows. If it doesn’t, we’ll tell you." },
  { n: "05", t: "Representation is separate.", b: "Concordia Sports Agency reviews Pathway members each window. Being reviewed is not being selected, and nothing you buy changes that. Formal representation needs its own agreement." },
];
const NEVER = ["Promise a trial, a club or a contract", "Contact clubs about you as part of European Pathway", "Sell representation", "Charge for “priority” consideration by the Agency", "Tell everyone to go to Europe"];

export default function HowItWorks() {
  return (
    <>
      <PageHero eyebrow="How it works" title={<>Four steps. <span className="text-route">No guesswork.</span></>} lede="From a free application to a professional decision — and, if it fits, a structured plan.">
        <ApplyCta />
      </PageHero>
      <Section tone="ink" label="Steps" className="!pt-8">
        <div className="wrap">
          <ol className="relative border-l-2 border-route/60 pl-8 sm:pl-14">
            {STEPS.map((s, i) => (
              <li key={s.n} className="relative pb-14 last:pb-0">
                <span className={`absolute top-2 h-5 w-5 rounded-full border-[3px] ${i === 4 ? "border-white bg-ink" : "border-route bg-ink"} -left-[43px] sm:-left-[67px]`} aria-hidden />
                {i === 4 && <span className="mono absolute -left-[3px] -top-6 text-[0.6rem] uppercase tracking-[0.12em] text-slate-light sm:-left-[27px]">Separate agreement</span>}
                
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
