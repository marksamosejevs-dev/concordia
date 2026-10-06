import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta } from "@/components/ui/Cta";
import { Pending, Gate } from "@/components/ui/Gate";
import { TeamGrid } from "@/components/team/TeamGrid";
import { WorkedExampleCard } from "@/components/cards/CaseCards";
import { decisions } from "@/content/decisions";
import { workedExamples } from "@/content/cases";
import { RECEIVE } from "@/content/assessment";
import { FinalCta } from "@/components/sections/HomeSections";
import { pending } from "@/lib/evidence";

export const metadata: Metadata = { alternates: { canonical: "/for/parents/" }, title: "For parents & guardians", description: "Your child doesn’t need another promise. They need an honest plan." };

const QUESTIONS = ["Is my child really at this level?", "Are we losing time?", "Should they stay in college — or leave?", "Which country?", "Is this trial worth the flight?", "Is this academy selling us a dream?", "Is this contract fair?", "What happens if the move doesn’t work out?"];
const QUIET = ["Are we pushing too hard?", "Are we not doing enough?"];
const EXPLAINERS = [
  { n: "01", t: "Europe is not one football market.", b: "“Europe” is dozens of football markets, each with its own level, calendar, registration rules, style and demand for players. A player who fits one may be completely wrong for another. The useful question isn’t “can my child play in Europe?” It’s which market, at which level, at which moment." },
  { n: "02", t: "A highlight reel can’t answer a career question.", b: "Highlights show the best moments. A career decision needs the rest: positioning, decisions without the ball, consistency over 90 minutes. That’s why the assessment requires a full match." },
  { n: "03", t: "Age, timing and the transfer window.", b: "Clubs register players in transfer windows. Arriving at the wrong moment can waste months. And for under-18s, international moves are tightly restricted by FIFA’s rules — an honest adviser explains that before anything else.", legal: true },
  { n: "04", t: "Passports change the map.", b: "An EU passport can open doors that are closed to non-EU players, and the rules differ by country and division. We assess what your child’s passport(s) actually mean — and where ancestry-based eligibility might be worth checking with a citizenship lawyer." },
  { n: "05", t: "Trials, academies and agents: check before you pay.", b: "Some opportunities are excellent. Some aren’t what they appear. European Pathway members get opportunity, trial, academy and agent vetting; the assessment itself tells you what to look for." },
  { n: "06", t: "A contract is a commitment.", b: "An offer is exciting. It’s also a legal document, with obligations, termination terms and consequences. Formal legal review is a separate service, engaged and billed separately.", e9: true },
];

export default function ParentsPage() {
  return (
    <>
      <PageHero eyebrow="For parents & guardians" title={<>Your child doesn’t need another promise. <span className="text-route">They need an honest plan.</span></>}
        lede="Behind many young players is a family trying to make the right decision without having all the information. European Pathway gives you that information — before the next expensive step.">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <ApplyCta label="Apply as a parent or guardian" />
          <Gate evidence={pending("E27", "contact channel")}><Link href="/faq" className="btn btn-ghost">Talk to us first</Link></Gate>
        </div>
      </PageHero>

      <Section tone="paper" label="The questions you're asking">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <Kicker>The questions you’re actually asking</Kicker>
            <ul className="space-y-3">{QUESTIONS.map((q) => <li key={q} className="display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.02]">{q}</li>)}</ul>
            <p className="mono mt-10 text-[0.72rem] uppercase tracking-[0.12em] text-ink/55">And the quiet ones</p>
            <ul className="mt-3 space-y-2">{QUIET.map((q) => <li key={q} className="display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.02] text-ink/45">{q}</li>)}</ul>
          </div>
          <div className="lg:pt-16">
            <p className="lede text-ink/80">These are serious questions. They deserve better than guesswork, sales pitches or a highlight reel.</p>
            <p className="display d-md mt-8">We don’t claim to know best. We help you decide with better information.</p>
            <p className="mt-8 text-ink/75">European Pathway is professional career assessment and advisory from a team working inside European football, led by FIFA Licensed Football Agent Marks Amosejevs. It doesn’t sell trials, it doesn’t contact clubs, and it isn’t representation. That’s exactly why it can be honest with you.</p>
          </div>
        </div>
      </Section>

      <Section tone="ink" label="Six things to understand before you decide">
        <div className="wrap">
          <Kicker>Six things to understand before you decide</Kicker>
          <div className="mt-6 grid gap-px bg-white/10 md:grid-cols-2">
            {EXPLAINERS.map((x) => (
              <details key={x.n} className="group bg-ink p-7 open:bg-ink-deep md:[&:not([open])]:min-h-[180px]" open>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6"><span><span className="display block text-[clamp(1.5rem,2.4vw,2rem)] leading-none">{x.t}</span></span><span className="mt-6 text-route transition-transform group-open:rotate-45" aria-hidden>+</span></summary>
                <p className="mt-4 leading-relaxed text-white/80">{x.b}</p>
                {x.legal && <Gate evidence={{ state: "pending", ref: "LEGAL" }} label="minors wording — football-lawyer review" className="mt-3"><span className="text-[0.8rem] text-white/50">FIFA RSTP Art. 19 reference to be legally checked.</span></Gate>}
                {x.e9 && <p className="mt-3 text-[0.9rem] text-white/70"><Pending evidence={pending("E9")}>Legal services provided by [law practice].</Pending></p>}
              </details>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="deep" label="Assessment versus promise">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Kicker>Paying for an assessment is not paying for a promise</Kicker>
            <h2 className="display d-lg">We’re not paid to say “go.”</h2>
            <p className="lede mt-6 text-white/80">Much of the pathway industry charges for access: a trial, a showcase, a residency. You pay, and the answer is usually “go.” We charge for a professional view — so the answer can be whatever is true.</p>
            <p className="mt-6 border-l-2 border-route pl-5 text-white/90">If our view is that a particular opportunity isn’t worth your money, that view is part of what you paid for.</p>
          </div>
          <ul className="grid gap-3">
            {decisions.filter((d) => d.parent).map((d) => <li key={d.key} className="border border-white/15 p-6"><p className="display text-[2.2rem] leading-none text-route">{d.label}</p><p className="mt-2 text-white/80">{d.parent}</p></li>)}
          </ul>
        </div>
      </Section>

      <Section tone="paper" label="Who reviews your child">
        <div className="wrap">
          <Kicker>Who reviews your child</Kicker>
          <h2 className="display d-lg max-w-[18ch]">A professional team, led by a FIFA Licensed Football Agent.</h2>
          <p className="lede mt-6 max-w-3xl text-ink/80">Your child is assessed by a professional team working inside European football, led by FIFA Licensed Football Agent Marks Amosejevs, who is <Pending evidence={pending("E19")}>authorised to represent minors</Pending>. Every assessment follows our professional framework and receives senior review. <Pending evidence={pending("E13", "Who performs which step")}>[Final workflow wording]</Pending></p>
          <div className="mt-12 max-w-5xl"><TeamGrid tone="paper" /></div>
        </div>
      </Section>

      <Section tone="ink" label="What you receive and how we communicate">
        <div className="wrap grid gap-14 lg:grid-cols-3">
          <div><p className="eyebrow text-route">What you receive</p><ul className="mt-5 space-y-2.5">{RECEIVE.slice(0, 9).map((r) => <li key={r} className="flex gap-3 text-white/85"><span className="mt-2 h-[5px] w-[5px] shrink-0 bg-route" />{r}</li>)}</ul><p className="mt-4 text-white/70">You’re welcome to join the review call.</p></div>
          <div><p className="eyebrow text-route">How we communicate with families</p><ul className="mt-5 space-y-3 text-white/85"><li>Under 18: the parent or guardian applies, pays and is copied on communication.</li><li>You’re welcome on every call.</li><li>Programme families get a quarterly parent update call.</li></ul></div>
          <div><p className="eyebrow text-route">What we will never do</p><ul className="mt-5 space-y-3 text-white/85"><li>Promise a trial, a club or a contract.</li><li>Contact clubs about your child as part of European Pathway.</li><li>Sell representation.</li><li><Pending evidence={pending("E26", "no-commission policy")}>Take commissions from academies or trial operators.</Pending></li></ul></div>
        </div>
      </Section>

      <Section tone="paper" label="Worked example">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div><Kicker>How an assessment reasons</Kicker><h2 className="display d-lg">Europe or college at 17?</h2><p className="mt-5 text-ink/75">A worked example with a fictional player — so you can see the thinking before you pay for it.</p></div>
          <WorkedExampleCard x={workedExamples[2]} />
        </div>
      </Section>

      <Section tone="deep" label="If the answer is not yet">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div><h2 className="display d-lg">If the answer is “not yet.”</h2><p className="lede mt-6 text-white/80">Then you’ll know why, what needs to change, and what a realistic path looks like — before you spend on the wrong thing. For many families, that clarity is the most valuable part.</p></div>
          <ol className="space-y-6">{[["You read the report and join the call.", ""], ["If European Pathway makes sense, we explain why.", "And if it doesn’t, we tell you that."], ["$399 per month, paid monthly — never six months upfront.", "Designed as a 6-month pathway. Cancellation options available — final subscription terms apply."]].map(([t, b], i) => <li key={t} className="grid grid-cols-[2.5rem_1fr]"><span className="mono text-route">0{i + 1}</span><div><p className="text-[1.1rem] font-semibold">{t}</p>{b && <p className="text-white/70">{b}</p>}</div></li>)}</ol>
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
