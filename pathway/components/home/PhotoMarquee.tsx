import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Parallax } from "@/components/ui/Parallax";
import { photos, type DocPhoto } from "@/content/photos";
import { IS_REVIEW } from "@/lib/site-mode";

/**
 * Inside football — two rows of photography that slide in opposite directions with the scroll,
 * under one oversized line. Add or reorder photos in ROWS; held photos never render in production;
 * photos whose file isn't uploaded yet are skipped. (Wembley is deliberately not in this sequence.)
 */
const ROWS: string[][] = [
  ["cwcPitchWhite", "okmk", "emilijaSassuolo", "chairmanShirt", "cwcPitchBlue", "coaches"],
  ["stadium", "hotelLobby", "clubChairman", "korona", "lff", "certificate"],
];
const usable = (p?: DocPhoto) => !!p && (p.evidence.state !== "hold" || IS_REVIEW) && fs.existsSync(path.join(process.cwd(), "public", p.src));

export function PhotoMarquee() {
  const rows = ROWS.map((r) => r.map((id) => photos[id]).filter(usable));
  return (
    <Parallax as="section" className="on-ink relative overflow-hidden py-[clamp(4.5rem,10vw,7.5rem)]">
      <div className="space-y-3 sm:space-y-4" aria-hidden>
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-3 sm:gap-4" style={{ transform: ri === 0 ? "translate3d(calc(var(--sp) * -28vw), 0, 0)" : "translate3d(calc(-28vw + var(--sp) * 28vw), 0, 0)" }}>
            {[...row, ...row].map((p, n) => (
              <div key={`${p.id}-${n}`} className={`group relative h-[34vw] max-h-[300px] min-h-[150px] shrink-0 overflow-hidden rounded-[10px] ${p.w > p.h ? "w-[48vw] max-w-[420px] min-w-[210px]" : "w-[26vw] max-w-[225px] min-w-[115px]"} ${p.evidence.state === "hold" ? "outline-[1.5px] outline-dashed outline-route/80" : ""}`}>
                <Image src={p.src} alt="" fill sizes="(min-width:1024px) 420px, 48vw" className="photo-grade object-cover transition-transform duration-[1.2s] group-hover:scale-[1.07]" style={{ objectPosition: "50% 30%" }} />
                {IS_REVIEW && p.evidence.state === "hold" && <span className="gate-tag absolute left-1.5 top-1.5">Hold · {p.evidence.ref}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <h2 className="display px-4 text-center text-[clamp(3rem,9vw,8.5rem)] leading-[0.86] [text-shadow:0_6px_40px_rgba(8,17,39,0.85)]">Built inside<br /><span className="text-route">football.</span></h2>
      </div>
      <p className="wrap relative mt-10 max-w-xl text-[1.05rem] text-white/80">Concordia Soccer comes from the founders and team behind Concordia Sports Agency.</p>
    </Parallax>
  );
}
