import type { Metadata } from "next";
import { ApplicationForm } from "@/components/apply/ApplicationForm";

export const metadata: Metadata = { title: "Apply for your Pathway Assessment — free application", description: "Free application for the Pathway Assessment. About 10 minutes. $249 only if accepted.", alternates: { canonical: "/apply" } };
export default function ApplyPage() {
  return <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2rem)]"><div className="wrap-narrow"><ApplicationForm /></div></section>;
}
