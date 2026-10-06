import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { HERO } from "@/content/hero";
import { DecisionSet } from "@/components/sections/DecisionSet";
import { HeroV3 } from "@/components/home/HeroV3";
import { PlayersRail } from "@/components/home/PlayersRail";
import { PathwayScroller } from "@/components/home/PathwayScroller";
import { MarketMatch } from "@/components/home/MarketMatch";
import { TeamSection } from "@/components/home/TeamSection";
import { CredentialSection } from "@/components/home/CredentialSection";
import { PhotoMarquee } from "@/components/home/PhotoMarquee";
import { PricePair, ServicesTicker, StartHere, ParentsSection, TestimonialsCarousel, HowItWorksStrip, FinalOffer } from "@/components/home/HomeV2";
import { StructuredData } from "@/components/seo/StructuredData";
import { product } from "@/content/products";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Homepage — Round 2: signature interactions carry the story (map hero, month-by-month pathway, market match). */
export default function Home() {
  // Secondary hero image appears only once the real asset is in the repository (never substituted).
  const sec = HERO.secondary;
  const secondary = fs.existsSync(path.join(process.cwd(), "public", sec.src)) ? { src: sec.src, alt: sec.alt, position: sec.position, ratio: `${sec.w}/${sec.h}`, caption: [...sec.caption] } : undefined;
  return (
    <>
      <StructuredData />
      <HeroV3 pricePair={<PricePair />} secondary={secondary} />
      <ServicesTicker />
      <PlayersRail />
      <DecisionSet />
      <StartHere />
      <PathwayScroller price={product("pathway").price} />
      <MarketMatch />
      <TeamSection />
      <CredentialSection />
      <PhotoMarquee />
      <ParentsSection />
      <TestimonialsCarousel />
      <HowItWorksStrip />
      <FinalOffer />
    </>
  );
}
