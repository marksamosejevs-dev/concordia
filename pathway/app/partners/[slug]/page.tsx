import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { creators } from "@/content/creators";
import { FEATURES, IS_REVIEW } from "@/lib/site-mode";
import { PartnerAttribution } from "./PartnerAttribution";
import { HeroRoute } from "@/components/route/HeroRoute";
import { ApplyCta, TextLink } from "@/components/ui/Cta";
import { DecisionSet } from "@/components/sections/DecisionSet";
import { AssessmentProduct, NotRepresentation, FinalCta } from "@/components/sections/HomeSections";

/** Creator landing pages — disabled until the partner policy is approved (E28). */
const enabled = () => creators.filter((c) => (c.enabled && FEATURES.creatorPagesLive) || IS_REVIEW);
export function generateStaticParams() { return enabled().map((c) => ({ slug: c.slug })); }
export const dynamicParams = false;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const c = enabled().find((x) => x.slug === slug); if (!c) notFound();
  return (
    <>
      <PartnerAttribution slug={c.slug} code={c.referralCode} />
      <section className="on-ink relative min-h-[90svh] overflow-hidden pt-[calc(var(--header-h)+3rem)]">
        <HeroRoute />
        <div className="wrap relative pb-20">
          {IS_REVIEW && <p className="gate-tag mb-6 inline-block">Disabled in production · partner policy pending (E28)</p>}
          <p className="eyebrow text-slate-light">{c.heroEyebrow}</p>
          <h1 className="display d-hero mt-5 max-w-[14ch]">{c.heroHeadline}</h1>
          <p className="lede mt-7 max-w-xl text-white/85">{c.heroSub}</p>
          <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-start"><ApplyCta /><TextLink href="/assessment" className="mt-3.5">See what you receive</TextLink></div>
          <p className="mono mt-8 text-[0.7rem] text-slate-light">Referral code {c.referralCode} applied · Partner disclosure wording pending</p>
        </div>
      </section>
      <DecisionSet />
      <AssessmentProduct />
      <NotRepresentation />
      <FinalCta />
    </>
  );
}
