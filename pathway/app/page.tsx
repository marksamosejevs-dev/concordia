import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { HERO } from "@/content/hero";
import { HeroV3 } from "@/components/home/HeroV3";
import { PlayersRail } from "@/components/home/PlayersRail";
import { PathwayScroller } from "@/components/home/PathwayScroller";
import { TeamSection } from "@/components/home/TeamSection";
import { CredentialSection } from "@/components/home/CredentialSection";
import { PricePair, ServicesTicker, StartHere, ParentsSection, TestimonialsCarousel, HowItWorksStrip, FinalOffer } from "@/components/home/HomeV2";
import { StructuredData } from "@/components/seo/StructuredData";
import { product } from "@/content/products";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Homepage — real people and real football → $249 assessment → $399 pathway → process → people/credentials → final CTA. */
export default function Home() {
  // Secondary hero image appears only once the real asset is in the repository (never substituted).
  const sec = HERO.secondary;
  // Slot is always laid out; the photo renders only once the real file is in the repo.
  const secondary = { src: fs.existsSync(path.join(process.cwd(), "public", sec.src)) ? sec.src : undefined, alt: sec.alt, position: sec.position, ratio: `${sec.w}/${sec.h}`, caption: [...sec.caption] };
  return (
    <>
      <StructuredData />
      <HeroV3 pricePair={<PricePair />} secondary={secondary} />
      <ServicesTicker />
      <PlayersRail />
      <TestimonialsCarousel />
      <StartHere />
      <PathwayScroller price={product("pathway").price} />
      <HowItWorksStrip />
      <TeamSection />
      <CredentialSection />
      <ParentsSection />
      <FinalOffer />
    </>
  );
}
