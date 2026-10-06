import { FLOW } from "@/content/assessment";

/**
 * The whole assessment journey on one line — readable in about five seconds.
 * `current` highlights where the visitor is (0-based). Horizontal on desktop, compact two-column on mobile.
 */
export function FlowLine({ current, tone = "dark", className = "" }: { current?: number; tone?: "dark" | "light" | "blue"; className?: string }) {
  const light = tone === "light";
  return (
    <ol className={`relative grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-3 ${className}`} aria-label="From application to next steps">
      <span className={`absolute left-0 right-0 top-[9px] hidden h-[2px] lg:block ${light ? "bg-ink/15" : "bg-white/20"}`} aria-hidden />
      {FLOW.map((f, i) => {
        const done = current !== undefined && i < current, now = current === i, money = f.k.startsWith("$");
        return (
          <li key={f.k} className="relative">
            <span className={`relative z-[1] block h-[20px] w-[20px] rounded-full border-[3px] ${now ? "border-route bg-route" : done ? (light ? "border-ink bg-ink" : "border-white bg-white") : money ? "border-route bg-transparent" : light ? "border-ink/30 bg-paper" : "border-white/40 bg-ink"}`} aria-hidden />
            <p className={`mt-3 font-bold leading-tight ${money ? `display text-[1.6rem] ${light ? "text-route-deep" : "text-route"}` : "text-[0.98rem]"} ${now ? (light ? "text-ink" : "text-white") : ""}`}>{f.k}{now && <span className="sr-only"> (you are here)</span>}</p>
            <p className={`mt-0.5 text-[0.78rem] leading-snug ${light ? "text-ink/60" : "text-white/60"}`}>{f.b}</p>
          </li>
        );
      })}
    </ol>
  );
}
