import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta, TextLink } from "@/components/ui/Cta";
import { ReportViewer } from "@/components/report/ReportViewer";
import { Pending } from "@/components/ui/Gate";
import { ASSESSMENT_STEPS, RECEIVE, NOT_RECEIVE } from "@/content/assessment";
import { decisions } from "@/content/decisions";
import { ASSESSMENT_CREDIT } from "@/content/products";
import { FaqSection, FinalCta } from "@/components/sections/HomeSections";
import { pending } from "@/lib/evidence";

export const metadata: Metadata = { alternates: { canonical: "/assessment/" }, title: "Player Pathway Assessment — $249", description: "A professional assessment of your level, your realistic markets and your next 90 days. Apply free · Assessment $249 if accepted." };

export default function AssessmentPage() {
  return (
    <>
      <PageHero eyebrow="Player Pathway Assessment · $249" title={<>What should you actually do with your football career <span className="text-route">next?</span></>}
        lede="A professional assessment of your level, your realistic markets and your next 90 days — from a team working inside European football.">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start"><ApplyCta /><TextLink href="#sample" className="mt-3.5">See a sample</TextLink></div>
        <p className="mono mt-6 text-[0.72rem] text-slate-light">Report within 7 business days · Every assessment follows Concordia’s professional assessment framework and receives senior review</p>
      </PageHero>

      <Section tone="paper" label="Not an opinion">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <h2 className="display d-xl">You don’t pay $249 for an opinion.</h2>
          <div className="lede text-ink/80"><p>A conversation gives you impressions. An assessment gives you a structured, written answer you can act on, share with your family and hold us to.</p><p className="mt-5">It starts with evidence — a full match, your profile, your passports — and ends with a decision.</p></div>
        </div>
      </Section>

      <Section tone="ink" label="How it works">
        <div className="wrap">
          <Kicker>Ten steps</Kicker>
          <h2 className="display d-lg">From application to your next decision.</h2>
          <ol className="relative mt-14 border-l-2 border-route/60 pl-8 sm:pl-12">
            {ASSESSMENT_STEPS.map((s) => (
              <li key={s.n} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-[3px] border-route bg-ink sm:-left-[57px]" aria-hidden />
                <span className="mono text-[0.72rem] text-route">{s.n}</span>
                <p className="display mt-1 text-[1.8rem] leading-none">{s.title}</p>
                <p className="mt-2 max-w-xl text-white/75">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="deep" label="What you receive">
        <div className="wrap grid gap-14 lg:grid-cols-2" data-hide-sticky>
          <div>
            <p className="eyebrow text-route">What you receive</p>
            <ul className="mt-6 space-y-3">{RECEIVE.map((r, i) => <li key={r} className="flex gap-3 text-[1.05rem]"><span className="mt-[0.55em] inline-block h-[6px] w-[6px] shrink-0 bg-route" />{i === RECEIVE.length - 1 ? <Pending evidence={pending("E13", "Exact sign-off wording")}>{r}</Pending> : r}</li>)}</ul>
          </div>
          <div>
            <p className="eyebrow text-slate-light">What you don’t receive — and why that matters</p>
            <ul className="mt-6 space-y-5">{NOT_RECEIVE.map((r) => <li key={r.t}><p className="text-[1.05rem] font-bold">{r.t}</p><p className="text-white/70">{r.b}</p></li>)}</ul>
            <p className="display d-sm mt-8 text-route">We’d rather tell you Europe isn’t the right move today than sell you a trial you don’t need.</p>
          </div>
        </div>
      </Section>

      <Section tone="ink" label="Your report ends with a decision">
        <div className="wrap">
          <Kicker>The output</Kicker>
          <h2 className="display d-lg">Your report ends with a decision.</h2>
          <div className="mt-10 grid grid-cols-3 gap-px bg-white/10 sm:grid-cols-9">
            {decisions.map((d) => <div key={d.key} className="display bg-ink px-2 py-6 text-center text-[1.05rem] leading-none sm:text-[1.15rem]">{d.label}</div>)}
          </div>
        </div>
      </Section>

      <Section tone="deep" label="Sample assessment">
        <div className="wrap">
          <Kicker>Sample assessment · Illustrative example</Kicker>
          <h2 className="display d-lg mb-12">See what you’re buying.</h2>
          <ReportViewer />
        </div>
      </Section>

      <Section tone="paper" label="Who it is for">
        <div className="wrap grid gap-12 lg:grid-cols-3">
          <div><p className="display d-md">Who it’s for</p><p className="mt-4 text-ink/80">Players aged 18 and over who are serious about professional football — college players nearing the end of eligibility, semi-professional players, players with a second passport, and families of 16–17-year-olds (a parent or guardian applies). You’ll need at least one full match on video.</p></div>
          <div><p className="display d-md">Who it isn’t for</p><p className="mt-4 text-ink/80">Anyone looking for a guaranteed trial or contract. Players under 16 receive guidance only — we don’t sell them an assessment.</p></div>
          <div><p className="display d-md">Timing &amp; refunds</p><ul className="mt-4 space-y-2 text-ink/80"><li>Report within 7 business days of payment and footage.</li><li>${ASSESSMENT_CREDIT.amount} credited toward European Pathway if you continue within {ASSESSMENT_CREDIT.days} days.</li><li><Pending evidence={pending("E24", "Approved refund wording")}>Full refund until the review of your match begins.</Pending></li></ul></div>
        </div>
      </Section>
      <FaqSection />
      <FinalCta />
    </>
  );
}
