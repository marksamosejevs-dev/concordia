import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { FindYourPath } from "@/components/quiz/FindYourPath";

export const metadata: Metadata = { alternates: { canonical: "/find-your-path/" }, title: "Find your path", description: "Ten quick questions. A recommended next step — not a verdict on your talent." };

export default function Page() {
  return (
    <Section tone="ink" label="Find your path" className="!pt-[calc(var(--header-h)+3rem)]">
      <div className="wrap-narrow">
        <p className="eyebrow text-slate-light">Find your path · 2 minutes</p>
        <p className="display d-lg mb-10 mt-4">Where should you start?</p>
        <FindYourPath />
      </div>
    </Section>
  );
}
