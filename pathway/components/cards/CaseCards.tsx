import Image from "next/image";
import type { AgencyCase, WorkedExample } from "@/content/cases";
import { decisions } from "@/content/decisions";
import { Gate } from "@/components/ui/Gate";

const label = (k: string) => decisions.find((d) => d.key === k)!.label;

/** WORKED EXAMPLE — FICTIONAL PLAYER. Paper card, dashed route, no photography. */
export function WorkedExampleCard({ x, compact = false }: { x: WorkedExample; compact?: boolean }) {
  return (
    <article className="on-paper flex h-full flex-col border-t-[6px] border-dashed border-ink">
      <div className="border-b-2 border-dashed border-ink/40 bg-white px-6 py-3">
        <p className="mono text-[0.72rem] font-semibold uppercase tracking-[0.14em]">Worked example — fictional player</p>
        <p className="mt-0.5 text-[0.75rem] text-ink/65">Illustrates how an assessment reasons. Not a real person or outcome.</p>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="display text-[2rem] leading-[0.95]">{x.title}</h3>
        <ul className="mono mt-4 flex flex-wrap gap-2 text-[0.7rem]">{x.profile.map((p) => <li key={p} className="border border-ink/25 px-2 py-1">{p}</li>)}</ul>
        <p className="mt-5 font-semibold">Question: {x.question}</p>
        {!compact && (
          <>
            <p className="mono mt-5 text-[0.65rem] uppercase tracking-[0.12em] text-ink/55">What we’d examine</p>
            <ul className="mt-2 space-y-1 text-[0.92rem]">{x.examine.map((e) => <li key={e}>— {e}</li>)}</ul>
            <p className="mono mt-5 text-[0.65rem] uppercase tracking-[0.12em] text-ink/55">Reasoning</p>
            <p className="mt-2 text-[0.95rem] leading-relaxed">{x.reasoning}</p>
          </>
        )}
        <div className="mt-auto pt-6">
          <svg viewBox="0 0 300 40" className="h-8 w-full" aria-hidden>
            <path d="M0 20 H120" stroke="#0D1B36" strokeWidth="2" strokeDasharray="5 5" />
            {[-14, 0, 14].map((dy, i) => <path key={i} d={`M120 20 C 160 20, 170 ${20 + dy}, 210 ${20 + dy}`} fill="none" stroke="#0D1B36" strokeOpacity={i === 1 ? 1 : 0.25} strokeWidth="2" strokeDasharray="5 5" />)}
            <circle cx="120" cy="20" r="5" fill="#0D1B36" />
          </svg>
          <p className="display mt-1 text-[1.9rem] leading-none text-route-deep">{x.decision.map(label).join(" → ")}</p>
          {!compact && <p className="mt-3 text-[0.92rem] text-ink/75">{x.next}</p>}
          {x.legalReview && <Gate evidence={{ state: "pending", ref: "LEGAL" }} label="minors wording — football-lawyer review"><span className="sr-only">Legal review pending</span></Gate>}
        </div>
      </div>
    </article>
  );
}

/** CONCORDIA SPORTS AGENCY CASE. Ink card, solid white route, real (consented) photo. */
export function AgencyCaseCard({ c }: { c: AgencyCase }) {
  return (
    <Gate evidence={c.evidence} label="case facts + consent">
      <article className="flex h-full flex-col border border-white/20 bg-ink-deep">
        <div className="bg-white px-6 py-3 text-ink">
          <p className="mono text-[0.72rem] font-semibold uppercase tracking-[0.14em]">Concordia Sports Agency case</p>
          <p className="mt-0.5 text-[0.75rem] text-ink/70">Representation work. Not a European Pathway result.</p>
        </div>
        {c.photo && <div className="relative aspect-[16/11]"><Image src={c.photo} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="photo-grade object-cover" /></div>}
        <div className="flex flex-1 flex-col p-6">
          <div className="mono flex items-center gap-3 text-[0.72rem] text-slate-light"><span>{c.from ?? "[FROM — E14]"}</span><span className="h-[2px] flex-1 bg-white" /><span className="text-white">{c.to}</span></div>
          <h3 className="display mt-5 text-[1.9rem] leading-[0.95]">{c.title}</h3>
          <dl className="mt-5 space-y-2 text-[0.9rem]">
            {(["situation", "decision", "result"] as const).map((k) => <div key={k}><dt className="mono inline text-[0.62rem] uppercase tracking-[0.12em] text-slate">{k} </dt><dd className="inline text-white/80">{c[k] ?? `[${k.toUpperCase()} — E14]`}</dd></div>)}
          </dl>
          <p className="mono mt-auto pt-6 text-[0.68rem] text-slate-light">Acting entity: {c.role}. No outcome shown is typical or guaranteed.</p>
        </div>
      </article>
    </Gate>
  );
}
