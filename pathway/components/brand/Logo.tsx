import { useId } from "react";
import { LETTERS, LOGO_VIEWBOX, PATHWAY_D, SOCCER_D, STROKE } from "./logo-geometry";

type Variant = "reversed" | "primary" | "black";
const COLORS: Record<Variant, { ink: string; route: string; soccer: string }> = {
  reversed: { ink: "#FFFFFF", route: "#FFD23F", soccer: "#AEB6C4" },
  primary: { ink: "#0D1B36", route: "#E0A800", soccer: "#5E6878" },
  black: { ink: "#000000", route: "#000000", soccer: "#000000" },
};

export function Globe({ ink, route, id }: { ink: string; route: string; id: string }) {
  return (
    <>
      <defs><clipPath id={id}><circle cx="160" cy="50" r="33.5" /></clipPath></defs>
      <g fill="none">
        <path d="M199 35.8A41.5 41.5 0 1 1 177.5 12.4" stroke={ink} strokeWidth={STROKE} />
        <g clipPath={`url(#${id})`} stroke={ink} strokeWidth="4">
          <ellipse cx="160" cy="50" rx="14" ry="34" />
          <path d="M160 14V86" />
          <path d="M124 36Q160 46 196 36M122 62Q160 72 198 62" />
        </g>
        <path d="M129 83C151 73 174 52 191 21" stroke={route} strokeWidth="7" />
        <path d="M200 5L185 17.5L198.5 25Z" fill={route} />
      </g>
    </>
  );
}

export function Logo({ variant = "reversed", className, descriptor = true }: { variant?: Variant; className?: string; descriptor?: boolean }) {
  const c = COLORS[variant];
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={descriptor ? LOGO_VIEWBOX : "0 0 888 104"} className={className} role="img" aria-label="Concordia Soccer · European Pathway">
      <g fill="none" stroke={c.ink} strokeWidth={STROKE}>
        {LETTERS.map((d, i) => <path key={i} d={descriptor || i !== 1 ? d : d.replace("140V0", "100V0")} />)}
      </g>
      <Globe ink={c.ink} route={c.route} id={`g${id}`} />
      {descriptor && (<><path d={SOCCER_D} fill={c.soccer} /><path d={PATHWAY_D} fill={c.ink} /></>)}
    </svg>
  );
}

export function Mark({ className, ink = "#FFFFFF", route = "#FFD23F" }: { className?: string; ink?: string; route?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="110 0 100 100" className={className} role="img" aria-label="Concordia Soccer">
      <Globe ink={ink} route={route} id={`m${id}`} />
    </svg>
  );
}
