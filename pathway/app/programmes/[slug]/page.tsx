import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Gate } from "@/components/ui/Gate";
import { products, programmeFor, ELITE_CAPACITY, ASSESSMENT_CREDIT } from "@/content/products";
import { accessCopy } from "@/lib/commerce/access";
import { usd } from "@/lib/format";
import { NotRepresentation, FinalCta } from "@/components/sections/HomeSections";

const list = () => products.filter((p) => p.id !== "assessment");
export function generateStaticParams() { return list().map((p) => ({ slug: p.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const p = list().find((x) => x.slug === slug);
  return { title: p ? `${p.name} — ${p.term}` : "Programme" };
}

export default async function ProgrammePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = list().find((x) => x.slug === slug); if (!p) notFound();
  const c = programmeFor(p.id);
  const access = accessCopy[p.access];
  return (
    <>
      <PageHero eyebrow={`${p.name} · ${p.term}`} title={c.concept} lede={<><p>Best for: {c.bestFor}</p></>}>
        <div className="flex flex-wrap items-end gap-8">
          <p className="display text-[clamp(3.5rem,7vw,5.5rem)] leading-none text-route">{usd(p.price)}{p.billingType === "recurring" && <span className="text-[0.35em] text-white/70">/month</span>}</p>
          <div><p className="mono text-[0.72rem] uppercase tracking-[0.12em] text-slate-light">{access.label}</p><p className="mt-1 max-w-sm text-[0.92rem] text-white/75">{access.explain}</p></div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href={p.access === "invitation_only" ? "/apply" : "/apply"} className="btn btn-route">Apply — assessment first <span className="arrow">→</span></Link>
          <Link href={`/checkout/${p.slug}`} className="btn btn-ghost">Enrolment</Link>
        </div>
      </PageHero>
      <Section tone="paper" label="What it answers">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow text-ink/60">The questions it answers</p>
            <ul className="mt-5 space-y-3">{c.answers.map((a) => <li key={a} className="display text-[1.6rem] leading-[1.05]">{a}</li>)}</ul>
          </div>
          <div>
            <p className="eyebrow text-ink/60">What’s included</p>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">{c.inclusions.map((x) => <li key={x} className="flex gap-3 border-b border-ink/10 pb-3"><span className="mt-2 h-[6px] w-[6px] shrink-0 bg-ink" />{x}</li>)}</ul>
            {c.footnote && <p className="mt-8 border-l-2 border-ink pl-5 text-ink/80">{c.footnote}</p>}
          </div>
        </div>
      </Section>
      {p.id === "elite" && (
        <Section tone="ink" label="What Elite does not buy" className="!py-16">
          <div className="wrap">
            <div className="border-2 border-route p-7 sm:p-10">
              <p className="display d-md">Elite does not buy representation, club introductions, a trial, a contract or any preference in Concordia Sports Agency’s selection.</p>
              <p className="lede mt-4 text-white/80">It buys depth of expertise and time: more frequent professional review, more analysis and closer involvement for the family.</p>
            </div>
            <Gate evidence={ELITE_CAPACITY.evidence} label="real seat cap" className="mt-8"><p className="text-white/75">Capacity is limited because senior time is limited — not to create urgency. [Seats remaining: real counter]</p></Gate>
            {c.pending && Object.entries(c.pending).map(([k, e]) => <Gate key={k} evidence={e} className="mt-6" label={k}><span className="text-[0.85rem] text-white/60">Copy depending on {e.ref} is marked above.</span></Gate>)}
          </div>
        </Section>
      )}
      <Section tone="deep" label="Credit and refunds" className="!py-14">
        <div className="wrap grid gap-6 md:grid-cols-3 text-white/80">
          <p><span className="display block text-[1.4rem] text-white">Assessment first</span>Every programme starts with a Player Pathway Assessment.</p>
          <p><span className="display block text-[1.4rem] text-white">${ASSESSMENT_CREDIT.amount} credit</span>Credited toward a programme booked within {ASSESSMENT_CREDIT.days} days of your assessment.</p>
          <Gate evidence={{ state: "pending", ref: "E24" }} label="refund text"><p><span className="display block text-[1.4rem] text-white">Refunds</span>14-day refund minus assessment value; thereafter pro-rata only for our non-performance; injury pause up to 60 days.</p></Gate>
        </div>
      </Section>
      <NotRepresentation />
      <FinalCta />
    </>
  );
}
