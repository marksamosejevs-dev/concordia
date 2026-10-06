import Link from "next/link";
import { FinalOffer } from "@/components/home/HomeV2";
import { Section, Eyebrow, Kicker } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ApplyCta, GhostLink, TextLink } from "@/components/ui/Cta";
import { Gate, Pending } from "@/components/ui/Gate";
import { ForAudience } from "@/components/layout/Audience";
import { TeamGrid } from "@/components/team/TeamGrid";
import { VerifyLedger } from "@/components/verify/VerifyLedger";
import { DocFigure } from "@/components/cards/DocFigure";
import { WorkedExampleCard, AgencyCaseCard } from "@/components/cards/CaseCards";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { PriceCard } from "@/components/cards/PriceCard";
import { ReportViewer } from "@/components/report/ReportViewer";
import { EuropeOutline } from "@/components/route/EuropeOutline";
import { SplitFlap } from "./SplitFlap";
import { ASSESSMENT_STEPS, RECEIVE, NOT_RECEIVE } from "@/content/assessment";
import { photos, insideFootballStrip } from "@/content/photos";
import { workedExamples, agencyCases } from "@/content/cases";
import { agencyPlayers } from "@/content/agency-players";
import { products, programmeFor, product, ASSESSMENT_CREDIT, LADDER } from "@/content/products";
import { faq } from "@/content/faq";
import { testimonials } from "@/content/testimonials";
import { BRAND } from "@/content/site";
import { usd } from "@/lib/format";
import { pending } from "@/lib/evidence";

/* 02 — The silence */
export function Silence() {
  const msgs = ["Hi, I’m a left-back finishing my senior season. Highlights attached…", "Hello coach, would you consider me for a trial in January?", "Dear agent, I’m looking for representation in Europe. My reel:"];
  return (
    <Section tone="ink" label="The silence">
      <div className="wrap grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Kicker n="02">The problem</Kicker>
          <h2 className="display d-xl">You sent the reel. You sent the DMs. <span className="text-slate">Nobody replied.</span></h2>
          <ForAudience
            player={<p className="lede mt-8 max-w-xl text-white/80">Emails to clubs. Messages to agents. A highlight video you’re proud of. Then nothing. Silence feels like a verdict. It isn’t. It doesn’t tell you whether the problem is your level, your market, your timing, your footage or the way you approached people.</p>}
            parent={<p className="lede mt-8 max-w-xl text-white/80">Your child has done everything they were told to do. The messages go out. Nothing comes back. And you’re left guessing what that silence means — and what to spend money on next.</p>}
          />
          <p className="display d-sm mt-10 max-w-xl text-route">It’s rarely just about talent. It’s level, market, timing and approach — and you can’t fix what nobody has diagnosed.</p>
        </div>
        <div className="mx-auto w-full max-w-sm rounded-[28px] border border-white/15 bg-ink-deep p-4 shadow-2xl" aria-label="Illustration: outgoing messages with no replies">
          <div className="mono mb-4 flex justify-between px-2 text-[0.65rem] text-slate"><span>Outbox</span><span>0 replies</span></div>
          <div className="space-y-3">
            {[...msgs, ...msgs.slice(0, 2)].map((m, i) => (
              <Reveal key={i} delay={i * 140} className="ml-auto max-w-[85%]">
                <div className="rounded-2xl rounded-br-sm bg-blue px-4 py-3 text-[0.82rem] leading-snug">{m}</div>
                <p className="mono mt-1 text-right text-[0.58rem] text-slate">Delivered</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 04 — Built inside football. Led by people who work in it. */
export function BuiltInsideFootball() {
  return (
    <Section tone="paper" label="Who is behind this" className="!pb-0">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <Kicker n="04">Who is behind this</Kicker>
            <h2 className="display d-xl max-w-[13ch]">Built inside football. Led by people who work in it.</h2>
            <p className="lede mt-8 max-w-2xl">European Pathway is run by a professional team working inside European football, led by FIFA Licensed Football Agent Marks Amosejevs — Co-Founder &amp; CEO, <Pending evidence={pending("E6")}>lawyer</Pending>, and <Pending evidence={pending("E8")}>Co-Founder &amp; Chairman of the Latvian Professional Footballers Association</Pending>.</p>
            <p className="body mt-5 max-w-2xl text-ink/75">Every assessment follows Concordia’s professional assessment framework and receives senior review. That combination — real player work, player-rights experience, legal training and continuing professional education — is why the assessment looks past the highlight reel.</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3"><TextLink href="/about">Meet the team</TextLink><TextLink href="/about/marks-amosejevs">Read Marks’s story</TextLink></div>
          </div>
          <DocFigure photo={photos.pitch} ratio="4/5" captionTone="dark" className="relative mx-auto w-full max-w-[420px]" />
        </div>
        <div className="mt-20 max-w-5xl"><TeamGrid tone="paper" /></div>
      </div>
      <div className="on-ink mt-24 py-14">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <p className="display d-md">{BRAND.trustLine}</p>
            <TextLink href="/verify">Every credential, with evidence</TextLink>
          </div>
          <VerifyLedger mode="compact" />
        </div>
      </div>
    </Section>
  );
}

/* 05 — The Assessment */
export function AssessmentProduct() {
  return (
    <Section tone="ink" label="The assessment" className="!pb-12">
      <div className="wrap">
        <Kicker n="05">Player Pathway Assessment · $249</Kicker>
        <h2 className="display d-xl max-w-[16ch]">You don’t pay $249 for an opinion. <span className="text-route">You get a professional career assessment.</span></h2>
        <p className="lede mt-6 max-w-2xl text-white/80">A structured, written answer to one question: what should you actually do with your football career next?</p>
        <ol className="mt-16 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {ASSESSMENT_STEPS.map((s, i) => (
            <li key={s.n} className={`relative bg-ink p-6 ${i === 9 ? "bg-route text-ink" : ""}`}>
              <span className={`mono text-[0.7rem] ${i === 9 ? "text-ink/70" : "text-route"}`}>{s.n}</span>
              <p className="display mt-3 text-[1.45rem] leading-none">{s.title}</p>
              <p className={`mt-3 text-[0.86rem] leading-relaxed ${i === 9 ? "text-ink/80" : "text-white/70"}`}>{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 grid gap-12 lg:grid-cols-2" data-hide-sticky>
          <div>
            <p className="eyebrow text-route">What you receive</p>
            <ul className="mt-6 space-y-3">{RECEIVE.map((r) => <li key={r} className="flex gap-3 text-[1rem]"><span className="mt-[0.55em] inline-block h-[6px] w-[6px] shrink-0 bg-route" />{r === RECEIVE[RECEIVE.length - 1] ? <Pending evidence={pending("E13", "Exact sign-off wording")}>{r}</Pending> : r}</li>)}</ul>
          </div>
          <div>
            <p className="eyebrow text-slate-light">What you don’t receive — and why that matters</p>
            <ul className="mt-6 space-y-4">{NOT_RECEIVE.map((r) => <li key={r.t}><p className="font-bold">{r.t}</p><p className="text-[0.95rem] text-white/70">{r.b}</p></li>)}</ul>
            <p className="display d-sm mt-8 text-route">We’d rather tell you Europe isn’t the right move today than sell you a trial you don’t need.</p>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ApplyCta />
          <p className="mono text-[0.72rem] text-slate-light sm:ml-6">Report within 7 business days · ${ASSESSMENT_CREDIT.amount} credited toward European Pathway if you continue within {ASSESSMENT_CREDIT.days} days</p>
        </div>
      </div>
    </Section>
  );
}

/* 06 — Report preview */
export function ReportPreview() {
  return (
    <Section tone="deep" label="Sample assessment">
      <div className="wrap">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker n="06">Sample assessment · Illustrative example</Kicker>
            <h2 className="display d-xl">See what you’re buying.</h2>
            <p className="lede mt-5 max-w-2xl text-white/80">Five pages from a sample assessment. The player is fictional; the structure, depth and format are what you receive.</p>
          </div>
        </div>
        <ReportViewer />
      </div>
    </Section>
  );
}

/* 07 — Success, redefined */
export function SuccessRedefined() {
  return (
    <Section tone="ink" label="Success, redefined">
      <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Kicker n="07">What success looks like</Kicker>
          <h2 className="display d-xl">Success isn’t always a signing photo.</h2>
          <p className="lede mt-6 text-white/80">Sign. Transfer. Move up. Sometimes that’s the right outcome. Often, success looks different.</p>
          <p className="mt-10 border-l-2 border-route pl-5 text-[1.05rem] leading-relaxed text-white/90">If our professional view is that you shouldn’t spend money on a particular opportunity, that view may be the most valuable thing the assessment gives you.</p>
        </div>
        <SplitFlap />
      </div>
    </Section>
  );
}

/* 08 — Europe is not one market */
export function MarketsTeaser() {
  return (
    <Section tone="deep" label="Europe is not one market" className="min-h-[80vh]">
      <EuropeOutline className="absolute inset-0 h-full w-full opacity-60" highlight={["ES", "PL", "BE", "SE", "IT", "CZ"]} />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-deep via-ink-deep/85 to-transparent" aria-hidden />
      <div className="wrap relative">
        <Kicker n="08">Markets</Kicker>
        <h2 className="display d-xl max-w-[12ch]">Europe is not one football market.</h2>
        <p className="display d-sm mt-6 text-slate-light">Spain is not Poland. Belgium is not Sweden. Italy is not Czechia.</p>
        <p className="lede mt-8 max-w-xl text-white/85">Each market has its own level, calendar, registration rules, style and demand for different profiles. So the question was never “can I play in Europe?” It’s:</p>
        <p className="display d-md mt-6 max-w-[20ch] text-route">Which market, at which level, at which moment, makes sense for me?</p>
        <p className="body mt-6 max-w-xl text-white/70">Concordia’s experience and professional relationships span football markets across Europe and beyond. That’s why the assessment recommends markets — not just “Europe” — and why we won’t tell you to send your highlights to every club on the continent.</p>
        <div className="mt-10"><GhostLink href="/markets">Explore the markets</GhostLink></div>
      </div>
    </Section>
  );
}

/* 09 — Find your path teaser */
export function FindPathTeaser() {
  return (
    <Section tone="paper" label="Find your path" className="!py-20">
      <div className="wrap flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div>
          <Kicker n="09">Find your path</Kicker>
          <h2 className="display d-lg">Where should you start?</h2>
          <p className="lede mt-4 max-w-xl text-ink/75">Ten quick questions about your age, level, footage, passports and goals. You’ll get a recommended next step — not a verdict on your talent.</p>
        </div>
        <Link href="/find-your-path" className="btn btn-ink">Start — 2 minutes <span className="arrow">→</span></Link>
      </div>
    </Section>
  );
}

/* 10 — After the assessment */
export function ProgrammesSection() {
  const order = ["window", "two-window", "cohort", "elite"];
  return (
    <Section tone="ink" label="After the assessment">
      <div className="wrap">
        <Kicker n="10">After the assessment</Kicker>
        <h2 className="display d-xl max-w-[18ch]">The assessment tells you where you are. <span className="text-route">A programme helps you act on it.</span></h2>
        <ol className="mt-16 grid gap-px bg-white/10 md:grid-cols-3 lg:grid-cols-6" aria-label="The European Pathway product ladder">
          {LADDER.map((l, i) => (
            <li key={l.step} className={`relative bg-ink p-5 ${i === 5 ? "bg-ink-deep" : ""}`}>
              {i < 5 && <span className="absolute right-0 top-8 hidden h-[2px] w-5 translate-x-1/2 bg-route lg:block" aria-hidden />}
              <p className={`mono text-[0.68rem] ${i === 5 ? "text-white" : "text-route"}`}>{String(i + 1).padStart(2, "0")} · {l.price}</p>
              <p className="display mt-3 text-[1.3rem] leading-none">{l.step}</p>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-white/70">{l.answers}</p>
              {i === 5 && <p className="mono mt-3 border-t border-white/15 pt-2 text-[0.6rem] uppercase tracking-[0.1em] text-slate-light">Separate agreement</p>}
            </li>
          ))}
        </ol>
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="border border-white/15 p-7"><p className="eyebrow text-slate-light">Assessment</p><p className="display d-sm mt-3">Diagnosis and direction</p><p className="mt-3 text-white/75">Where am I? What level and markets make sense? What should I do next?</p></div>
          <div className="border border-route/60 p-7"><p className="eyebrow text-route">Programme</p><p className="display d-sm mt-3">Execution, review and decision support</p><p className="mt-3 text-white/75">What do I do this month? What changes as the window approaches? Is this opportunity worth it? What if nothing happens?</p></div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {order.map((id) => <PriceCard key={id} p={product(id)} c={programmeFor(id)} featured={id === "window"} limit={4} />)}
        </div>
        <p className="mt-8 max-w-2xl text-[0.95rem] text-white/70">Programmes are offered after the assessment, when they make sense for you. Sometimes they don’t — and we’ll say so. <Link href="/programmes" className="underline underline-offset-4">Compare programmes</Link>.</p>
      </div>
    </Section>
  );
}

/* 11 — Real careers */
export function CasesSection() {
  return (
    <Section tone="paper" label="Real careers">
      <div className="wrap">
        <Kicker n="11">Real careers. Real decisions.</Kicker>
        <h2 className="display d-xl max-w-[16ch]">Real work, clearly labelled.</h2>
        <p className="lede mt-5 max-w-2xl text-ink/75">Real representation work from Concordia Sports Agency — and worked examples that show how a European Pathway assessment reasons. No outcome shown is typical or guaranteed.</p>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {workedExamples.slice(0, 2).map((x) => <WorkedExampleCard key={x.slug} x={x} compact />)}
          <div className="on-ink">{agencyCases.map((c) => <AgencyCaseCard key={c.slug} c={c} />)}</div>
        </div>
        <div className="mt-10"><Link href="/careers" className="btn btn-ink">See all careers and examples <span className="arrow">→</span></Link></div>
      </div>
    </Section>
  );
}

/* 12 — Agency players */
export function AgencyPlayersRail() {
  return (
    <Section tone="ink" label="Players represented by Concordia Sports Agency">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker n="12">Concordia Sports Agency</Kicker>
            <h2 className="display d-xl">Careers our Agency works on.</h2>
            <p className="lede mt-5 max-w-2xl text-white/80">Professional players represented by Concordia Sports Agency — from established internationals to young players starting out. Their experience informs how we think about football careers.</p>
          </div>
          <TextLink href="/players">See the players</TextLink>
        </div>
        <div className="rail -mx-[var(--gutter)] mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4">
          {agencyPlayers.map((p) => <div key={p.slug} className="w-[68%] shrink-0 snap-start sm:w-[38%] lg:w-[23%]"><PlayerCard p={p} /></div>)}
        </div>
        <p className="mt-8 max-w-3xl border-l-2 border-white/30 pl-5 text-[0.9rem] text-white/70">These players are represented by Concordia Sports Agency. They did not necessarily take part in European Pathway, and buying a Pathway product does not make you a represented player.</p>
      </div>
    </Section>
  );
}

/* 13 — Know what you're getting into */
export function KnowWhatYouGetInto() {
  const notes = [
    { clause: "7.2 Termination for sporting reasons", note: "What counts as ‘sporting reasons’ — and who decides?" },
    { clause: "4.1 Term", note: "How long are you committing — and what happens if the coach changes?" },
    { clause: "11.3 Intermediary", note: "Who is the intermediary, and what’s their arrangement?" },
  ];
  return (
    <Section tone="deep" label="Know what you're getting into">
      <div className="wrap grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <Kicker n="13">Player rights · contracts</Kicker>
          <h2 className="display d-xl">Know what you’re getting into.</h2>
          <p className="display d-sm mt-6 text-route">We’ve seen the signing photo. We’ve also seen what happens after it.</p>
          <p className="lede mt-6 text-white/80"><Pending evidence={pending("E8")}>Through his work with the Latvian Professional Footballers Association, Marks has supported players with employment rights, contract problems, disputes with clubs and difficult intermediary relationships.</Pending> That’s why every assessment and programme looks beyond the club badge — at the commitment, the environment and the fine print.</p>
          <p className="mt-6 text-[0.9rem] text-white/60">European Pathway is career advisory and does not create a lawyer–client relationship. Formal legal services are engaged and billed separately. <Pending evidence={pending("E9")}>[Law practice]</Pending></p>
          <div className="mt-8"><TextLink href="/football-law">Football law</TextLink></div>
        </div>
        <div className="on-paper relative p-7 sm:p-10" aria-label="Illustration: annotated contract clauses (fictional text)">
          <p className="mono mb-6 text-[0.62rem] uppercase tracking-[0.14em] text-ink/50">Illustrative clauses — fictional text</p>
          {notes.map((n, i) => (
            <Reveal key={n.clause} delay={i * 200} className="mb-6 border-b border-ink/10 pb-6 last:mb-0 last:border-0 last:pb-0">
              <p className="font-mono text-[0.85rem] text-ink/80"><span className="bg-route/60 px-1">{n.clause}</span> The Club may terminate this Agreement upon written notice where …</p>
              <p className="mt-2 flex gap-2 text-[0.92rem] font-semibold text-ink"><span className="text-route-deep">↳</span>{n.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* 14 — Pricing */
export function PricingSection() {
  const a = product("assessment");
  return (
    <Section tone="ink" label="Pricing">
      <div className="wrap" data-hide-sticky>
        <Kicker n="14">Pricing</Kicker>
        <h2 className="display d-xl max-w-[18ch]">Transparent pricing. No hidden fees. No guaranteed outcomes.</h2>
        <div className="mt-14 flex flex-col justify-between gap-6 border border-route/70 bg-ink-deep p-7 sm:p-9 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow text-route">Start here</p>
            <p className="display d-md mt-2">{a.name}</p>
            <p className="mt-2 text-white/75">Written report · full-match review · level band · three market directions · 90-day plan · review call</p>
            <p className="mono mt-3 text-[0.72rem] text-slate-light">${ASSESSMENT_CREDIT.amount} credited toward European Pathway if you continue within {ASSESSMENT_CREDIT.days} days</p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <p className="display text-[4.5rem] leading-none text-route">{usd(a.price)}</p>
            <ApplyCta />
          </div>
        </div>
        <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {products.filter((p) => p.id !== "assessment").map((p) => (
            <li key={p.id} className="grid grid-cols-[1fr_auto] items-center gap-4 py-5 sm:grid-cols-[1.4fr_1fr_auto]">
              <div><p className="display text-[1.5rem] leading-none">{p.name}</p><p className="mono mt-1 text-[0.7rem] text-slate-light">{p.term}{p.label ? ` · ${p.label}` : ""}</p></div>
              <p className="hidden text-[0.9rem] text-white/70 sm:block">{programmeFor(p.id).concept}</p>
              <p className="display text-[1.9rem] leading-none text-route">{usd(p.price)}{p.billingType === "recurring" ? <span className="text-[0.5em] text-white/70">/mo</span> : ""}</p>
            </li>
          ))}
        </ul>
        <p className="mono mt-6 text-[0.72rem] text-slate-light">Career advisory. Not representation. · Current prices in USD · <Link href="/pricing" className="underline">Full pricing &amp; refunds</Link></p>
      </div>
    </Section>
  );
}

/* 15 — Pathway is not representation */
export function NotRepresentation() {
  const stations = ["Application", "Assessment", "Pathway", "Development", "Agency review", "Selected players"];
  return (
    <Section tone="paper" label="Pathway is not representation">
      <div className="wrap">
        <Kicker n="15">Representation</Kicker>
        <h2 className="display d-xl max-w-[15ch]">European Pathway is not representation.</h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {[["Separate.", "European Pathway is career assessment and advisory. Representation is provided only by Concordia Sports Agency, under its own representation agreement."], ["Selective.", "The Agency represents a small number of players."], ["Never for sale.", "Representation cannot be purchased. Paying for a more expensive programme does not increase any player’s right, entitlement or chance to be represented."]].map(([t, b]) => (
            <div key={t}><p className="display d-md">{t}</p><p className="mt-3 text-ink/75">{b}</p></div>
          ))}
        </div>
        <div className="mt-16 overflow-hidden">
          <div className="flex flex-col gap-0 lg:flex-row lg:items-center">
            {stations.map((s) => (
              <div key={s} className="flex items-center lg:flex-1 lg:flex-col lg:items-start">
                <div className="flex items-center lg:w-full">
                  <span className="h-4 w-4 shrink-0 rounded-full border-[3px] border-ink bg-route" />
                  <span className="ml-0 hidden h-[3px] flex-1 bg-route-deep lg:block" />
                </div>
                <span className="mono ml-4 py-3 text-[0.75rem] uppercase tracking-[0.08em] lg:ml-0 lg:mt-3 lg:py-0">{s}</span>
              </div>
            ))}
            <div className="my-4 flex items-center gap-3 border-y-2 border-ink py-3 lg:mx-4 lg:my-0 lg:flex-col lg:border-x-2 lg:border-y-0 lg:px-4 lg:py-6">
              <span className="mono text-[0.68rem] font-semibold uppercase tracking-[0.12em]">Separate representation agreement</span>
            </div>
            <div className="flex items-center lg:flex-col lg:items-start">
              <span className="h-4 w-4 rounded-full border-[3px] border-ink bg-white" />
              <span className="mono ml-4 text-[0.75rem] uppercase tracking-[0.08em] lg:ml-0 lg:mt-3">Representation</span>
            </div>
          </div>
        </div>
        <p className="mt-10 max-w-3xl text-[0.95rem] text-ink/70">If a player ever enters formal representation, European Pathway ends and unused prepaid time is refunded or credited. <Link href="/representation" className="underline underline-offset-4">How representation works</Link>.</p>
      </div>
    </Section>
  );
}

/* 16 — Testimonials (renders only when approved) */
export function TestimonialsSection() {
  const t = testimonials[0];
  return (
    <Gate evidence={t.evidence} label="testimonial transcript + permission">
      <Section tone="deep" label="Testimonials" className="!py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Kicker n="16">Ask the players</Kicker>
            <h2 className="display d-xl">Don’t take our word for it.</h2>
            <p className="lede mt-5 text-white/80">Players in their own words — unedited, with permission on file, and labelled with their relationship to Concordia.</p>
            <p className="mono mt-6 text-[0.72rem] text-slate-light">{t.speaker} · {t.entity} · relationship pending</p>
          </div>
          {t.media && <video src={t.media.src} controls preload="none" playsInline className="aspect-[9/16] max-h-[70vh] w-full max-w-sm justify-self-center bg-black object-cover" aria-label={`Testimonial video — ${t.speaker}`} />}
        </div>
      </Section>
    </Gate>
  );
}

/* 17 — FAQ */
export function FaqSection({ all = false }: { all?: boolean }) {
  const items = faq.filter((f) => all || f.home);
  return (
    <Section tone="ink" label="Questions">
      <div className="wrap grid gap-12 lg:grid-cols-[0.6fr_1.4fr]">
        <div><Kicker n={all ? undefined : "17"}>Questions</Kicker><h2 className="display d-xl">Straight answers.</h2>{!all && <div className="mt-8"><TextLink href="/faq">All questions</TextLink></div>}</div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {items.map((f) => (
            <Gate key={f.q} evidence={f.evidence}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[1.1rem] font-semibold">{f.q}<span className="mt-1 text-route transition-transform group-open:rotate-45" aria-hidden>+</span></summary>
                <p className="mt-4 max-w-3xl leading-relaxed text-white/75">{f.a}</p>
              </details>
            </Gate>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* Final CTA — every supporting page ends on the two-step offer */
export function FinalCta() {
  return <FinalOffer />;
}

/* Inside European football — compact documentary strip (About pages) */
export function InsideFootballStrip({ ids = insideFootballStrip }: { ids?: string[] }) {
  return (
    <div className="rail -mx-[var(--gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4">
      {ids.map((id) => <div key={id} className="relative w-[72%] shrink-0 snap-start sm:w-[40%] lg:w-[26%]"><DocFigure photo={photos[id]} ratio="4/5" sizes="(min-width:1024px) 26vw, 72vw" /></div>)}
    </div>
  );
}

export { Eyebrow };
