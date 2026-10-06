import type { Metadata } from "next";
import { DecisionSet } from "@/components/sections/DecisionSet";
import { HeroV3 } from "@/components/home/HeroV3";
import { PlayersRail } from "@/components/home/PlayersRail";
import { PathwayScroller } from "@/components/home/PathwayScroller";
import { MarketMatch } from "@/components/home/MarketMatch";
import { TeamTrust } from "@/components/home/TeamTrust";
import { PhotoMarquee } from "@/components/home/PhotoMarquee";
import { PricePair, ServicesTicker, StartHere, ParentsSection, TestimonialsCarousel, HowItWorksStrip, FinalOffer } from "@/components/home/HomeV2";
import { StructuredData } from "@/components/seo/StructuredData";
import { product } from "@/content/products";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Homepage — Round 2: signature interactions carry the story (map hero, month-by-month pathway, market match). */
export default function Home() {
  return (
    <>
      <StructuredData />
      <HeroV3 pricePair={<PricePair />} />
      <ServicesTicker />
      <PlayersRail />
      <DecisionSet />
      <StartHere />
      <PathwayScroller price={product("pathway").price} />
      <MarketMatch />
      <TeamTrust />
      <PhotoMarquee />
      <ParentsSection />
      <TestimonialsCarousel />
      <HowItWorksStrip />
      <FinalOffer />
    </>
  );
}
