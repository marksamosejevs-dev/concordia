import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta } from "@/components/ui/Cta";
import { TeamSection } from "@/components/home/TeamSection";
import { JourneyCompact } from "@/components/funnel/JourneyCompact";
import { FinalCta } from "@/components/sections/HomeSections";
import { ASSESSMENT_POINTS } from "@/content/pathway";
import { CREDIT_LINE } from "@/content/commerce";
import { CONTACT, LICENCE } from "@/content/site";

export const metadata: Metadata = { alternates: { canonical: "/for/parents" }, title: "For parents & guardians", description: "What you pay for, what we don’t promise, how under-18s are handled and who your child will speak to." };

const NOT_PROMISED = ["A club, trial, contract or transfer", "Representation by Concordia Sports Agency", "A scholarship, visa or work permit", "That Europe is the right answer right now"];
const FAQ: [string, string][] = [
  ["Can I be involved?", "Yes. For players under 18 the parent or guardian applies with them, is our main contact, pays, and is copied on every email. You’re welcome on every call — for older players too, if they want you there."],
  ["Is this legitimate?", `Concordia Soccer · European Pathway is a project of Concordia Sports Agency SIA, a registered Latvian company. The work is led by ${LICENCE.holder}, a FIFA Licensed Football Agent (licence ${LICENCE.number}) authorised to represent minors.`],
  ["Do you contact clubs about my child?", "No. The Pathway Assessment and European Pathway are advisory. Any football-agent representation would be a separate, written agreement under FIFA’s rules — it is never bought with a Pathway service."],
  ["What does it cost?", "Applying is free. If accepted, the Pathway Assessment is $249, paid once. European Pathway, if it makes sense afterwards, is $399/month — designed as a 6-month pathway, paid monthly."],
];

export default function ParentsPage() {
  return (
    <>
      <PageHero eyebrow="For parents & guardians" title={<>Your child doesn’t need another promise. <span className="text-route">They need an honest plan.</span></>}
        lede="Professional assessment and clear information — before your family makes bigger football decisions.">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <ApplyCta label="Apply as a parent or guardian" micro={false} />
          <a href={`mailto:${CONTACT.email}?subject=Question%20from%20a%20parent`} className="btn btn-ghost">Ask us a question</a>
        </div>
      </PageHero>

      <Section tone="paper" label="What you are paying for">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <Kicker>What you’re paying for</Kicker>
            <h2 className="display d-lg max-w-[16ch]">An assessment — not a promise.</h2>
            <p className="lede mt-6 text-ink/80">You are not paying for a promise of a professional contract. You are paying for a professional assessment, honest information and a clear plan before making much bigger football decisions.</p>
            <ul className="mt-6 flex flex-wrap gap-2">{ASSESSMENT_POINTS.map((p) => <li key={p} className="rounded-full border border-ink/15 bg-white px-3.5 py-2 text-[0.9rem] font-semibold">{p}</li>)}</ul>
          </div>
          <div className="lg:pt-14">
            <p className="eyebrow text-ink/60">What we don’t promise</p>
            <ul className="mt-4 space-y-2">{NOT_PROMISED.map((x) => <li key={x} className="flex gap-3 text-[1.05rem]"><span aria-hidden className="text-route-deep">×</span>{x}</li>)}</ul>
            <p className="mt-6 text-ink/70">If the honest answer is “not yet”, you’ll know why and what would need to change — before spending on the wrong thing.</p>
          </div>
        </div>
      </Section>

      <Section tone="ink" label="What happens after applying">
        <div className="wrap">
          <Kicker>What happens next</Kicker>
          <h2 className="display d-lg max-w-[18ch]">Five steps. Nothing to pay until you’re accepted.</h2>
          <JourneyCompact className="mt-10" />
          <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div><p className="display text-[2.4rem] leading-none text-route">Free</p><p className="mt-1 text-white/75">Application</p></div>
            <div><p className="display text-[2.4rem] leading-none text-route">$249</p><p className="mt-1 text-white/75">Pathway Assessment, if accepted — paid once</p></div>
            <div><p className="display text-[2.4rem] leading-none text-route">$399<span className="text-[1.2rem]">/mo</span></p><p className="mt-1 text-white/75">European Pathway, only if it makes sense — paid monthly</p></div>
          </div>
          <p className="mt-6 max-w-3xl text-[0.92rem] text-white/65">{CREDIT_LINE}</p>
        </div>
      </Section>

      <TeamSection sectionId="people" title="Who your child will speak to." intro={`A professional team working inside European football, led by FIFA Licensed Football Agent ${LICENCE.holder}.`} aboutLink={false} />

      <Section tone="deep" label="Under 18">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Under 18</Kicker>
            <h2 className="display d-lg max-w-[16ch]">Parents are part of it — not copied in afterwards.</h2>
          </div>
          <ul className="space-y-4 text-white/85">
            <li>Pathway Assessments start at age 16. For anyone under 18, a parent or legal guardian applies with the player, consents, pays and is our main contact.</li>
            <li>We copy the parent or guardian on every email and welcome them on every call.</li>
            <li>International moves for under-18s are tightly restricted by FIFA’s rules. We explain what that means for your child before anything else.</li>
            <li><Link href="/legal/minors" className="underline underline-offset-4">How we work with minors</Link> · <Link href="/legal/privacy" className="underline underline-offset-4">Privacy</Link></li>
          </ul>
        </div>
      </Section>

      <Section tone="paper" label="Questions parents ask">
        <div className="wrap max-w-4xl">
          <Kicker>Questions parents ask</Kicker>
          <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {FAQ.map(([q, a]) => <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.15rem] font-bold">{q}<span aria-hidden className="text-route-deep transition-transform group-open:rotate-45">+</span></summary><p className="mt-3 text-ink/80">{a}</p></details>)}
          </div>
          <p className="mt-6 text-ink/70">More questions? <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">{CONTACT.email}</a></p>
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
