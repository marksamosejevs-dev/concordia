import type { ReactNode } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow flex items-center gap-3 ${className}`}><span className="inline-block h-px w-8 bg-route" aria-hidden />{children}</p>;
}

export function Section({ id, tone = "ink", className = "", children, label }: { id?: string; tone?: "ink" | "paper" | "deep"; className?: string; children: ReactNode; label?: string }) {
  const t = tone === "paper" ? "on-paper" : tone === "deep" ? "on-deep" : "on-ink";
  return <section id={id} aria-label={label} className={`${t} relative overflow-hidden py-[clamp(4.5rem,11vw,9rem)] ${className}`}>{children}</section>;
}

export function Kicker({ n, children }: { n?: string; children: ReactNode }) {
  return <div className="mono mb-6 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.14em] text-slate">{n && <span className="text-route">{n}</span>}{children}</div>;
}
