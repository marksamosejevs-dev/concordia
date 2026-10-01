import Image from "next/image";
import type { DocPhoto } from "@/content/photos";
import { IS_REVIEW } from "@/lib/site-mode";

/** Documentary photo. Hold = hidden in production. Pending caption facts = shown tagged in review, trimmed in production. */
export function DocFigure({ photo, className = "", sizes = "(min-width:1024px) 40vw, 100vw", priority = false, ratio, captionTone = "light" }: { photo: DocPhoto; className?: string; sizes?: string; priority?: boolean; ratio?: string; captionTone?: "light" | "dark" }) {
  const isHold = photo.evidence.state === "hold";
  if (isHold && !IS_REVIEW) return null;
  const pendingCaption = photo.evidence.state === "pending" || isHold;
  const publicCaption = photo.caption.replace(/\s*\[[^\]]*\]/g, "").trim();
  return (
    <figure className={`${isHold ? "gated" : ""} ${className}`}>
      {isHold && <span className="gate-tag absolute -top-3 left-2 z-10">Hold · {photo.evidence.ref}</span>}
      <div className="relative overflow-hidden bg-ink-soft" style={{ aspectRatio: ratio ?? `${photo.w}/${photo.h}` }}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="photo-grade object-cover" />
      </div>
      <figcaption className={`mono mt-3 text-[0.68rem] leading-relaxed tracking-[0.04em] ${captionTone === "dark" ? "text-ink/60" : "text-slate-light"}`}>
        {IS_REVIEW && pendingCaption ? <span className="pending-inline">{photo.caption}<sup className="ml-1">{photo.evidence.ref}</sup></span> : publicCaption}
      </figcaption>
    </figure>
  );
}
