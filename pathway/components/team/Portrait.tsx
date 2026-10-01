import Image from "next/image";

/**
 * Deliberate production placeholder for the forthcoming team photoshoot (E33):
 * Night Ink field in the exact crop ratio, low-contrast initials, Route Yellow corner rule.
 * When photos arrive, pass `src` — layout and crops stay identical.
 */
const RATIOS = { desktopPortrait: "4/5", mobilePortrait: "4/5", gridCrop: "3/4", aboutCrop: "3/2", avatar: "1/1" } as const;
export type Crop = keyof typeof RATIOS;

export function Portrait({ name, src, crop = "gridCrop", className = "", sizes = "(min-width: 1024px) 30vw, 90vw" }: { name: string; src?: string; crop?: Crop; className?: string; sizes?: string }) {
  const initials = name.split(" ").map((p) => p[0]).join("");
  return (
    <div className={`relative overflow-hidden bg-ink-soft ${className}`} style={{ aspectRatio: RATIOS[crop] }}>
      {src ? (
        <Image src={src} alt={name} fill sizes={sizes} className="object-cover" />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_10%,#1E3C9C33,transparent_60%)]" aria-hidden />
          <svg viewBox="0 0 100 125" className="absolute inset-x-0 bottom-0 h-[78%] w-full opacity-[0.16]" aria-hidden preserveAspectRatio="xMidYMax meet">
            <circle cx="50" cy="42" r="17" fill="#AEB6C4" />
            <path d="M14 125c2-28 17-44 36-44s34 16 36 44z" fill="#AEB6C4" />
          </svg>
          <span className="display absolute bottom-3 left-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-white/[0.12]" aria-hidden>{initials}</span>
          <span className="absolute right-0 top-0 h-10 w-[3px] bg-route" aria-hidden />
          <span className="absolute right-0 top-0 h-[3px] w-10 bg-route" aria-hidden />
          <span className="mono absolute left-4 top-4 text-[0.58rem] uppercase tracking-[0.14em] text-white/45">Team photography to follow</span>
        </>
      )}
    </div>
  );
}
