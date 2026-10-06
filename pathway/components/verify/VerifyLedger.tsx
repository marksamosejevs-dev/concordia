"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { verifyEntries, type VerifyEntry } from "@/content/credentials";
import { isPublic } from "@/lib/evidence";
import { IS_REVIEW } from "@/lib/site-mode";
import { track } from "@/lib/analytics";

const visible = (e: VerifyEntry) => isPublic(e.evidence) || IS_REVIEW;

function StateBadge({ e }: { e: VerifyEntry }) {
  if (e.evidence.state === "confirmed") return <span className="mono flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.12em] text-route"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><circle cx="6" cy="6" r="6" fill="#FFD23F" /><path d="M3.2 6.2l1.8 1.8 3.8-4" stroke="#0D1B36" strokeWidth="1.6" fill="none" /></svg>Confirmed</span>;
  if (e.evidence.state === "document") return <span className="mono flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.12em] text-route"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><circle cx="6" cy="6" r="5.2" stroke="#FFD23F" strokeWidth="1.4" fill="none" /><path d="M3.4 6.2l1.7 1.7 3.6-3.8" stroke="#FFD23F" strokeWidth="1.5" fill="none" /></svg>Document viewable</span>;
  return <span className="gate-tag">Pending · {e.evidence.ref}</span>;
}

export function VerifyLedger({ mode = "compact", audience = "player", exclude = [] }: { mode?: "compact" | "full"; audience?: "player" | "parent"; exclude?: string[] }) {
  const [doc, setDoc] = useState<VerifyEntry | null>(null);
  const entries = verifyEntries.filter((e) => (mode === "full" || e.compact) && visible(e) && !exclude.includes(e.id));
  const act = (e: VerifyEntry) => {
    track("credential_open", { id: e.id });
    if (e.documentImage || !e.href) setDoc(e);
  };
  return (
    <>
      <ul className={mode === "compact" ? "rail -mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0" : "divide-y divide-white/10 border-y border-white/10"}>
        {entries.map((e) => (
          <li key={e.id} className={mode === "compact" ? `flex w-[78%] shrink-0 snap-start flex-col justify-between border border-white/12 bg-ink-deep/60 p-5 sm:w-[46%] lg:w-auto ${!isPublic(e.evidence) ? "gated" : ""}` : `grid gap-4 py-7 md:grid-cols-[1.3fr_1fr_auto] md:items-center ${!isPublic(e.evidence) ? "gated px-3" : ""}`}>
            <div>
              <StateBadge e={e} />
              <p className={`${mode === "compact" ? "mt-4 text-[1.02rem]" : "mt-3 text-[1.25rem]"} font-semibold leading-snug`}>{e.claim}</p>
              {e.detail && <p className="mono mt-1.5 text-[0.72rem] text-slate-light">{e.detail}</p>}
            </div>
            {mode === "full" && <p className="text-[0.95rem] leading-relaxed text-white/75"><span className="mono mr-2 text-[0.62rem] uppercase tracking-[0.12em] text-slate">So what</span>{audience === "parent" ? e.soWhatParent : e.soWhatPlayer}</p>}
            <div className={mode === "compact" ? "mt-6" : ""}>
              {e.href && !e.documentImage ? (
                <Link href={e.href} onClick={() => track("credential_verify_click", { id: e.id })} className="mono inline-flex items-center gap-2 border-b border-route pb-1 text-[0.72rem] uppercase tracking-[0.14em] text-route">{e.action} →</Link>
              ) : (
                <button onClick={() => act(e)} className="mono inline-flex items-center gap-2 border-b border-route pb-1 text-[0.72rem] uppercase tracking-[0.14em] text-route">{e.action} →</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {doc && <DocViewer e={doc} onClose={() => setDoc(null)} />}
    </>
  );
}

function DocViewer({ e, onClose }: { e: VerifyEntry; onClose: () => void }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div role="dialog" aria-modal="true" aria-label={e.claim} className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div className="on-ink max-h-[92dvh] w-full max-w-3xl overflow-y-auto border border-white/15 p-6 sm:p-8" onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-start justify-between gap-6">
          <div><StateBadge e={e} /><p className="display d-sm mt-3">{e.claim}</p>{e.detail && <p className="mono mt-1 text-[0.75rem] text-slate-light">{e.detail}</p>}</div>
          <button onClick={onClose} className="btn btn-ghost !min-h-[40px] !px-3" autoFocus>Close</button>
        </div>
        {e.documentImage ? (
          <div className="relative mt-6 overflow-hidden bg-ink-deep">
            <Image src={e.documentImage} alt={`${e.evidenceLabel} — ${e.claim}`} width={1200} height={772} className="h-auto w-full" />
            {!revealed && e.redact?.map((r) => (
              <span key={r.label} className="absolute backdrop-blur-xl bg-ink/40" style={{ top: r.top, left: r.left, width: r.width, height: r.height }} aria-label={`${r.label} redacted`} />
            ))}
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-white/20 p-8 text-center text-slate-light">Evidence document will appear here once cleared ({e.evidence.ref}).</div>
        )}
        {e.redact && IS_REVIEW && <button className="mono mt-3 text-[0.68rem] uppercase tracking-[0.1em] text-slate-light underline" onClick={() => setRevealed((v) => !v)}>Review only: {revealed ? "re-apply" : "show"} redaction (E5)</button>}
        {e.howToCheck && <p className="mt-6 text-[0.95rem] text-white/85"><span className="mono mr-2 text-[0.62rem] uppercase tracking-[0.12em] text-slate">How to check</span>{e.howToCheck}</p>}
        <p className="mt-4 text-[0.82rem] text-slate-light">Credentials belong to the individual named.</p>
      </div>
    </div>
  );
}
