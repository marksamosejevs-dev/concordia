import type { Metadata } from "next";
import { OnboardingForm } from "@/components/funnel/OnboardingForm";

export const metadata: Metadata = { title: "Your football profile + video", robots: { index: false, follow: false } };
export default function OnboardingPage() {
  return <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]"><div className="wrap-narrow"><OnboardingForm /></div></section>;
}
