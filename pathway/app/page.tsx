import type { Metadata } from "next";
import { DecisionSet } from "@/components/sections/DecisionSet";
import {
  HomeHero, ServicesTicker, ProofSection, StartHere, BuildPathway, CareerTeamSection,
  RealFootball, ParentsSection, TestimonialsCarousel, HowItWorksStrip, FinalOffer,
} from "@/components/home/HomeV2";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Homepage — Round 1 architecture: 11 sections + footer. Detail lives on the supporting pages. */
export default function Home() {
  return (
    <>
      <StructuredData />
      <HomeHero />             {/* 01 hero · FIFA-agent-led trust · price pair */}
      <ServicesTicker />       {/*    kinetic band: what we do */}
      <ProofSection />         {/* 02 fast proof: Agency players + credential */}
      <DecisionSet />          {/* 03 problem → decision (compact) */}
      <StartHere />            {/* 04 $249 assessment */}
      <BuildPathway />         {/* 05 $399/month European Pathway + dashboard */}
      <CareerTeamSection />    {/* 06 what your career team does */}
      <RealFootball />         {/* 07 photography + founders */}
      <ParentsSection />       {/* 08 parents / players */}
      <TestimonialsCarousel /> {/* 09 video testimonials */}
      <HowItWorksStrip />      {/* 10 apply → assess → build → next move */}
      <FinalOffer />           {/* 11 final pricing / CTA */}
    </>
  );
}
