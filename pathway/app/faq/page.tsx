import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { FaqSection, FinalCta } from "@/components/sections/HomeSections";

export const metadata: Metadata = { title: "Questions" };
export default function FaqPage() {
  return (<><PageHero eyebrow="Questions" title="Straight answers." lede="If your question isn’t here, the assessment application is free — and we review every one." /><FaqSection all /><FinalCta /></>);
}
