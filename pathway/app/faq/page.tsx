import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { FaqSection, FinalCta } from "@/components/sections/HomeSections";

export const metadata: Metadata = { alternates: { canonical: "/faq" }, description: "Straight answers about the Player Pathway Assessment, European Pathway at $399/month, representation, parents and practical details.", title: "Questions" };
export default function FaqPage() {
  return (<><PageHero eyebrow="Questions" title="Straight answers." lede="If your question isn’t here, the assessment application is free — and we review every one." /><FaqSection all /><FinalCta /></>);
}
