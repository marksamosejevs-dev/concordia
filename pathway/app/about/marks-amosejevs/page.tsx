import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Pending } from "@/components/ui/Gate";
import { DocFigure } from "@/components/cards/DocFigure";
import { Portrait } from "@/components/team/Portrait";
import { VerifyLedger } from "@/components/verify/VerifyLedger";
import { InsideFootballStrip, FinalCta } from "@/components/sections/HomeSections";
import { photos } from "@/content/photos";
import { LICENCE } from "@/content/site";
import { pending } from "@/lib/evidence";

export const metadata: Metadata = { alternates: { canonical: "/about/marks-amosejevs/" }, title: "Marks Amosejevs — Co-Founder & CEO", description: "The professional behind the assessment framework: FIFA Licensed Football Agent, Co-Founder & CEO of Concordia Soccer." };

type Ch = { n: string; t: string; body: React.ReactNode; so: string; photo?: keyof typeof photos };
const CHAPTERS: Ch[] = [
  { n: "01", t: "Law", body: <>Before football, there was law. Marks trained as a <Pending evidence={pending("E6")}>lawyer</Pending> and holds a <Pending evidence={pending("E7")}>Master’s degree in International and European Law</Pending>.</>, so: "A football opportunity is also a legal and career decision. He reads the offer, not just the badge on it." },
  { n: "02", t: "Inside football", body: <>Marks co-founded Concordia Sports Agency, a professional football agency representing players from established internationals to young players starting their careers.</>, so: "The assessment is informed by real player moves — what clubs look at before they say yes, and before they say no.", photo: "office" },
  { n: "03", t: "The licence", body: <>He is a FIFA Licensed Football Agent, licence number {LICENCE.number}.</>, so: "You can check who leads the team behind the methodology — in about a minute." },
  { n: "04", t: "Young players", body: <>His licence records <Pending evidence={pending("E19")}>authorisation to represent minors</Pending>.</>, so: "For families of under-18s: the rules that protect young players are rules he is authorised to work within." },
  { n: "05", t: "When things go wrong", body: <><Pending evidence={pending("E8")}>As Co-Founder and Chairman of the Latvian Professional Footballers Association</Pending>, his work includes supporting players with employment rights, contract problems, disputes with clubs, difficult intermediary relationships — and situations where a player simply needed someone independent in their corner.</>, so: "We’ve seen the signing photo. We’ve also seen what happens after it. That’s why he checks before you sign.", photo: "associationFrame" },
  { n: "06", t: "Still learning", body: <>Passing the licence exam is where many agents stop. Marks keeps attending FIFA’s professional education for football agents <Pending evidence={pending("E3")}>[programme · edition · year]</Pending> — to stay current, exchange experience with agents and club professionals, and keep the relationships that make market knowledge real.</>, so: "The licence is a credential. Continuing to learn is a standard. This is education he completed — not an endorsement by FIFA.", photo: "certificate" },
  { n: "07", t: "Europe is not one market", body: <>Concordia’s experience and professional relationships span football markets across Europe and beyond.</>, so: "Spain is not Poland. The assessment recommends markets — not just “Europe”.", photo: "boardroom" },
  { n: "08", t: "The person, not the profile", body: <>A football career is a rejection email on a Tuesday, a season on the bench, an injury at the wrong moment, a new country a long flight from home. We’re not psychologists, and we don’t pretend to be. But the right advice depends on the person, not just the profile.</>, so: "Sometimes the right next step is another opportunity. Sometimes it’s patience." },
  { n: "09", t: "Why European Pathway exists", body: <>The agency represents a small number of players. But the questions it answers every day — what level, which market, what timing, what contract? — are questions thousands of players face without anyone to ask. European Pathway makes that professional thinking available beyond the agency’s roster, led by Marks and delivered by a team.</>, so: "It is advisory, not representation." },
];

export default function MarksPage() {
  return (
    <>
      <PageHero eyebrow="Co-Founder & CEO · FIFA Licensed Football Agent" title={<>Marks Amosejevs. <span className="text-route">The professional behind the assessment.</span></>}
        lede="This page isn’t a CV. It answers one question: why should a player or a parent listen to this person about a football career?" />
      <Section tone="paper" label="Portrait" className="!py-14">
        <div className="wrap grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <Portrait name="Marks Amosejevs" crop="desktopPortrait" />
          <div>
            <p className="display d-md">Built, leads and provides senior professional oversight of European Pathway.</p>
            <p className="mt-5 text-ink/75">Marks shapes the assessment methodology and handles escalation where senior football-agent judgement is required. The service is delivered by a team.</p>
          </div>
        </div>
      </Section>
      {CHAPTERS.map((c, i) => (
        <Section key={c.n} tone={i % 2 ? "deep" : "ink"} label={c.t} className="!py-[clamp(3.5rem,8vw,6rem)]">
          <div className={`wrap grid gap-10 ${c.photo ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}`}>
            <div>
              
              <h2 className="display d-lg mt-2">{c.t}</h2>
              <p className="lede mt-6 max-w-2xl text-white/85">{c.body}</p>
              <p className="mt-8 max-w-2xl border-l-2 border-route pl-5 text-[1.05rem] text-white"><span className="mono mr-2 text-[0.65rem] uppercase tracking-[0.12em] text-slate-light">So what</span>{c.so}</p>
            </div>
            {c.photo && <DocFigure photo={photos[c.photo]} className="relative mx-auto w-full max-w-[460px]" ratio={photos[c.photo].w > photos[c.photo].h ? undefined : "4/5"} />}
          </div>
        </Section>
      ))}
      <Section tone="paper" label="Verify">
        <div className="wrap"><div className="on-ink p-6 sm:p-8"><h2 className="display d-md mb-6">Don’t just trust us. Verify us.</h2><VerifyLedger mode="full" exclude={["lawyer", "llm"]} /></div></div>
      </Section>
      <Section tone="ink" label="Documentary"><div className="wrap"><h2 className="display d-lg mb-10">Inside European football.</h2><InsideFootballStrip /></div></Section>
      <FinalCta />
    </>
  );
}
