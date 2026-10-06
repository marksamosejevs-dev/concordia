import type { ReactNode } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow flex items-center gap-3 ${className}`}><span className="inline-block h-px w-8 bg-route" aria-hidden />{children}</p>;
}

export type Tone = "ink" | "paper" | "deep" | "white" | "route" | "blue";
const TONES: Record<Tone, string> = { ink: "on-ink", paper: "on-paper", deep: "on-deep", white: "on-white", route: "on-route", blue: "on-blue" };

export function Section({ id, tone = "ink", className = "", children, label }: { id?: string; tone?: Tone; className?: string; children: ReactNode; label?: string }) {
  const t = TONES[tone];
  return <section id={id} aria-label={label} className={`${t} relative overflow-hidden py-[clamp(4.5rem,11vw,9rem)] ${className}`}>{children}</section>;
}

export function Kicker({ n, children, className = "text-slate" }: { n?: string; children: ReactNode; className?: string }) {
  return <div className={`mono mb-6 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.14em] ${className}`}>{n && <span className="text-current opacity-60">{n}</span>}{children}</div>;
}
