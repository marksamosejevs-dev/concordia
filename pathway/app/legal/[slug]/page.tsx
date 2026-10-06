import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { LEGAL_ENTITY, LICENCE } from "@/content/site";
import { PATHWAY_TERMS } from "@/content/pathway";
import { ASSESSMENT_TERMS } from "@/content/terms";
import { ACCEPTED_MEANING } from "@/content/assessment";
import { IS_REVIEW } from "@/lib/site-mode";

/** Key notices — moved here from the homepage (Round 1). Same substance, one authoritative place. */
const NOTICES: [string, string][] = [
  ["Advisory, not representation", "Concordia Soccer · European Pathway provides career assessment and advisory services. It is not representation. Representation by Concordia Sports Agency is separate and selective, requires its own representation agreement, and cannot be purchased. Paying for any Pathway service does not increase a player’s right, entitlement or chance to be represented."],
  ["Agency players", "Players presented as represented by Concordia Sports Agency are shown as Agency credibility. They did not necessarily take part in European Pathway, and buying a Pathway service does not make a player a represented player."],
  ["FIFA licence", `The FIFA football agent licence (No. ${LICENCE.number}) is held personally by ${LICENCE.holder}. No FIFA endorsement of Concordia Soccer, Concordia Sports Agency or their services is stated or implied.`],
  ["Acceptance", "Being accepted means accepted for a Pathway Assessment — not for representation, by the Agency or by any club."],
  ["No guaranteed outcomes", "No trial, contract, transfer, club introduction or placement is promised or guaranteed by any service."],
  ["Contract & offer review", "Contract and offer review within European Pathway is career-advisory review of what an offer commits a player to. It does not create a lawyer–client relationship; where formal legal advice is needed, we will say so."],
  ["European Pathway billing", `${PATHWAY_TERMS.horizon} ${PATHWAY_TERMS.cancellation} The final subscription terms — minimum term, cancellation and renewal — will be set out in full here before enrolment opens.`],
];

const DOCS: Record<string, { title: string; outline: string[] }> = {
  terms: { title: "Terms of Service", outline: ["Who we are (contracting entity)", "Services: career assessment and advisory (Other Services)", "Express exclusion of football-agent services, club contact and placement", "No-guarantee clause", "Honest-assessment clause", "Fees and monthly billing (European Pathway)", "Minors and guardians", "Data and video licence", "Governing law and consumer-law rights"] },
  privacy: { title: "Privacy Policy", outline: ["Controller: " + LEGAL_ENTITY.name, "Data collected in the application", "Lawful bases (GDPR)", "Optional agency-viewing consent", "Retention", "Your rights", "International transfers", "Contact"] },
  refunds: { title: "Refund & Cancellation Policy", outline: ["Assessment refunds", "European Pathway monthly billing: minimum term, cancellation and renewal", "EU / consumer withdrawal rights", "Pro-rata refunds for non-performance", "Injury pause", "Representation transition refunds / credits"] },
  cookies: { title: "Cookie Policy", outline: ["Strictly necessary storage (application draft, attribution)", "Analytics (consent-gated)", "Managing preferences"] },
  safeguarding: { title: "Safeguarding", outline: ["Working with under-18s", "Guardian involvement", "Under-16 policy", "Reporting concerns"] },
  complaints: { title: "Complaints", outline: ["How to complain", "Response times", "Escalation"] },
  company: { title: "Company information", outline: [] },
};
export function generateStaticParams() { return Object.keys(DOCS).map((slug) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const t = DOCS[slug]?.title ?? "Legal"; return { title: t, description: `${t} — Concordia Soccer · European Pathway, provided by ${LEGAL_ENTITY.name}.`, alternates: { canonical: `/legal/${slug}/` } }; }

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
        {slug === "terms" && (
          <div id="pathway-assessment" className="mt-12 scroll-mt-28">
            <h2 className="display d-md">Pathway Assessment</h2>
            {IS_REVIEW && <p className="gate-tag mt-3 inline-block">Draft wording · pending legal review (E35)</p>}
            <p className="mt-5 rounded-[10px] bg-route/40 px-4 py-3 font-semibold text-ink">{ACCEPTED_MEANING}</p>
            <ol className="mt-8 space-y-8">
              {ASSESSMENT_TERMS.map((c, i) => (
                <li key={c.id} id={c.id} className="scroll-mt-28">
                  <h3 className="text-[1.15rem] font-bold">{i + 1}. {c.title}</h3>
                  {c.paras.map((p) => <p key={p} className="mt-2 text-ink/80">{p}</p>)}
                  {c.list && <ul className="mt-2 list-disc space-y-1 pl-6 text-ink/80">{c.list.map((l) => <li key={l}>{l}</li>)}</ul>}
                </li>
              ))}
            </ol>
          </div>
        )}
        {slug === "terms" && (
          <div id="notices" className="mt-12 scroll-mt-28">
            <h2 className="display d-md">Key notices</h2>
            <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {NOTICES.map(([t, b]) => <div key={t} className="grid gap-2 py-5 sm:grid-cols-[0.7fr_1.3fr]"><dt className="font-bold">{t}</dt><dd className="text-ink/80">{b}</dd></div>)}
            </dl>
          </div>
        )}
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
