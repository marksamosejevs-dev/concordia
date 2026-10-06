import Link from "next/link";
import Image from "next/image";
import { ApplyCta } from "@/components/ui/Cta";
import { Gate } from "@/components/ui/Gate";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoTile } from "@/components/cards/PhotoTile";
import { Portrait } from "@/components/team/Portrait";
import { CareerDashboard } from "@/components/pathway/CareerDashboard";
import { CareerTeam } from "./CareerTeam";
import { ParentsPlayers } from "./ParentsPlayers";
import { VideoTestimonials } from "./VideoTestimonials";
import { photos } from "@/content/photos";
import { agencyPlayers } from "@/content/agency-players";
import { testimonials } from "@/content/testimonials";
import { activeSample } from "@/content/sample-report";
import { product } from "@/content/products";
import { team } from "@/content/team";
import { PATHWAY_TERMS, ASSESSMENT_POINTS, MONTHS, JOURNEY, SERVICES_TICKER } from "@/content/pathway";
import { CTA, LICENCE } from "@/content/site";
import { usd } from "@/lib/format";
import { isPublic } from "@/lib/evidence";
import { IS_REVIEW } from "@/lib/site-mode";

const A = () => product("assessment");
const P = () => product("pathway");

/* Price pair — the whole commercial architecture in one glance. */
export function PricePair({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const dark = tone === "dark";
  return (
    <div className={`grid grid-cols-[1fr_auto_1fr] items-stretch ${className}`}>
      <Link href="/assessment" className={`group block border p-3.5 transition-colors sm:p-4 ${dark ? "border-white/20 hover:border-white" : "border-ink/20 hover:border-ink"}`}>
        <span className={`mono block text-[0.6rem] uppercase tracking-[0.12em] ${dark ? "text-white/60" : "text-ink/55"}`}>Start · Assessment</span>
        <span className="display mt-1.5 block text-[clamp(1.7rem,3vw,2.3rem)] leading-none">{usd(A().price)}</span>
        <span className={`mono mt-1 block text-[0.6rem] uppercase tracking-[0.1em] ${dark ? "text-white/60" : "text-ink/55"}`}>One time</span>
      </Link>
      <span className={`grid w-8 place-items-center text-lg sm:w-10 ${dark ? "text-route" : "text-ink"}`} aria-hidden>→</span>
      <Link href="/european-pathway" className="group block bg-route p-3.5 text-ink transition-colors hover:bg-white sm:p-4">
        <span className="mono block text-[0.6rem] uppercase tracking-[0.12em] text-ink/65">Continue · European Pathway</span>
        <span className="display mt-1.5 block text-[clamp(1.7rem,3vw,2.3rem)] leading-none">{usd(P().price)}<span className="text-[0.5em]"> /month</span></span>
        <span className="mono mt-1 block text-[0.6rem] uppercase tracking-[0.1em] text-ink/65">{PATHWAY_TERMS.short}</span>
      </Link>
    </div>
  );
}

/* 01 — HERO */
export function HomeHero() {
  return (
    <section className="on-ink relative overflow-hidden pt-[calc(var(--header-h)+1.5rem)]" aria-label="Introduction">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <path d="M-40 880 C 340 870, 700 820, 940 700 S 1300 420, 1640 380" fill="none" stroke="#FFD23F" strokeOpacity="0.55" strokeWidth="2" className="route-draw" style={{ ["--len" as string]: 2100 }} />
      </svg>
      <div className="wrap relative grid gap-10 pb-12 lg:min-h-[calc(100svh-var(--header-h)-1.5rem)] lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:pb-16">
        <div>
          <p className="mono mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.12em] text-white/85">
            <span className="h-1.5 w-1.5 rounded-full bg-route" aria-hidden />Led by FIFA Licensed Football Agent {LICENCE.holder}
          </p>
          <h1 className="display max-w-[15ch] text-[clamp(2.7rem,5.6vw,6rem)] leading-[0.92]">Think you can play in Europe? <span className="text-route">Ask people who work in it.</span></h1>
          <p className="lede mt-6 max-w-xl text-white/85">Player assessment and monthly career management for US players — from Concordia, a football agency team working in Europe.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
            <ApplyCta />
            <Link href="/european-pathway" className="btn btn-ghost">{CTA.pathway} <span className="arrow" aria-hidden>→</span></Link>
          </div>
          <PricePair className="mt-9 max-w-[560px]" />
        </div>

        {/* Marks — primary public face, with the credential beside him */}
        <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] lg:aspect-[4/5]">
            <Image src={photos.pitch.src} alt={photos.pitch.alt} fill priority sizes="(min-width:1024px) 40vw, 92vw" className="photo-grade object-cover" style={{ objectPosition: "50% 30%" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" aria-hidden />
          </div>
          <div className="absolute -bottom-5 left-3 right-3 bg-white p-4 text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] sm:left-auto sm:right-[-1rem] sm:w-[300px]">
            <p className="mono text-[0.58rem] uppercase tracking-[0.14em] text-ink/55">Your career team is led by</p>
            <p className="display mt-1 text-[1.6rem] leading-none">{LICENCE.holder}</p>
            <p className="mt-1 text-[0.82rem] font-semibold">FIFA Licensed Football Agent · Co-Founder</p>
            <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-2.5">
              <span className="mono text-[0.62rem] text-ink/60">Licence {LICENCE.number}</span>
              <Link href="/verify" className="mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] underline underline-offset-4">Verify →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Kinetic band — what we do, in one line that never stops moving */
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

/* 02 — FAST PROOF */
export function ProofSection() {
  const shown = agencyPlayers.filter((p) => isPublic(p.evidence) || IS_REVIEW);
  const cleared = agencyPlayers.filter((p) => isPublic(p.evidence));
  const internationals = cleared.filter((p) => p.nationalTeam === "Latvia").length;
  const clubs = [...new Set(cleared.map((p) => p.club).filter(Boolean))];
  return (
    <section className="on-white relative overflow-hidden py-[clamp(4rem,9vw,7rem)]" aria-labelledby="proof-title">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mono mb-4 text-[0.72rem] uppercase tracking-[0.14em] text-ink/55">Real football, not theory</p>
            <h2 id="proof-title" className="display d-xl max-w-[22ch]">Players represented by Concordia Sports Agency.</h2>
          </div>
          <Link href="/players" className="inline-flex items-center gap-2 font-semibold underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink">All players <span aria-hidden>→</span></Link>
        </div>

        <div className="rail -mx-[var(--gutter)] mt-10 flex snap-x gap-3 overflow-x-auto px-[var(--gutter)] pb-2 sm:gap-4">
          {shown.map((p, n) => (
            <Gate key={p.slug} evidence={p.evidence} label="guardian permission" className="shrink-0">
              <Reveal delay={n * 70} className="group w-[44vw] max-w-[230px] shrink-0 snap-start sm:w-[200px] lg:w-[210px]">
                <div className="relative aspect-[3/4] overflow-hidden bg-paper">
                  <Image src={p.photo} alt={p.name} fill sizes="(min-width:1024px) 210px, 44vw" className="object-cover grayscale-[0.85] transition-[filter,transform] duration-700 group-hover:scale-[1.04] group-hover:grayscale-0" />
                  {p.nationalTeam && <span className="mono absolute left-2 top-2 bg-route px-1.5 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-ink">{p.nationalTeam}</span>}
                </div>
                <p className="display mt-3 text-[1.25rem] leading-none">{p.name}</p>
                <p className="mt-1 text-[0.8rem] text-ink/65">{p.position}{p.club ? ` · ${p.club}` : ""}</p>
              </Reveal>
            </Gate>
          ))}
        </div>

        <dl className="mt-12 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-3">
          <div className="bg-white p-5 sm:p-6">
            <dt className="mono text-[0.62rem] uppercase tracking-[0.14em] text-ink/55">Led by</dt>
            <dd className="display mt-2 text-[1.6rem] leading-none">FIFA Licensed Football Agent</dd>
            <dd className="mt-1.5 text-[0.85rem] text-ink/70">{LICENCE.holder} · Licence {LICENCE.number} · <Link href="/verify" className="font-semibold underline underline-offset-4">Verify</Link></dd>
          </div>
          <div className="bg-white p-5 sm:p-6">
            <dt className="mono text-[0.62rem] uppercase tracking-[0.14em] text-ink/55">National team</dt>
            <dd className="display mt-2 text-[1.6rem] leading-none">{internationals} Latvia internationals</dd>
            <dd className="mt-1.5 text-[0.85rem] text-ink/70">plus youth internationals, on the Agency roster</dd>
          </div>
          <div className="bg-white p-5 sm:p-6">
            <dt className="mono text-[0.62rem] uppercase tracking-[0.14em] text-ink/55">Clubs</dt>
            <dd className="display mt-2 text-[1.6rem] leading-none">{clubs.length} professional clubs</dd>
            <dd className="mt-1.5 text-[0.85rem] text-ink/70">{clubs.join(" · ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* Sample report card — the $249 product as an object */
export function SampleReportCard({ className = "" }: { className?: string }) {
  const s = activeSample;
  return (
    <Link href="/assessment#sample" className={`group relative block w-full max-w-[380px] ${className}`} aria-label="Open the sample assessment">
      <div className="relative aspect-[1/1.3] w-full overflow-hidden bg-white p-6 text-ink shadow-[0_40px_80px_-25px_rgba(13,27,54,0.45)] transition-transform duration-700 [transform:perspective(1400px)_rotateY(-12deg)_rotateX(4deg)] group-hover:[transform:perspective(1400px)_rotateY(-3deg)_rotateX(1deg)] sm:p-7">
        <div className="sample-mark">SAMPLE</div>
        <div className="flex items-center justify-between"><span className="mono text-[0.58rem] uppercase tracking-[0.12em] text-slate">Player Pathway Assessment</span><span className="mono text-[0.58rem] text-slate">p.2/8</span></div>
        <p className="display mt-5 text-[2rem] leading-none">Level band</p>
        <p className="mt-2 text-[0.8rem] font-semibold">{s.levelBand.range}</p>
        <div className="mt-5 space-y-2">
          {["Current level evidence", "Technical / tactical", "Athletic profile", "Market access", "Trajectory"].map((k, i) => (
            <div key={k}><p className="text-[0.62rem] text-ink/70">{k}</p><div className="mt-1 h-1.5 bg-ink/10"><div className="h-full bg-ink" style={{ width: `${[58, 64, 78, 70, 55][i]}%` }} /></div></div>
          ))}
        </div>
        <p className="mt-5 line-clamp-4 text-[0.66rem] leading-relaxed text-ink/75">{s.levelBand.reasoning[0]} {s.levelBand.reasoning[1]}</p>
        <div className="absolute inset-x-6 bottom-5 flex items-center justify-between border-t border-ink/15 pt-3 sm:inset-x-7">
          <span className="mono text-[0.55rem] uppercase tracking-[0.1em] text-slate">Illustrative · fictional player</span>
          <span className="display bg-route px-1.5 text-[0.9rem]">Wait →</span>
        </div>
      </div>
    </Link>
  );
}

/* 04 — START HERE · $249 */
export function StartHere() {
  return (
    <section className="on-paper relative overflow-hidden py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="start-title" data-hide-sticky>
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mono mb-4 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.14em] text-ink/55"><span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[0.65rem] text-white">1</span>Start here</p>
          <h2 id="start-title" className="display d-xl max-w-[18ch]">Player Pathway Assessment</h2>
          <div className="mt-6 flex items-end gap-4">
            <p className="display text-[clamp(4.5rem,10vw,7.5rem)] leading-[0.8]">{usd(A().price)}</p>
            <p className="mono pb-1 text-[0.72rem] uppercase tracking-[0.12em] text-ink/60">One time<br />Report in 7 business days</p>
          </div>
          <p className="lede mt-6 max-w-lg text-ink/75">Where you really stand, which European markets fit — and what to do next. In writing.</p>
          <ul className="mt-7 flex max-w-xl flex-wrap gap-2">
            {ASSESSMENT_POINTS.map((p) => <li key={p} className="flex items-center gap-2 border border-ink/15 bg-white px-3 py-2 text-[0.88rem] font-semibold"><span className="h-1.5 w-1.5 bg-route-deep" aria-hidden />{p}</li>)}
          </ul>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-start">
            <ApplyCta tone="ink" />
            <Link href="/assessment" className="btn btn-ghost">What you receive <span className="arrow" aria-hidden>→</span></Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end"><SampleReportCard /></div>
      </div>
    </section>
  );
}

/* 05 — BUILD YOUR PATHWAY · $399/month */
export function BuildPathway() {
  return (
    <section className="on-route relative overflow-hidden py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="pathway-title" data-hide-sticky>
      <div className="wrap grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mono mb-4 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.14em] text-ink/65"><span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[0.65rem] text-route">2</span>Then build your pathway</p>
          <h2 id="pathway-title" className="display d-xl">European Pathway</h2>
          <p className="display mt-4 text-[clamp(5rem,13vw,10rem)] leading-[0.8]">{usd(P().price)}<span className="ml-2 align-top text-[0.28em] leading-none">/ month</span></p>
          <p className="mt-6 max-w-md text-[1.15rem] font-semibold leading-snug">{PATHWAY_TERMS.horizon}</p>
          <p className="mt-2 max-w-md text-[0.9rem] text-ink/70">{PATHWAY_TERMS.cancellation}{IS_REVIEW && <sup className="mono ml-1 text-[0.6em] opacity-70">{PATHWAY_TERMS.evidence.ref}</sup>}</p>
          <p className="lede mt-6 max-w-md text-ink/85">Your career team manages the plan with you — strategy, match analysis, markets, contracts and every decision in between.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/european-pathway" className="btn btn-ink">{CTA.pathway} <span className="arrow" aria-hidden>→</span></Link>
            <Link href="/apply" className="btn btn-ghost">Start with the assessment</Link>
          </div>
        </div>
        <CareerDashboard className="text-ink" />
      </div>
      <div className="wrap mt-14">
        <ol className="rail -mx-[var(--gutter)] flex gap-px overflow-x-auto px-[var(--gutter)] lg:grid lg:grid-cols-6 lg:overflow-visible" aria-label="Six-month pathway (illustrative)">
          {MONTHS.map((m) => (
            <li key={m.m} className="w-[62%] shrink-0 border-t-[3px] border-ink bg-white/40 p-4 sm:w-[34%] lg:w-auto">
              <p className="mono text-[0.62rem] uppercase tracking-[0.12em] text-ink/60">Month {m.m}</p>
              <p className="display mt-1.5 text-[1.35rem] leading-none">{m.t}</p>
              <p className="mt-1.5 text-[0.82rem] leading-snug text-ink/75">{m.b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 06 — WHAT YOUR CAREER TEAM DOES */
export function CareerTeamSection() {
  return (
    <section className="on-white relative py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="team-title">
      <div className="wrap">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mono mb-4 text-[0.72rem] uppercase tracking-[0.14em] text-ink/55">Included in European Pathway</p>
            <h2 id="team-title" className="display d-xl max-w-[14ch]">What your career team does.</h2>
          </div>
          <Link href="/european-pathway" className="btn btn-ink">See the full service <span className="arrow" aria-hidden>→</span></Link>
        </div>
        <CareerTeam />
      </div>
    </section>
  );
}

/* 07 — REAL FOOTBALL: photography + founders */
export function RealFootball() {
  const marks = team.find((t) => t.id === "marks-amosejevs")!;
  const filipp = team.find((t) => t.id === "filipp-sviridenko")!;
  return (
    <section className="on-deep relative overflow-hidden py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="real-title">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 id="real-title" className="display d-xl max-w-[15ch]">Built inside football. <span className="text-route">By people who work in it.</span></h2>
          <p className="max-w-sm text-white/75">Concordia Soccer comes from the founders and team behind Concordia Sports Agency.</p>
        </div>

        {/* Editorial collage — grid accepts more photos later without redesign */}
        <div className="mt-12 grid auto-rows-[110px] grid-cols-2 gap-3 sm:auto-rows-[150px] sm:grid-cols-4 lg:auto-rows-[170px] lg:grid-cols-6">
          <Reveal className="col-span-2 row-span-2 sm:col-span-4 lg:col-span-3"><div className="img-reveal relative h-full"><PhotoTile photo={photos.wembley} className="h-full" sizes="(min-width:1024px) 50vw, 100vw" /></div></Reveal>
          <Reveal delay={80} className="row-span-2 lg:col-span-1"><div className="img-reveal relative h-full"><PhotoTile photo={photos.okmk} className="h-full" sizes="(min-width:1024px) 17vw, 50vw" position="50% 25%" /></div></Reveal>
          <Reveal delay={160} className="row-span-2 lg:col-span-2"><div className="img-reveal relative h-full"><PhotoTile photo={photos.chairmanShirt} className="h-full" sizes="(min-width:1024px) 33vw, 50vw" position="50% 30%" /></div></Reveal>
          <Reveal delay={60} className="row-span-2 sm:col-span-2 lg:col-span-2"><div className="img-reveal relative h-full"><PhotoTile photo={photos.coaches} className="h-full" sizes="(min-width:1024px) 33vw, 50vw" position="50% 30%" /></div></Reveal>
          <Reveal delay={140} className="row-span-2 sm:col-span-2 lg:col-span-2"><div className="img-reveal relative h-full"><PhotoTile photo={photos.stadium} className="h-full" sizes="(min-width:1024px) 33vw, 50vw" /></div></Reveal>
          {IS_REVIEW && <Reveal delay={220} className="col-span-2 row-span-2 lg:col-span-2"><div className="img-reveal relative h-full"><PhotoTile photo={photos.korona} className="h-full" sizes="(min-width:1024px) 33vw, 100vw" /></div></Reveal>}
        </div>

        {/* Founders — Concordia first; Marks as the primary face */}
        <div className="mt-14 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <Link href="/about/marks-amosejevs" className="group grid grid-cols-[110px_1fr] items-center gap-5 border border-white/12 p-4 transition-colors hover:border-route sm:grid-cols-[150px_1fr] sm:p-5">
            <div className="relative aspect-[4/5] overflow-hidden"><Image src={photos.boardroom.src} alt={photos.boardroom.alt} fill sizes="150px" className="photo-grade object-cover" style={{ objectPosition: "50% 25%" }} /></div>
            <div>
              <p className="mono text-[0.62rem] uppercase tracking-[0.14em] text-route">{marks.role.value}</p>
              <p className="display mt-1.5 text-[clamp(1.6rem,2.6vw,2.3rem)] leading-none">{marks.name}</p>
              <p className="mt-1.5 text-[0.9rem] text-white/75">{marks.secondaryRole?.value} · Licence {LICENCE.number}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-[0.85rem] font-semibold">Read Marks’s story <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span></p>
            </div>
          </Link>
          <Link href="/about" className="group grid grid-cols-[110px_1fr] items-center gap-5 border border-white/12 p-4 transition-colors hover:border-route sm:p-5">
            <Gate evidence={filipp.photo.evidence} label="photo"><Portrait name={filipp.name} crop="mobilePortrait" sizes="110px" /></Gate>
            <div>
              <p className="mono text-[0.62rem] uppercase tracking-[0.14em] text-route">{filipp.role.value}</p>
              <p className="display mt-1.5 text-[clamp(1.6rem,2.6vw,2.3rem)] leading-none">{filipp.name}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-[0.85rem] font-semibold">Meet the team <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span></p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 08 — PARENTS / PLAYERS */
export function ParentsSection() {
  return <ParentsPlayers photo={<Image src={photos.wembley.src} alt={photos.wembley.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="photo-grade object-cover" style={{ objectPosition: "55% 78%" }} />} />;
}

/* 09 — VIDEO TESTIMONIALS */
export function TestimonialsCarousel() {
  const cards = testimonials.filter((t) => t.media?.poster && (isPublic(t.evidence) || IS_REVIEW)).map((t) => ({ t, tag: isPublic(t.evidence) ? undefined : `Pending · ${t.evidence.ref}` }));
  const slots = IS_REVIEW ? Array.from({ length: Math.max(0, 5 - cards.length) }, (_, n) => ({ slot: cards.length + n + 1 })) : [];
  if (!cards.length && !slots.length) return null;
  return (
    <section className="on-ink relative overflow-hidden py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="voices-title">
      <div className="wrap">
        <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mono mb-4 text-[0.72rem] uppercase tracking-[0.14em] text-white/60">In their own words</p>
            <h2 id="voices-title" className="display d-xl max-w-[14ch]">Hear it from the players.</h2>
          </div>
        </div>
        <VideoTestimonials cards={cards} slots={slots} />
      </div>
    </section>
  );
}

/* 10 — HOW IT WORKS */
export function HowItWorksStrip() {
  return (
    <section className="on-blue relative overflow-hidden py-[clamp(4rem,9vw,7rem)]" aria-labelledby="how-title">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 id="how-title" className="display d-xl">How it works.</h2>
          <Link href="/how-it-works" className="inline-flex items-center gap-2 font-semibold underline decoration-white/40 underline-offset-[6px] hover:decoration-white">The full process <span aria-hidden>→</span></Link>
        </div>
        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span className="absolute left-0 right-0 top-[22px] hidden h-[2px] bg-white/25 lg:block" aria-hidden />
          {JOURNEY.map((j, n) => (
            <Reveal as="li" key={j.k} delay={n * 120} className="relative">
              <span className={`relative z-[1] grid h-11 w-11 place-items-center rounded-full text-[0.95rem] font-bold ${n === 3 ? "bg-white text-ink" : "bg-route text-ink"}`}>{n + 1}</span>
              <p className="display mt-5 text-[clamp(2rem,3.2vw,2.8rem)] leading-none">{j.k}</p>
              {j.price && <p className="mono mt-2 text-[0.75rem] uppercase tracking-[0.12em] text-route">{j.price}</p>}
              <p className="mt-2 max-w-[26ch] text-white/85">{j.b}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 11 — FINAL PRICING / CTA */
export function FinalOffer() {
  return (
    <section className="on-white relative overflow-hidden py-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="final-title" data-hide-sticky>
      <div className="wrap">
        <h2 id="final-title" className="display d-hero max-w-[14ch]">Big ambition. <span className="bg-route px-2 box-decoration-clone">Honest advice.</span></h2>
        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col border-2 border-ink p-6 sm:p-8">
            <p className="mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/55">Start</p>
            <p className="display mt-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-none">Player Pathway Assessment</p>
            <p className="display mt-6 text-[clamp(3.5rem,7vw,5.5rem)] leading-[0.85]">{usd(A().price)}</p>
            <p className="mono mt-2 text-[0.7rem] uppercase tracking-[0.12em] text-ink/60">One time</p>
            <p className="mt-5 text-ink/75">{ASSESSMENT_POINTS.join(" · ")}</p>
            <div className="mt-auto pt-8"><ApplyCta tone="ink" /></div>
          </div>
          <span className="display grid place-items-center text-[2.5rem] leading-none lg:px-2" aria-hidden><span className="rotate-90 lg:rotate-0">→</span></span>
          <div className="on-route flex flex-col p-6 sm:p-8">
            <p className="mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/65">Continue</p>
            <p className="display mt-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-none">European Pathway</p>
            <p className="display mt-6 text-[clamp(3.5rem,7vw,5.5rem)] leading-[0.85]">{usd(P().price)}<span className="text-[0.35em]"> / month</span></p>
            <p className="mono mt-2 text-[0.7rem] uppercase tracking-[0.12em] text-ink/70">{PATHWAY_TERMS.short}</p>
            <p className="mt-5 text-ink/80">{PATHWAY_TERMS.horizon} {PATHWAY_TERMS.cancellation}</p>
            <div className="mt-auto pt-8"><Link href="/european-pathway" className="btn btn-ink">{CTA.pathway} <span className="arrow" aria-hidden>→</span></Link></div>
          </div>
        </div>
        <p className="mt-8 text-[0.95rem] text-ink/70">Questions first? <Link href="/faq" className="font-semibold underline underline-offset-4">Straight answers</Link> · <Link href="/pricing" className="font-semibold underline underline-offset-4">Pricing details</Link></p>
      </div>
    </section>
  );
}
