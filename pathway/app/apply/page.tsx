import type { Metadata } from "next";
import { ApplicationForm } from "@/components/apply/ApplicationForm";

export const metadata: Metadata = { title: "Apply — free", description: "Apply free · Assessment $249 if accepted." };
export default function ApplyPage() {
  return <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]"><div className="wrap-narrow"><ApplicationForm /></div></section>;
}
