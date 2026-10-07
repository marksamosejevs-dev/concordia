import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { MarketsExplorer } from "@/components/markets/MarketsExplorer";
import { FinalCta } from "@/components/sections/HomeSections";

export const metadata: Metadata = { alternates: { canonical: "/markets" }, title: "European markets", description: "Europe is not one football market. Explore market guides — every fact sourced and dated." };

export default function MarketsPage() {
  return (
    <>
      <PageHero eyebrow="European Market Explorer" title={<>Europe is not one football market.</>} map={false}
        lede={<><p>Spain is not Poland. Belgium is not Sweden. Italy is not Czechia. The question isn’t “can I play in Europe?” — it’s which market, at which level, at which moment, makes sense for you.</p></>} />
      <Section tone="ink" label="Explorer" className="!pt-4"><div className="wrap"><MarketsExplorer /></div></Section>
      <FinalCta />
    </>
  );
}
