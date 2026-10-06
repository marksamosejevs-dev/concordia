import type { ReactNode } from "react";
import { EuropeDots } from "@/components/route/EuropeDots";

/** Inner-page hero. `eyebrow` is kept for page metadata/back-compat but no longer rendered (no template labels). */
export function PageHero({ title, lede, children, tone = "ink", map = true }: { eyebrow?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode; tone?: "ink" | "paper"; map?: boolean }) {
  return (
    <section className={`${tone === "paper" ? "on-paper" : "on-ink"} relative overflow-hidden pb-[clamp(3.5rem,8vw,6.5rem)] pt-[calc(var(--header-h)+clamp(3rem,8vw,6rem))]`}>
      {map && tone === "ink" && <div className="absolute inset-y-0 right-[-30%] w-[95%] opacity-70 md:right-[-6%] md:w-[60%]"><EuropeDots className="h-full w-full" align={0.6} /></div>}
      {tone === "ink" && (
        <svg viewBox="0 0 1600 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full" aria-hidden>
          <path d="M-20 470 C 500 450, 1000 380, 1620 300" stroke="#FFD23F" strokeOpacity="0.55" strokeWidth="2" fill="none" className="route-draw" style={{ ["--len" as string]: 1800 }} />
        </svg>
      )}
      <div className="wrap relative">
        <h1 className="display d-xl max-w-[17ch]">{title}</h1>
        {lede && <div className={`lede mt-7 max-w-2xl ${tone === "paper" ? "text-ink/75" : "text-white/80"}`}>{lede}</div>}
        {children && <div className="mt-9">{children}</div>}
      </div>
    </section>
  );
}
