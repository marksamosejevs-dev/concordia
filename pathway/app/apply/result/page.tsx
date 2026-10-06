import type { Metadata } from "next";
import { ResultScreen } from "@/components/apply/ResultScreen";

export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Your application result" };
export default function ResultPage() {
  return <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]"><div className="wrap-narrow"><ResultScreen /></div></section>;
}
