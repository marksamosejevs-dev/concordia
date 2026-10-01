import { HeroRoute } from "@/components/route/HeroRoute";
import { AudienceSwitch, ForAudience } from "@/components/layout/Audience";
import { ApplyCta, TextLink } from "@/components/ui/Cta";
import { LICENCE } from "@/content/site";
import { activeSample } from "@/content/sample-report";
import Link from "next/link";

export function Hero() {
  return (
    <section className="on-ink relative min-h-[100svh] overflow-hidden pt-[calc(var(--header-h)+2rem)]" aria-label="Introduction">
      <HeroRoute />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden />
      <div className="wrap relative grid min-h-[calc(100svh-var(--header-h)-2rem)] grid-cols-1 items-center gap-10 pb-16 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="eyebrow mb-6 text-slate-light">Soccer · European Pathway — Player Assessment</p>
          <h1 className="display d-hero max-w-[15ch]">
            Before you choose Europe, <span className="text-route">find out where you actually stand.</span>
          </h1>
          <div className="mt-8 max-w-xl">
            <ForAudience
              player={<p className="lede text-white/85">A professional assessment of your level, your realistic markets and your next move — from a team working inside European football.</p>}
              parent={<p className="lede text-white/85">Before you spend on trials, academies or a move abroad, get a professional read on where your child stands and what the realistic options are.</p>}
            />
          </div>
          <div className="mt-8"><AudienceSwitch /></div>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start">
            <ApplyCta />
            <ForAudience player={<TextLink href="/assessment" className="mt-3.5">See what you receive</TextLink>} parent={<TextLink href="/for/parents" className="mt-3.5">Read the parents’ guide</TextLink>} />
          </div>
          <p className="mono mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] text-slate-light">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-route" aria-hidden />
            Led by FIFA Licensed Football Agent {LICENCE.holder} · Licence {LICENCE.number} · <Link href="/verify" className="text-white underline underline-offset-4">Verify</Link>
          </p>
        </div>
        <HeroReportCard />
      </div>
    </section>
  );
}

/** The product is the image: one sample report page, tilted in depth. */
function HeroReportCard() {
  const s = activeSample;
  return (
    <Link href="/assessment#sample" className="group relative mx-auto hidden w-full max-w-[380px] lg:block" aria-label="Open the sample assessment">
      <div className="absolute -inset-6 -z-10 rounded-[2px] border border-white/10" aria-hidden />
      <div className="on-paper relative aspect-[1/1.32] w-full overflow-hidden p-7 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] transition-transform duration-700 [transform:perspective(1400px)_rotateY(-14deg)_rotateX(4deg)] group-hover:[transform:perspective(1400px)_rotateY(-6deg)_rotateX(2deg)]">
        <div className="sample-mark">SAMPLE</div>
        <div className="flex items-center justify-between"><span className="mono text-[0.58rem] uppercase tracking-[0.12em] text-slate">Player Pathway Assessment</span><span className="mono text-[0.58rem] text-slate">p.2/8</span></div>
        <p className="display mt-6 text-[2rem] leading-none">Level band</p>
        <p className="mt-2 text-[0.8rem] font-semibold">{s.levelBand.range}</p>
        <div className="mt-5 space-y-2">
          {["Current level evidence", "Technical / tactical", "Athletic profile", "Market access", "Trajectory"].map((k, i) => (
            <div key={k}><div className="flex justify-between text-[0.62rem] text-ink/70"><span>{k}</span></div><div className="mt-1 h-1.5 bg-ink/10"><div className="h-full bg-ink" style={{ width: `${[58, 64, 78, 70, 55][i]}%` }} /></div></div>
          ))}
        </div>
        <p className="mt-5 text-[0.66rem] leading-relaxed text-ink/75">{s.levelBand.reasoning[0]} {s.levelBand.reasoning[1]}</p>
        <div className="absolute inset-x-7 bottom-6 flex items-center justify-between border-t border-ink/15 pt-3">
          <span className="mono text-[0.55rem] uppercase tracking-[0.1em] text-slate">Illustrative example · fictional player</span>
          <span className="display text-[0.9rem] text-route-deep">Wait →</span>
        </div>
      </div>
      <p className="mono mt-5 text-center text-[0.65rem] uppercase tracking-[0.12em] text-slate-light group-hover:text-white">Sample assessment · See what you receive →</p>
    </Link>
  );
}
