import Link from "next/link";
import { FinalOffer } from "@/components/home/HomeV2";
import { Section, Eyebrow, Kicker } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ApplyCta, TextLink } from "@/components/ui/Cta";
import { Gate, Pending } from "@/components/ui/Gate";
import { DocFigure } from "@/components/cards/DocFigure";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { ASSESSMENT_STEPS, RECEIVE, NOT_RECEIVE } from "@/content/assessment";
import { photos, insideFootballStrip } from "@/content/photos";
import { agencyPlayers } from "@/content/agency-players";
import { ASSESSMENT_CREDIT } from "@/content/products";
import { faq } from "@/content/faq";
import { testimonials } from "@/content/testimonials";
import { pending } from "@/lib/evidence";

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
          <p className="mono text-[0.72rem] text-slate-light sm:ml-6">Ready within 7 days of payment and your materials · ${ASSESSMENT_CREDIT.amount} credited toward European Pathway if you continue within {ASSESSMENT_CREDIT.days} days</p>
        </div>
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
          {t.media && <video src={t.media.src} poster={t.media.poster} controls preload="none" playsInline className="aspect-[9/16] max-h-[70vh] w-full max-w-sm justify-self-center bg-black object-cover" aria-label={`Testimonial video — ${t.speaker}`} />}
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
