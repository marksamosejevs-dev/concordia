import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Gate } from "@/components/ui/Gate";
import { KnowWhatYouGetInto, FinalCta } from "@/components/sections/HomeSections";
import { pending } from "@/lib/evidence";

export const metadata: Metadata = { alternates: { canonical: "/football-law/" }, title: "Football law", description: "Football is a sport. Your career is also a contract." };

export default function FootballLaw() {
  return (
    <>
      <PageHero eyebrow="Football law" title={<>Football is a sport. <span className="text-route">Your career is also a contract.</span></>} lede="The biggest mistakes in a career often happen on paper: employment contracts, agency agreements, trial and academy agreements, termination clauses, bonuses and image rights." />
      <KnowWhatYouGetInto />
      <Section tone="paper" label="Services">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div><p className="display d-md">Separate legal services</p><ul className="mt-6 space-y-3 text-[1.05rem]"><li>— Professional contract review</li><li>— Trial / academy agreement review</li><li>— Agency agreement review</li><li>— Football legal consultation</li></ul></div>
          <div className="space-y-5 text-ink/80">
            <p>European Pathway is career advisory. Buying a Pathway service does not create a lawyer–client relationship.</p>
            <Gate evidence={pending("E9", "law-practice presentation")}><p>Legal services are provided by [LAW PRACTICE], [JURISDICTION], under a separate engagement and billed separately. Advice is limited to [JURISDICTIONS OF QUALIFICATION] law and football regulations; US-law questions are referred to US counsel.</p></Gate>
            <Gate evidence={pending("E27", "enquiry channel")}><a href="#" className="btn btn-ink">Ask about a contract review →</a></Gate>
          </div>
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
