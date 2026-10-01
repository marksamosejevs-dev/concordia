import { MAP } from "@/content/countries";

/** Faint pre-projected Europe outline used behind the hero and final CTA. */
export function EuropeOutline({ className = "", highlight }: { className?: string; highlight?: string[] }) {
  return (
    <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="#7D8797" strokeOpacity="0.32" strokeWidth="1">
        {MAP.countries.map((c) => (
          <path key={c.name} d={c.d} fill={highlight?.includes(c.iso ?? "") ? "rgba(30,60,156,0.45)" : "transparent"} />
        ))}
      </g>
    </svg>
  );
}
