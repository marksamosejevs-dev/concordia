import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { WorkedExampleCard, AgencyCaseCard } from "@/components/cards/CaseCards";
import { workedExamples, agencyCases } from "@/content/cases";
import { TestimonialsSection, FinalCta } from "@/components/sections/HomeSections";

export const metadata: Metadata = { alternates: { canonical: "/careers" }, title: "Real careers. Real decisions.", description: "Concordia Sports Agency cases, clearly labelled — and worked examples showing how a European Pathway assessment reasons." };

export default function CareersPage() {
  return (
    <>
      <PageHero eyebrow="Real careers. Real decisions." title={<>Success isn’t always a signing photo.</>} lede="Two kinds of story, never mixed: real representation work from Concordia Sports Agency, and worked examples with fictional players that show how a European Pathway assessment reasons. No outcome shown is typical or guaranteed." />
      <Section tone="ink" label="Legend" className="!py-10">
        <div className="wrap grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 border border-white/20 bg-ink-deep p-4"><span className="bg-white px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink">Concordia Sports Agency case</span><span className="text-[0.85rem] text-white/75">Real representation work. Not a Pathway result.</span></div>
          <div className="on-paper flex items-center gap-4 border-2 border-dashed border-ink/50 p-4"><span className="border-2 border-dashed border-ink px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]">Worked example — fictional player</span><span className="text-[0.85rem] text-ink/75">Illustrative reasoning. Not a real person.</span></div>
        </div>
      </Section>
      <Section tone="paper" label="Worked examples" className="!pt-10">
        <div className="wrap"><Kicker>Worked examples — fictional players</Kicker><div className="grid gap-6 lg:grid-cols-3">{workedExamples.map((x) => <WorkedExampleCard key={x.slug} x={x} />)}</div></div>
      </Section>
      <Section tone="ink" label="Agency cases">
        <div className="wrap"><Kicker>Concordia Sports Agency cases</Kicker><div className="grid gap-6 lg:grid-cols-3">{agencyCases.map((c) => <AgencyCaseCard key={c.slug} c={c} />)}</div></div>
      </Section>
      <div id="testimonials"><TestimonialsSection /></div>
      <FinalCta />
    </>
  );
}
