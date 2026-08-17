import Image from "next/image";
import { cn } from "@/lib/utils";
import { publicAssetExists } from "@/lib/server-assets";

export default function PersonPhoto({
  photo,
  name,
  className,
  sizes = "(min-width: 640px) 33vw, 100vw",
}: {
  photo: string;
  name: string;
  className?: string;
  sizes?: string;
}) {
  const hasPhoto = publicAssetExists(photo);
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2);
  // Avoid stacking a hardcoded "relative" alongside a caller-supplied "absolute" —
  // conflicting position utilities on one element let either win the cascade.
  const position = className?.includes("absolute") ? "" : "relative";

  if (hasPhoto) {
    return (
      <div className={cn(position, "overflow-hidden bg-ink", className)}>
        <Image
          src={photo}
          alt={name}
          fill
          sizes={sizes}
          className="photo-illustrated object-cover object-top"
        />
        <div className="photo-illustrated-texture pointer-events-none absolute inset-0" />
        <div className="photo-illustrated-vignette pointer-events-none absolute inset-0" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        position,
        "flex items-center justify-center overflow-hidden bg-ink text-paper",
        className,
      )}
      role="img"
      aria-label={`${name} — photograph pending`}
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.14]" viewBox="0 0 400 400" preserveAspectRatio="none">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * 44} x2="400" y2={i * 44} stroke="white" strokeWidth="1" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 44} y1="0" x2={i * 44} y2="400" stroke="white" strokeWidth="1" />
        ))}
      </svg>
      <span className="relative font-sans text-[clamp(2.5rem,8vw,4rem)] font-bold leading-none tracking-tighter opacity-90">
        {initials}
      </span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.3em] text-paper/60">
        Photograph Pending
      </span>
    </div>
  );
}
