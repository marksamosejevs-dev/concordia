import Image from "next/image";
import { cn } from "@/lib/utils";
import { publicAssetExists } from "@/lib/server-assets";

const LOGO_CANDIDATES = [
  "/brand/concordia-logo.svg",
  "/brand/concordia-logo.png",
  "/brand/concordia-logo.jpg",
];

export default function Logo({
  invert = false,
  className,
}: {
  invert?: boolean;
  className?: string;
}) {
  const logoPath = LOGO_CANDIDATES.find((p) => publicAssetExists(p));

  if (logoPath) {
    return (
      <span className={cn("relative block h-6 w-auto sm:h-7", className)}>
        <Image
          src={logoPath}
          alt="Concordia Sports Agency"
          width={220}
          height={56}
          className={cn("h-full w-auto object-contain", invert && "invert")}
          priority
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-sans font-bold uppercase leading-none tracking-tight",
        invert ? "text-paper" : "text-ink",
        className,
      )}
      aria-label="Concordia Sports Agency"
    >
      <span className="block text-[1.05rem] tracking-[-0.01em] sm:text-[1.2rem]">
        Concordia
      </span>
      <span className="mt-0.5 block font-mono text-[0.5rem] font-medium tracking-[0.35em]">
        Sports Agency
      </span>
    </span>
  );
}
