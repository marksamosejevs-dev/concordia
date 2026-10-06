import Image from "next/image";
import type { DocPhoto } from "@/content/photos";
import { IS_REVIEW } from "@/lib/site-mode";

/**
 * Editorial photo tile for layouts (collages, hero, split sections).
 * Captions show only cleared facts (bracketed placeholders are stripped);
 * HOLD photos never render in production; in review they carry a tag.
 */
export function PhotoTile({ photo, className = "", sizes = "(min-width:1024px) 33vw, 90vw", priority = false, caption = true, position = "center", tone = "dark" }: { photo: DocPhoto; className?: string; sizes?: string; priority?: boolean; caption?: boolean; position?: string; tone?: "dark" | "light" }) {
  const isHold = photo.evidence.state === "hold";
  if (isHold && !IS_REVIEW) return null;
  const pendingFacts = photo.evidence.state !== "confirmed" && photo.evidence.state !== "document";
  const text = cleanCaption(photo.caption);
  return (
    <figure className={`group relative overflow-hidden bg-ink-soft ${isHold ? "outline-[1.5px] outline-dashed outline-route/80 outline-offset-2" : ""} ${className}`}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="photo-grade object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,.7,.2,1)] group-hover:scale-[1.05]" style={{ objectPosition: position }} />
      {isHold && <span className="gate-tag absolute left-2 top-2 z-10">Hold · {photo.evidence.ref}</span>}
      {caption && text && (
        <figcaption className={`mono absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t ${tone === "dark" ? "from-ink-deep/85" : "from-black/60"} to-transparent px-3 pb-2.5 pt-8 text-[0.6rem] uppercase leading-snug tracking-[0.08em] text-white/85`}>
          {text}{IS_REVIEW && pendingFacts && !isHold && <sup className="ml-1 text-route">{photo.evidence.ref}</sup>}
        </figcaption>
      )}
    </figure>
  );
}

/** Keeps only the cleared part of a caption: everything before the first [PLACEHOLDER], minus dangling connectors. */
export function cleanCaption(c: string) {
  const head = c.split("[")[0];
  return head.replace(/(\s+(with|at|in|joins))?[\s,]*$/i, "").trim();
}
