import type { Metadata } from "next";
import { AssessmentStatus } from "@/components/funnel/AssessmentStatus";

export const metadata: Metadata = { title: "Your Pathway Assessment status", robots: { index: false, follow: false } };
export default function StatusPage() {
  return <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]"><div className="wrap-narrow"><AssessmentStatus /></div></section>;
}
