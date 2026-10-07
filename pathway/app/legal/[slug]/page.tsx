import { IS_REVIEW } from "@/lib/site-mode";
import { RULES } from "@/content/business-rules";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { LEGAL_ENTITY } from "@/content/site";
import { LEGAL_DOCS, legalDoc } from "@/content/legal";

export function generateStaticParams() { return LEGAL_DOCS.map((d) => ({ slug: d.slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = legalDoc((await params).slug);
  return { title: d?.title ?? "Legal", description: d?.summary, alternates: { canonical: `/legal/${d?.slug ?? ""}` } };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = legalDoc((await params).slug); if (!d) notFound();
  return (
    <Section tone="paper" label={d.title} className="!pt-[calc(var(--header-h)+3rem)]">
      <div className="wrap-narrow">
        <p className="eyebrow text-ink/60">Legal</p>
        <h1 className="display d-lg mt-4">{d.title}</h1>
        <p className="mt-3 text-[0.9rem] text-ink/60">Last updated {d.updated} · {LEGAL_ENTITY.name}</p>
        <p className="lede mt-6 text-ink/80">{d.summary}</p>
        {IS_REVIEW && d.pending?.length ? <p className="mt-4 border-l-2 border-dashed border-ink/40 pl-3 text-[0.85rem] text-ink/70">Pre-launch preview: this document uses proposed defaults still awaiting owner confirmation — {d.pending.map((k) => RULES[k].label).join("; ")}.</p> : null}
        <nav aria-label="Contents" className="mt-8 border-y border-ink/10 py-4 text-[0.88rem]"><ol className="grid gap-1 sm:grid-cols-2">{d.sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="underline decoration-ink/20 underline-offset-4 hover:decoration-ink">{s.title}</a></li>)}</ol></nav>
        <div className="mt-10 space-y-9">
          {d.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="text-[1.2rem] font-bold">{s.title}</h2>
              {s.paras?.map((p) => <p key={p} className="mt-3 leading-relaxed text-ink/80">{p}</p>)}
              {s.list && <ul className="mt-3 list-disc space-y-1.5 pl-6 leading-relaxed text-ink/80">{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
              {s.after?.map((p) => <p key={p} className="mt-3 leading-relaxed text-ink/80">{p}</p>)}
            </section>
          ))}
        </div>
        <nav aria-label="Other legal documents" className="mt-14 border-t border-ink/10 pt-6 text-[0.88rem]"><p className="font-semibold">Other documents</p><ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">{LEGAL_DOCS.filter((x) => x.slug !== d.slug).map((x) => <li key={x.slug}><Link href={`/legal/${x.slug}`} className="underline underline-offset-4">{x.title}</Link></li>)}</ul></nav>
      </div>
    </Section>
  );
}
