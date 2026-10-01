import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import type { ProgrammeContent } from "@/content/products";
import { ELITE_CAPACITY } from "@/content/products";
import { usd } from "@/lib/format";
import { Pending } from "@/components/ui/Gate";
import { IS_REVIEW, FEATURES } from "@/lib/site-mode";

export function PriceCard({ p, c, featured = false, limit = 6 }: { p: Product; c: ProgrammeContent; featured?: boolean; limit?: number }) {
  const showLimited = p.label !== "Limited capacity" || ELITE_CAPACITY.seatsRemaining !== undefined || IS_REVIEW;
  return (
    <article className={`flex h-full flex-col border bg-ink-deep p-6 sm:p-7 ${featured ? "border-route/70 border-t-[4px] border-t-route" : "border-white/12"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="display text-[1.6rem] leading-none">{p.name}</h3>
          <p className="mono mt-2 text-[0.72rem] text-slate-light">{p.term}</p>
        </div>
        {p.label && showLimited && (p.label === "Limited capacity" ? <span className="mono text-[0.62rem] uppercase tracking-[0.12em]"><Pending evidence={ELITE_CAPACITY.evidence}>{p.label}</Pending></span> : <span className="mono whitespace-nowrap border border-route px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-route">{p.label}</span>)}
      </div>
      <p className="mt-5 text-[1rem] font-semibold">{c.concept}</p>
      <p className="mt-1 text-[0.88rem] text-white/65">Best for: {c.bestFor}</p>
      <p className="display mt-6 text-[clamp(3rem,5vw,4.2rem)] leading-none text-route">{usd(p.price)}{p.billingType === "recurring" && <span className="text-[0.4em] text-white/70">/month</span>}</p>
      {FEATURES.instalmentsPublic && p.instalmentOptions?.[0] && <p className="mono mt-2 text-[0.72rem]">or {p.instalmentOptions[0].count} × {usd(p.instalmentOptions[0].amount)}</p>}
      <ul className="mt-6 space-y-2.5 text-[0.9rem] text-white/85">
        {c.inclusions.slice(0, limit).map((x) => <li key={x} className="flex gap-3"><span className="mt-2 inline-block h-[5px] w-[5px] shrink-0 bg-route" />{x}</li>)}
        {c.inclusions.length > limit && <li className="mono pl-[17px] text-[0.72rem] text-slate-light">+ {c.inclusions.length - limit} more</li>}
      </ul>
      <div className="mt-auto pt-7">
        <Link href={`/programmes/${p.slug}`} className="btn btn-ghost w-full">Details <span className="arrow">→</span></Link>
        <p className="mono mt-3 text-center text-[0.65rem] uppercase tracking-[0.1em] text-slate-light">Assessment first · Career advisory. Not representation.</p>
      </div>
    </article>
  );
}
