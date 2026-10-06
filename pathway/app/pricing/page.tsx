import type { Metadata } from "next";
import Link from "next/link";
import { ApplyCta } from "@/components/ui/Cta";
import { Gate } from "@/components/ui/Gate";
import { product, ASSESSMENT_CREDIT } from "@/content/products";
import { PATHWAY_TERMS, ASSESSMENT_POINTS, PILLARS } from "@/content/pathway";
import { LEGAL_ENTITY, CTA } from "@/content/site";
import { usd } from "@/lib/format";
import { pending } from "@/lib/evidence";

export const metadata: Metadata = { alternates: { canonical: "/pricing/" }, title: "Pricing — $249 assessment, then $399/month",
  description: "Two steps, clear prices. Player Pathway Assessment $249 one time. European Pathway career management $399 per month, designed as a 6-month pathway.",
};

export default function PricingPage() {
  const a = product("assessment"); const p = product("pathway");
  return (
    <>
      <section className="on-ink pb-14 pt-[calc(var(--header-h)+3rem)]" aria-label="Pricing">
        <div className="wrap">
          <h1 className="display d-hero max-w-[14ch]">Two steps. <span className="text-route">Clear prices.</span></h1>
          <p className="lede mt-6 max-w-xl text-white/80">Apply free. If you’re accepted, start with the assessment. Continue with the pathway when it makes sense for you.</p>
        </div>
      </section>

      <section className="on-paper py-[clamp(3.5rem,8vw,6rem)]" aria-label="Products" data-hide-sticky>
        <div className="wrap grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <article className="flex flex-col border-2 border-ink bg-white p-7 sm:p-9">
            <p className="mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/55">Step 1 · Start</p>
            <h2 className="display mt-2 text-[clamp(2rem,3.4vw,2.8rem)] leading-none">{a.name}</h2>
            <p className="display mt-7 text-[clamp(4rem,8vw,6rem)] leading-[0.82]">{usd(a.price)}</p>
            <p className="mono mt-2 text-[0.72rem] uppercase tracking-[0.12em] text-ink/60">One time · report in 7 business days</p>
            <ul className="mt-7 space-y-2.5">{ASSESSMENT_POINTS.map((x) => <li key={x} className="flex gap-3"><span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-ink" aria-hidden />{x}</li>)}</ul>
            <div className="mt-auto pt-9"><ApplyCta tone="ink" /></div>
          </article>
          <span className="display grid place-items-center text-[2.5rem]" aria-hidden><span className="rotate-90 lg:rotate-0">→</span></span>
          <article className="on-route flex flex-col p-7 sm:p-9">
            <p className="mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/65">Step 2 · Continue</p>
            <h2 className="display mt-2 text-[clamp(2rem,3.4vw,2.8rem)] leading-none">{p.name}</h2>
            <p className="display mt-7 text-[clamp(4rem,8vw,6rem)] leading-[0.82]">{usd(p.price)}<span className="text-[0.32em]"> / month</span></p>
            <p className="mono mt-2 text-[0.72rem] uppercase tracking-[0.12em] text-ink/70">{PATHWAY_TERMS.short}</p>
            <ul className="mt-7 space-y-2.5">{PILLARS.map((x) => <li key={x.key} className="flex gap-3"><span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-ink" aria-hidden />{x.name}</li>)}</ul>
            <div className="mt-auto pt-9"><Link href="/european-pathway" className="btn btn-ink">{CTA.pathway} <span className="arrow" aria-hidden>→</span></Link></div>
          </article>
        </div>
      </section>

      <section className="on-white py-[clamp(3.5rem,8vw,6rem)]" aria-label="How billing works">
        <div className="wrap grid gap-10 lg:grid-cols-3">
          <div>
            <h2 className="display d-md">How billing works</h2>
            <p className="mt-4 text-ink/80">{PATHWAY_TERMS.horizon}</p>
            <p className="mt-2 text-ink/80">{PATHWAY_TERMS.cancellation}</p>
            <p className="mt-2 text-ink/60 text-[0.9rem]">You never pay the six months upfront.</p>
          </div>
          <div>
            <h2 className="display d-md">Assessment credit</h2>
            <Gate evidence={pending("Founder Q3", "Credit toward the first Pathway month(s)?")} label="credit decision"><p className="mt-4 text-ink/80">${ASSESSMENT_CREDIT.amount} of your assessment credited toward European Pathway if you start within {ASSESSMENT_CREDIT.days} days.</p></Gate>
            <h2 className="display d-md mt-8">Refunds</h2>
            <Gate evidence={pending("E24")} label="approved refund text"><p className="mt-4 text-ink/80">Assessment: full refund until the review of your match begins. European Pathway: terms set out in the Refund &amp; Cancellation Policy.</p></Gate>
          </div>
          <div>
            <h2 className="display d-md">Who you contract with</h2>
            <p className="mt-4 text-ink/80">{LEGAL_ENTITY.name} · Reg. No. {LEGAL_ENTITY.registrationNo} · VAT {LEGAL_ENTITY.vatNo}. Prices in USD; any applicable taxes are shown at payment.</p>
            <p className="mt-4 text-[0.9rem] text-ink/60"><Link href="/legal/terms#notices" className="underline underline-offset-4">Terms &amp; key notices</Link> · <Link href="/legal/refunds" className="underline underline-offset-4">Refunds &amp; cancellations</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
