import { JOURNEY_COMPACT } from "@/content/assessment";

/** Five-step journey — compact, never dominating the page. Vertical on mobile, horizontal from md. */
export function JourneyCompact({ className = "" }: { className?: string }) {
  return (
    <ol className={`grid gap-3 md:grid-cols-5 md:gap-4 ${className}`} aria-label="How it works">
      {JOURNEY_COMPACT.map((s, i) => (
        <li key={s.k} className="flex gap-3 md:block">
          <span className={`mono mt-0.5 shrink-0 text-[0.7rem] ${i === 0 ? "text-route" : "text-slate-light"}`}>0{i + 1}</span>
          <div><p className="text-[0.9rem] font-semibold leading-tight md:mt-1">{s.k}</p><p className="mt-0.5 text-[0.78rem] leading-snug text-white/60">{s.b}</p></div>
        </li>
      ))}
    </ol>
  );
}
