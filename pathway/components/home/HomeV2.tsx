import Link from "next/link";
import Image from "next/image";
import { ParentsPlayers } from "./ParentsPlayers";
import { VideoTestimonials } from "./VideoTestimonials";
import { FlowLine } from "@/components/funnel/FlowLine";
import { ACCEPTED_MEANING } from "@/content/assessment";
import { photos } from "@/content/photos";
import { testimonials } from "@/content/testimonials";
import { activeSample } from "@/content/sample-report";
import { product } from "@/content/products";
import { PATHWAY_TERMS, ASSESSMENT_POINTS, SERVICES_TICKER } from "@/content/pathway";
import { CTA } from "@/content/site";
import { usd } from "@/lib/format";
import { isPublic } from "@/lib/evidence";
import { IS_REVIEW } from "@/lib/site-mode";

const A = () => product("assessment");
const P = () => product("pathway");

/** The whole commercial architecture in one glance: $249 once → $399 a month. */
export function PricePair({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const dark = tone === "dark";
  return (
    <div className={`grid grid-cols-[1fr_auto_1.15fr] items-stretch ${className}`}>
      <Link href="/assessment" data-magnetic className={`block rounded-[10px] border p-3.5 transition-colors sm:p-4 ${dark ? "border-white/20 hover:border-white" : "border-ink/20 bg-white/50 hover:border-ink"}`}>
        <span className={`block text-[0.78rem] font-semibold ${dark ? "text-white/70" : "text-ink/65"}`}>Start with the assessment</span>
        <span className="display mt-1.5 block text-[clamp(1.8rem,3vw,2.4rem)] leading-none">{usd(A().price)}</span>
        <span className={`mt-1 block text-[0.75rem] ${dark ? "text-white/55" : "text-ink/55"}`}>one time</span>
      </Link>
      <span className={`grid w-8 place-items-center text-lg sm:w-10 ${dark ? "text-route" : "text-ink"}`} aria-hidden>→</span>
      <Link href="/european-pathway" data-magnetic className="block rounded-[10px] bg-route p-3.5 text-ink transition-colors hover:bg-white sm:p-4">
        <span className="block text-[0.78rem] font-semibold text-ink/70">Then European Pathway</span>
        <span className="display mt-1.5 block text-[clamp(1.8rem,3vw,2.4rem)] leading-none">{usd(P().price)}<span className="text-[0.48em]"> / month</span></span>
        <span className="mt-1 block text-[0.75rem] text-ink/70">paid monthly · no upfront</span>
      </Link>
    </div>
  );
}

/** Kinetic band — what we do, in one line that never stops moving. */
export function ServicesTicker() {
  const items = [...SERVICES_TICKER, ...SERVICES_TICKER];
  return (
    <div className="on-route marquee-wrap overflow-hidden border-y border-ink/10 py-4" aria-label={`What we do: ${SERVICES_TICKER.join(", ")}`}>
      <div className="marquee" aria-hidden>
        {items.map((s, i) => <span key={i} className="display flex shrink-0 items-center gap-6 pr-6 text-[clamp(1.4rem,2.6vw,2.2rem)] leading-none">{s}<span className="inline-block h-2.5 w-2.5 rotate-45 bg-ink" /></span>)}
      </div>
    </div>
  );
}

/** The $249 product as an object you can pick up. */
export function SampleReportCard({ className = "" }: { className?: string }) {
  const s = activeSample;
  return (
    <Link href="/assessment#sample" className={`group relative block w-full max-w-[380px] ${className}`} aria-label="Open the sample assessment">
      <div className="absolute inset-0 translate-x-5 translate-y-5 rotate-3 rounded-[4px] bg-white/70 shadow-lg transition-transform duration-700 group-hover:translate-x-9 group-hover:rotate-6" aria-hidden />
      <div className="relative aspect-[1/1.3] w-full overflow-hidden rounded-[4px] bg-white p-6 text-ink shadow-[0_40px_80px_-25px_rgba(13,27,54,0.45)] transition-transform duration-700 [transform:perspective(1400px)_rotateY(-12deg)_rotateX(4deg)] group-hover:[transform:perspective(1400px)_rotateY(-2deg)_rotateX(1deg)_translateY(-6px)] sm:p-7">
        <div className="sample-mark">SAMPLE</div>
        <div className="flex items-center justify-between text-[0.62rem] text-slate"><span>Player Pathway Assessment</span><span>p. 2 of 8</span></div>
        <p className="display mt-5 text-[2rem] leading-none">Level band</p>
        <p className="mt-2 text-[0.8rem] font-semibold">{s.levelBand.range}</p>
        <div className="mt-5 space-y-2">
          {["Current level evidence", "Technical / tactical", "Athletic profile", "Market access", "Trajectory"].map((k, i) => (
            <div key={k}><p className="text-[0.62rem] text-ink/70">{k}</p><div className="mt-1 h-1.5 bg-ink/10"><div className="h-full origin-left bg-ink transition-transform duration-700 group-hover:scale-x-110" style={{ width: `${[58, 64, 78, 70, 55][i]}%` }} /></div></div>
          ))}
        </div>
        <p className="mt-5 line-clamp-4 text-[0.66rem] leading-relaxed text-ink/75">{s.levelBand.reasoning[0]} {s.levelBand.reasoning[1]}</p>
        <div className="absolute inset-x-6 bottom-5 flex items-center justify-between border-t border-ink/15 pt-3 sm:inset-x-7">
          <span className="text-[0.6rem] text-slate">Illustrative · fictional player</span>
          <span className="display bg-route px-1.5 text-[0.9rem]">Wait →</span>
        </div>
      </div>
    </Link>
  );
}

/** Start here — the $249 assessment. */
export function StartHere() {
  return (
    <section className="on-paper relative overflow-hidden py-[clamp(4.5rem,10vw,7.5rem)]" aria-labelledby="start-title" data-hide-sticky>
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 id="start-title" className="display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.92]">Start with the truth about your level.</h2>
          <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-2">
            <p className="display text-[clamp(4.5rem,10vw,7.5rem)] leading-[0.8]">{usd(A().price)}</p>
            <p className="pb-1 text-[1rem] font-semibold leading-snug">Player Pathway Assessment<br /><span className="font-normal text-ink/65">one time · within 7 days once your materials are confirmed</span></p>
          </div>
          <ul className="mt-8 flex max-w-xl flex-wrap gap-2">
            {ASSESSMENT_POINTS.map((p) => <li key={p} className="rounded-full border border-ink/15 bg-white px-3.5 py-2 text-[0.9rem] font-semibold transition-colors hover:border-ink hover:bg-route">{p}</li>)}
          </ul>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col items-start gap-2">
              <Link href="/apply" className="btn btn-ink" data-magnetic data-cta="apply">{CTA.apply} <span className="arrow" aria-hidden>→</span></Link>
              <p className="text-[0.78rem] text-ink/60">{CTA.micro}</p>
            </div>
            <Link href="/assessment" className="btn btn-ghost">What you receive <span className="arrow" aria-hidden>→</span></Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end"><SampleReportCard /></div>
      </div>
    </section>
  );
}

/** Parents / players — questions floating around a photograph (Wembley deliberately not used on the homepage). */
export function ParentsSection() {
  return <ParentsPlayers photo={<Image src={photos.stadium.src} alt={photos.stadium.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="photo-grade object-cover" style={{ objectPosition: "50% 40%" }} />} />;
}

/** Video testimonials — human poster frames, drag carousel. */
export function TestimonialsCarousel() {
  const cards = testimonials.filter((t) => t.media?.poster && (isPublic(t.evidence) || IS_REVIEW)).map((t) => ({ t, tag: isPublic(t.evidence) ? undefined : `Pending · ${t.evidence.ref}` }));
  const slots = IS_REVIEW ? Array.from({ length: Math.max(0, 5 - cards.length) }, (_, n) => ({ slot: cards.length + n + 1 })) : [];
  if (!cards.length && !slots.length) return null;
  return (
    <section className="on-ink relative overflow-hidden py-[clamp(4.5rem,10vw,7.5rem)]" aria-labelledby="voices-title">
      <div className="wrap">
        <h2 id="voices-title" className="display mb-10 max-w-[14ch] text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.9]">Hear it from the players.</h2>
        <VideoTestimonials cards={cards} slots={slots} />
      </div>
    </section>
  );
}

/** How it works — the whole assessment journey on one line (readable in ~5 seconds). */
export function HowItWorksStrip() {
  return (
    <section className="on-blue relative overflow-hidden py-[clamp(4rem,9vw,7rem)]" aria-labelledby="flow-title">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 id="flow-title" className="display max-w-[16ch] text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.9]">From application to your next move.</h2>
          <Link href="/how-it-works" className="inline-flex items-center gap-2 font-semibold underline decoration-white/40 underline-offset-[6px] hover:decoration-white">The full process <span aria-hidden>→</span></Link>
        </div>
        <FlowLine tone="blue" />
        <p className="mt-10 max-w-2xl text-[0.95rem] text-white/80">{ACCEPTED_MEANING}</p>
      </div>
    </section>
  );
}

/** Final offer — the two steps, monthly payment front and centre. */
export function FinalOffer() {
  return (
    <section className="on-white relative overflow-hidden py-[clamp(4.5rem,10vw,7.5rem)]" aria-labelledby="final-title" data-hide-sticky>
      <div className="wrap">
        <h2 id="final-title" className="display max-w-[14ch] text-[clamp(3rem,6.4vw,6.9rem)] leading-[0.9]">Big ambition. <span className="bg-route px-2 box-decoration-clone">Honest advice.</span></h2>
        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1.15fr]">
          <div className="flex flex-col rounded-[14px] border-2 border-ink p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-8">
            <p className="text-[1rem] font-semibold text-ink/60">Start</p>
            <p className="display mt-1 text-[clamp(1.8rem,3vw,2.6rem)] leading-none">Player Pathway Assessment</p>
            <p className="display mt-6 text-[clamp(3.5rem,7vw,5.5rem)] leading-[0.85]">{usd(A().price)}</p>
            <p className="mt-1 text-[0.95rem] text-ink/60">one time</p>
            <p className="mt-5 text-ink/75">{ASSESSMENT_POINTS.join(" · ")}</p>
            <div className="mt-auto pt-8">
              <Link href="/apply" className="btn btn-ink" data-magnetic data-cta="apply">{CTA.apply} <span className="arrow" aria-hidden>→</span></Link>
              <p className="mt-2 text-[0.78rem] text-ink/60">{CTA.micro}</p>
            </div>
          </div>
          <span className="display grid place-items-center text-[2.5rem] leading-none lg:px-2" aria-hidden><span className="rotate-90 lg:rotate-0">→</span></span>
          <div className="on-route flex flex-col rounded-[14px] p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-8">
            <p className="text-[1rem] font-semibold text-ink/70">Continue</p>
            <p className="display mt-1 text-[clamp(1.8rem,3vw,2.6rem)] leading-none">6-month European Pathway</p>
            <p className="display mt-6 text-[clamp(3.5rem,7vw,5.5rem)] leading-[0.85]">{usd(P().price)}<span className="text-[0.35em]"> per month</span></p>
            <ul className="mt-5 flex flex-wrap gap-2">{PATHWAY_TERMS.points.map((p) => <li key={p} className="rounded-full bg-ink px-3 py-1.5 text-[0.85rem] font-semibold text-white">{p}</li>)}</ul>
            <p className="mt-3 text-[0.82rem] text-ink/70">You start with one month. <Link href={PATHWAY_TERMS.termsHref} className="underline underline-offset-2">{PATHWAY_TERMS.footnote}</Link></p>
            <div className="mt-auto pt-8"><Link href="/european-pathway" className="btn btn-ink" data-magnetic>{CTA.pathway} <span className="arrow" aria-hidden>→</span></Link></div>
          </div>
        </div>
        <p className="mt-8 text-[0.95rem] text-ink/70">Questions first? <Link href="/faq" className="font-semibold underline underline-offset-4">Straight answers</Link> · <Link href="/pricing" className="font-semibold underline underline-offset-4">Pricing details</Link></p>
      </div>
    </section>
  );
}
