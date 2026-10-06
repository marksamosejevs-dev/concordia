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

/**
 * Round 2: section kickers (small uppercase label above every headline, often numbered) read as a
 * generated template. Kept as an API so pages compile, but intentionally renders nothing —
 * hierarchy comes from the headline, imagery and interaction instead.
 */
export function Kicker(props: { n?: string; children: ReactNode; className?: string }) {
  void props;
  return null;
}
