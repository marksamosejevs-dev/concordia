import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { countries, COUNTRY_TABS } from "@/content/countries";
import { IS_REVIEW } from "@/lib/site-mode";
import { FinalCta } from "@/components/sections/HomeSections";

/** Country pages are generated only for live (sourced) markets. Review builds also render one template page. */
const pages = () => countries.filter((c) => c.marketStatus === "live" || (IS_REVIEW && c.iso === "LV"));
export function generateStaticParams() { return pages().map((c) => ({ country: c.iso.toLowerCase() })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params; const c = countries.find((x) => x.iso.toLowerCase() === country);
  return { title: c ? `${c.name} — market guide` : "Market guide" };
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const c = pages().find((x) => x.iso.toLowerCase() === country); if (!c) notFound();
  return (
    <>
      <PageHero eyebrow={`Market guide · ${c.iso}`} title={c.name} lede={c.marketStatus === "live" ? c.overview : "Template page — this market guide is in preparation. Facts appear only once sourced and verified."} />
      <Section tone="ink" label="Guide" className="!pt-4">
        <div className="wrap grid gap-px bg-white/10 md:grid-cols-2">
          {COUNTRY_TABS.map((t) => (
            <div key={t} className={`bg-ink p-7 ${c.marketStatus !== "live" ? "gated" : ""}`}>
              <p className="display text-[1.6rem] leading-none">{t}</p>
              <p className="mt-3 text-white/60">[{t.toUpperCase()} — SOURCE REQUIRED]</p>
              <p className="mono mt-3 text-[0.62rem] text-slate">Source · URL · last verified</p>
            </div>
          ))}
        </div>
        <div className="wrap mt-10"><Link href="/apply" className="btn btn-route">Is this market realistic for you? Apply →</Link></div>
      </Section>
      <FinalCta />
    </>
  );
}
