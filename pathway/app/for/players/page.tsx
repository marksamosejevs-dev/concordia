import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta, GhostLink, TextLink } from "@/components/ui/Cta";
import { RECEIVE, NOT_RECEIVE } from "@/content/assessment";
import { workedExamples } from "@/content/cases";
import { WorkedExampleCard } from "@/components/cards/CaseCards";
import { DecisionSet } from "@/components/sections/DecisionSet";
import { FinalCta } from "@/components/sections/HomeSections";
import { NineThings } from "./NineThings";

export const metadata: Metadata = { title: "For players", description: "You sent the reel. You sent the DMs. Nobody replied. That doesn’t tell you what to do next." };

export default function PlayersPage() {
  return (
    <>
      <PageHero eyebrow="For players" title={<>You sent the reel. You sent the DMs. Nobody replied. <span className="text-route">That doesn’t tell you what to do next.</span></>}
        lede="Silence isn’t feedback. It doesn’t say you’re not good enough — it says nothing at all. The assessment replaces guessing with a professional read on what’s actually going on.">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start"><ApplyCta /><GhostLink href="/find-your-path">Find your path — 2 min</GhostLink></div>
      </PageHero>
      <Section tone="paper" label="Nine things">
        <div className="wrap">
          <Kicker>Nine things that decide whether a club looks twice</Kicker>
          <h2 className="display d-lg max-w-[16ch]">Talent matters. It’s also only one of these.</h2>
          <NineThings />
          <p className="lede mt-10 text-ink/80">Most players only ever work on one of these. The assessment looks at all nine.</p>
        </div>
      </Section>
      <Section tone="ink" label="Stop guessing">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div><h2 className="display d-xl">Stop guessing which level you belong at.</h2><p className="lede mt-6 text-white/80">You’ll get a realistic level range — with the reasoning — three market directions, and a 90-day plan.</p><div className="mt-8"><TextLink href="/assessment#sample">See a sample report</TextLink></div></div>
          <WorkedExampleCard x={workedExamples[0]} />
        </div>
      </Section>
      <DecisionSet intro={false} />
      <Section tone="paper" label="Big ambition honest advice">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div><h2 className="display d-xl">Big ambition. Honest advice.</h2><p className="lede mt-6 text-ink/80">We take your ambition seriously. That’s exactly why we won’t tell you what you want to hear. If you’re ready, you’ll know where to aim. If you’re not, you’ll know what to fix.</p></div>
          <div className="grid gap-10 sm:grid-cols-2">
            <div><p className="eyebrow">You get</p><ul className="mt-4 space-y-2 text-[0.95rem]">{RECEIVE.slice(0, 8).map((r) => <li key={r}>— {r}</li>)}</ul></div>
            <div><p className="eyebrow text-ink/60">You don’t get</p><ul className="mt-4 space-y-2 text-[0.95rem]">{NOT_RECEIVE.map((r) => <li key={r.t} className="font-semibold">{r.t}</li>)}</ul></div>
          </div>
        </div>
      </Section>
      <Section tone="ink" label="Next 90 days" className="!py-20">
        <div className="wrap flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="display d-xl max-w-[14ch]">Your next 90 days should have a plan.</h2>
          <ApplyCta />
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
