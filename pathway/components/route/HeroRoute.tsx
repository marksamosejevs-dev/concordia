import { EuropeOutline } from "./EuropeOutline";

/**
 * THE ROUTE — hero manifestation. The line crosses the Atlantic from the left edge,
 * reaches a decision node, and branches. It does not automatically end in Europe.
 */
export function HeroRoute({ className = "" }: { className?: string }) {
  const branches = [-150, -105, -62, -22, 18, 58, 100, 142, 185];
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <EuropeOutline className="absolute right-[-18%] top-[-6%] h-[115%] w-[95%] opacity-70 md:right-[-6%] md:w-[70%]" />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="fadeL" x1="0" x2="1"><stop offset="0" stopColor="#FFD23F" stopOpacity="0" /><stop offset="0.25" stopColor="#FFD23F" stopOpacity="1" /></linearGradient>
        </defs>
        <path d="M-40 905 C 380 885, 660 790, 920 610 S 1120 440, 1170 420" fill="none" stroke="url(#fadeL)" strokeWidth="3" className="route-draw" style={{ ["--len" as string]: 1500 }} />
        <g className="route-draw" style={{ ["--len" as string]: 400, animationDelay: "1.5s" }}>
          {branches.map((dy, i) => (
            <path key={i} d={`M1170 420 C 1260 420, 1300 ${420 + dy * 0.6}, 1420 ${420 + dy}`} fill="none" stroke="#FFD23F" strokeOpacity={i === 4 ? 0.9 : 0.28} strokeWidth={i === 4 ? 2.5 : 1.5} />
          ))}
        </g>
        <circle cx="1170" cy="420" r="9" fill="#FFD23F" className="pulse" />
        <circle cx="1170" cy="420" r="5" fill="#0D1B36" />
      </svg>
    </div>
  );
}
