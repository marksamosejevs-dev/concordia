import Image from "next/image";
import { cn } from "@/lib/utils";
import { publicAssetExists } from "@/lib/server-assets";
import type { Player } from "@/data/players";

export default function PlayerPhoto({
  player,
  className,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority = false,
}: {
  player: Player;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const hasPhoto = publicAssetExists(player.photo);
  const initials = `${player.firstName.charAt(0)}${player.lastName.charAt(0)}`;

  if (hasPhoto) {
    return (
      <div className={cn("overflow-hidden bg-ink", className ?? "absolute inset-0")}>
        <Image
          src={player.photo}
          alt={player.fullName}
          fill
          sizes={sizes}
          priority={priority}
          className="photo-illustrated object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="photo-illustrated-texture pointer-events-none absolute inset-0" />
        <div className="photo-illustrated-vignette pointer-events-none absolute inset-0" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden bg-ink text-paper",
        className ?? "absolute inset-0",
      )}
      role="img"
      aria-label={`${player.fullName} — photograph pending`}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 400 400"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 44}
            x2="400"
            y2={i * 44}
            stroke="white"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 44}
            y1="0"
            x2={i * 44}
            y2="400"
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
      <span className="relative font-sans text-[clamp(3.5rem,10vw,6rem)] font-bold leading-none tracking-tighter opacity-90">
        {initials}
      </span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.3em] text-paper/60">
        Photograph Pending
      </span>
    </div>
  );
}
