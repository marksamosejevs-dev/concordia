import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { LEGAL_ENTITY } from "@/content/site";

const DOCS: Record<string, { title: string; outline: string[] }> = {
  terms: { title: "Terms of Service", outline: ["Who we are (contracting entity)", "Services: career assessment and advisory (Other Services)", "Express exclusion of football-agent services, club contact and placement", "No-guarantee clause", "Honest-assessment clause", "Fees, payment and instalments", "Minors and guardians", "Data and video licence", "Governing law and consumer-law rights"] },
  privacy: { title: "Privacy Policy", outline: ["Controller: " + LEGAL_ENTITY.name, "Data collected in the application", "Lawful bases (GDPR)", "Optional agency-viewing consent", "Retention", "Your rights", "International transfers", "Contact"] },
  refunds: { title: "Refund & Cancellation Policy", outline: ["Assessment refunds", "Programme refunds and the 14-day period", "Pro-rata refunds for non-performance", "Injury pause", "Pathway Club cancellation", "Representation transition refunds / credits"] },
  cookies: { title: "Cookie Policy", outline: ["Strictly necessary storage (application draft, attribution)", "Analytics (consent-gated)", "Managing preferences"] },
  safeguarding: { title: "Safeguarding", outline: ["Working with under-18s", "Guardian involvement", "Under-16 policy", "Reporting concerns"] },
  complaints: { title: "Complaints", outline: ["How to complain", "Response times", "Escalation"] },
  company: { title: "Company information", outline: [] },
};
export function generateStaticParams() { return Object.keys(DOCS).map((slug) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return { title: DOCS[slug]?.title ?? "Legal" }; }

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const d = DOCS[slug]; if (!d) notFound();
  return (
    <Section tone="paper" label={d.title} className="!pt-[calc(var(--header-h)+3rem)]">
      <div className="wrap-narrow">
        <p className="eyebrow text-ink/60">Legal</p>
        <h1 className="display d-lg mt-4">{d.title}</h1>
        <div className="mt-8 border-l-2 border-ink pl-5 text-ink/80">
          <p className="font-semibold text-ink">{LEGAL_ENTITY.name}</p>
          <p>Reg. No. {LEGAL_ENTITY.registrationNo} · VAT {LEGAL_ENTITY.vatNo}</p>
          <p>{LEGAL_ENTITY.address.join(", ")}</p>
          <p className="mt-2">{LEGAL_ENTITY.note}</p>
        </div>
        {d.outline.length > 0 && (
          <div className="gated relative mt-12 p-6">
            <span className="gate-tag absolute -top-3 left-2">Legal text pending review — outline only</span>
            <ol className="list-decimal space-y-2 pl-5 text-ink/75">{d.outline.map((o) => <li key={o}>{o}</li>)}</ol>
          </div>
        )}
      </div>
    </Section>
  );
}
