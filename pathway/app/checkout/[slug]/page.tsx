import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, programmeFor } from "@/content/products";
import { accessCopy } from "@/lib/commerce/access";
import { usd } from "@/lib/format";

/** Programme enrolment entry. Programmes are assessment-required / invitation-only — never one-click. */
const list = () => products.filter((p) => p.access !== "application_required");
export function generateStaticParams() { return list().map((p) => ({ slug: p.slug })); }
export const dynamicParams = false;
export const metadata: Metadata = { title: "Enrolment" };

export default async function ProgrammeCheckout({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const p = list().find((x) => x.slug === slug); if (!p) notFound();
  const a = accessCopy[p.access];
  return (
    <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]">
      <div className="wrap-narrow">
        <div className="border border-white/15 bg-ink-deep p-7 sm:p-10">
          <p className="mono text-[0.72rem] uppercase tracking-[0.12em] text-route">{a.label}</p>
          <h1 className="display d-lg mt-4">{p.name}</h1>
          <p className="mt-2 text-white/75">{programmeFor(p.id).concept} · {p.term} · {usd(p.price)}{p.billingType === "recurring" ? "/month" : ""}</p>
          <p className="lede mt-6 text-white/85">{a.explain} Enrolment opens from your assessment results, with the programme your review recommends — so nobody buys Elite with one click.</p>
          <ol className="mt-8 grid gap-px bg-white/10 sm:grid-cols-4">
            {["Assessment", "Professional recommendation", "Appropriate programme", "Enrolment & payment"].map((s, i) => <li key={s} className="bg-ink-deep p-4"><span className="mono text-[0.7rem] text-route">0{i + 1}</span><p className="mt-1 font-semibold">{s}</p></li>)}
          </ol>
          <div className="mt-8 flex flex-wrap gap-4"><Link href="/apply" className="btn btn-route">Start with a free application →</Link><Link href={`/programmes/${p.slug}`} className="btn btn-ghost">Programme details</Link></div>
          <p className="mono mt-8 text-[0.68rem] text-slate">Programme checkout will use the same payment layer as the assessment ({p.billingType === "recurring" ? "recurring billing — not active" : "fixed term — not active"}).</p>
        </div>
      </div>
    </section>
  );
}
