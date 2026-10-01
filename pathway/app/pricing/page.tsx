import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Kicker } from "@/components/ui/Section";
import { ApplyCta } from "@/components/ui/Cta";
import { PriceCard } from "@/components/cards/PriceCard";
import { Gate } from "@/components/ui/Gate";
import { product, programmeFor, ASSESSMENT_CREDIT } from "@/content/products";
import { usd } from "@/lib/format";
import { NotRepresentation, FinalCta } from "@/components/sections/HomeSections";
import { LEGAL_ENTITY } from "@/content/site";

export const metadata: Metadata = { title: "Pricing", description: "Transparent pricing. No hidden fees. No guaranteed outcomes." };

const ROWS: [string, (id: string) => string][] = [
  ["Term", (id) => product(id).term],
  ["Full-match analyses", (id) => ({ cohort: "1 per quarter", window: "2 per window cycle", "two-window": "4", elite: "6", club: "—" } as Record<string, string>)[id]],
  ["Individual calls", (id) => ({ cohort: "1 per quarter", window: "Monthly, 45 min", "two-window": "Monthly, 45 min", elite: "Fortnightly + monthly with a FIFA Licensed Football Agent", club: "Monthly group call" } as Record<string, string>)[id]],
  ["Opportunity vetting", (id) => ({ cohort: "Included", window: "Unlimited · 48h", "two-window": "Unlimited · 48h", elite: "Unlimited · 24h", club: "Included" } as Record<string, string>)[id]],
  ["Market briefings", (id) => ({ cohort: "European market briefings", window: "Per target country", "two-window": "Per target country", elite: "Bespoke report, 2 countries", club: "Monthly update" } as Record<string, string>)[id]],
  ["Parent / family calls", (id) => ({ cohort: "—", window: "Quarterly", "two-window": "Quarterly", elite: "Quarterly family call", club: "—" } as Record<string, string>)[id]],
  ["Re-assessment", (id) => ({ cohort: "—", window: "—", "two-window": "End of year", elite: "End of year", club: "Quarterly profile review" } as Record<string, string>)[id]],
  ["Legal credits", (id) => (id === "elite" ? "2 prepaid, provided separately" : "—")],
];
const IDS = ["cohort", "window", "two-window", "elite", "club"];

export default function PricingPage() {
  const a = product("assessment");
  return (
    <>
      <PageHero eyebrow="Pricing" title={<>Transparent pricing. <span className="text-route">No hidden fees. No guaranteed outcomes.</span></>} lede="Current prices in USD. Every programme starts with an assessment." />
      <Section tone="ink" label="Assessment" className="!pt-6">
        <div className="wrap" data-hide-sticky>
          <div className="flex flex-col justify-between gap-6 border border-route/70 bg-ink-deep p-7 sm:p-10 lg:flex-row lg:items-center">
            <div><p className="eyebrow text-route">Start here</p><p className="display d-md mt-2">{a.name}</p><p className="mt-2 max-w-xl text-white/75">Written report · full-match review · level band · three market directions · passport analysis · 90-day plan · 30-minute review call</p><p className="mono mt-3 text-[0.72rem] text-slate-light">${ASSESSMENT_CREDIT.amount} credited toward any programme booked within {ASSESSMENT_CREDIT.days} days</p></div>
            <div className="flex flex-col items-start gap-4 lg:items-end"><p className="display text-[5rem] leading-none text-route">{usd(a.price)}</p><ApplyCta /></div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{["cohort", "window", "two-window", "elite"].map((id) => <PriceCard key={id} p={product(id)} c={programmeFor(id)} featured={id === "window"} limit={5} />)}</div>
          <div className="mt-6 flex flex-col justify-between gap-3 border border-white/12 p-6 sm:flex-row sm:items-center"><p className="display text-[1.6rem] leading-none">Pathway Club · <span className="text-route">{usd(product("club").price)}/month</span></p><p className="text-white/70">Alumni only · {programmeFor("club").concept}</p></div>
        </div>
      </Section>
      <Section tone="deep" label="Compare everything">
        <div className="wrap">
          <Kicker>Compare everything</Kicker>
          <div className="rail -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)]">
            <table className="w-full min-w-[820px] border-collapse text-left text-[0.9rem]">
              <thead><tr className="border-b-2 border-white/30"><th className="sticky left-0 bg-ink-deep py-4 pr-4 font-normal text-slate-light">&nbsp;</th>{IDS.map((id) => <th key={id} scope="col" className="py-4 pr-4 align-bottom"><span className="display block text-[1.25rem] leading-none">{product(id).name}</span><span className="display text-[1.4rem] text-route">{usd(product(id).price)}{id === "club" ? "/mo" : ""}</span></th>)}</tr></thead>
              <tbody>{ROWS.map(([label, fn]) => <tr key={label} className="border-b border-white/10"><th scope="row" className="sticky left-0 bg-ink-deep py-4 pr-4 font-semibold">{label}</th>{IDS.map((id) => <td key={id} className="py-4 pr-4 text-white/80">{fn(id)}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="mono mt-4 text-[0.68rem] text-slate-light lg:hidden">Swipe the table sideways →</p>
        </div>
      </Section>
      <Section tone="paper" label="Refunds and terms">
        <div className="wrap grid gap-10 lg:grid-cols-3">
          <div><p className="display d-md">Refunds</p><Gate evidence={{ state: "pending", ref: "E24" }} label="approved refund text"><p className="mt-4 text-ink/80">Assessment: full refund until the review of your match begins. Programmes: 14-day refund minus assessment value; thereafter pro-rata only for our non-performance. Injury pause up to 60 days.</p></Gate></div>
          <div><p className="display d-md">Instalments</p><Gate evidence={{ state: "pending", ref: "E21" }} label="instalment approval"><p className="mt-4 text-ink/80">Window 3 × $850 · Two-Window 6 × $750 · Elite 4 × $2,000</p></Gate><p className="mt-4 text-ink/60 text-[0.9rem]">Instalment options will appear here once confirmed.</p></div>
          <div><p className="display d-md">Who you contract with</p><p className="mt-4 text-ink/80">{LEGAL_ENTITY.name} · Reg. No. {LEGAL_ENTITY.registrationNo} · VAT {LEGAL_ENTITY.vatNo}. Prices exclude any applicable taxes, shown at payment.</p></div>
        </div>
        <p className="wrap mono mt-10 text-[0.7rem] text-ink/60">No former prices, discounts or countdowns are shown. Formal representation is never for sale.</p>
      </Section>
      <NotRepresentation />
      <FinalCta />
    </>
  );
}
