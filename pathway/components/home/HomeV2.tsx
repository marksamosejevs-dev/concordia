import Link from "next/link";
import Image from "next/image";
import { ParentsPlayers } from "./ParentsPlayers";
import { VideoTestimonials } from "./VideoTestimonials";
import { FlowLine } from "@/components/funnel/FlowLine";
import { ACCEPTED_MEANING, RECEIVE_SHORT } from "@/content/assessment";
import { PARENTS_SECTION_PHOTO } from "@/content/people-assets";
import { testimonials } from "@/content/testimonials";
import { product } from "@/content/products";
import { SERVICES_TICKER } from "@/content/pathway";
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
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col items-start gap-2">
              <Link href="/apply" className="btn btn-ink" data-magnetic data-cta="apply">{CTA.apply} <span className="arrow" aria-hidden>→</span></Link>
              <p className="text-[0.78rem] text-ink/60">{CTA.micro}</p>
            </div>
            <Link href="/assessment" className="btn btn-ghost">What you receive <span className="arrow" aria-hidden>→</span></Link>
          </div>
        </div>
        <div className="border-2 border-ink bg-white p-6 sm:p-8">
          <p className="text-[0.95rem] font-semibold text-ink/60">What you receive</p>
          <ul className="mt-4 space-y-2.5">{RECEIVE_SHORT.map((r) => <li key={r} className="flex gap-3 text-[0.98rem]"><span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-ink" aria-hidden />{r}</li>)}</ul>
          <p className="mt-6 border-t border-ink/10 pt-4 text-[0.88rem] text-ink/65">Prepared by our team after reviewing your football profile and materials, then explained on a call of up to 60 minutes.</p>
        </div>
      </div>
    </section>
  );
}

/** Parents / players — questions floating around a photograph (Wembley deliberately not used on the homepage). */
export function ParentsSection() {
  const p = PARENTS_SECTION_PHOTO;
  return <ParentsPlayers photo={<Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="photo-grade object-cover" style={{ objectPosition: p.position }} />} />;
}

/** Video testimonials — human poster frames, drag carousel. */
export function TestimonialsCarousel() {
  const cards = testimonials.filter((t) => t.media?.poster && (isPublic(t.evidence) || IS_REVIEW)).map((t) => ({ t, tag: isPublic(t.evidence) ? undefined : `Pending · ${t.evidence.ref}` }));
  const slots = IS_REVIEW ? Array.from({ length: Math.max(0, 5 - cards.length) }, (_, n) => ({ slot: cards.length + n + 1 })) : [];
  if (!cards.length && !slots.length) return null;
  return (
    <section className="on-ink relative z-[1] -mt-10 overflow-hidden rounded-t-[clamp(24px,4vw,48px)] pb-[clamp(4.5rem,10vw,7.5rem)] pt-[clamp(3.5rem,7vw,5.5rem)]" aria-labelledby="voices-title">
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

/** Final CTA — compact: one clear next step, both prices restated in a line. */
export function FinalOffer() {
  return (
    <section className="on-white relative overflow-hidden py-[clamp(4rem,9vw,6.5rem)]" aria-labelledby="final-title" data-hide-sticky>
      <div className="wrap grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 id="final-title" className="display max-w-[14ch] text-[clamp(3rem,6.4vw,6.4rem)] leading-[0.9]">Big ambition. <span className="bg-route px-2 box-decoration-clone">Honest advice.</span></h2>
          <p className="lede mt-6 max-w-xl text-ink/75">Apply free. If you’re accepted, start with the {usd(A().price)} Player Pathway Assessment. Continue with European Pathway at {usd(P().price)}/month only if it makes sense for you.</p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <Link href="/apply" className="btn btn-ink" data-magnetic data-cta="apply">{CTA.apply} <span className="arrow" aria-hidden>→</span></Link>
          <p className="text-[0.85rem] text-ink/60">Free application · about 10 minutes</p>
          <p className="text-[0.9rem] text-ink/70"><Link href="/pricing" className="font-semibold underline underline-offset-4">Pricing details</Link> · <Link href="/faq" className="font-semibold underline underline-offset-4">Straight answers</Link></p>
        </div>
      </div>
    </section>
  );
}
