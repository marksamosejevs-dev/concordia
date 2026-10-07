import Image from "next/image";

/**
 * CONCORDIA SOCCER · EUROPEAN PATHWAY — the founder-supplied logo artwork (source of truth, not redrawn).
 * Files: public/assets/pathway/brand/concordia-soccer-logo-{white,black}.png = the supplied artwork with only the
 * empty margin trimmed; the -1000 files are the same artwork scaled for the web. White on dark, black on light.
 */
const SRC = { white: "/assets/pathway/brand/concordia-soccer-logo-white-1000.png", black: "/assets/pathway/brand/concordia-soccer-logo-black-1000.png" };
export const LOGO_RATIO = { white: [1000, 157], black: [1000, 153] } as const;

export function BrandLogo({ tone = "white", className, priority }: { tone?: "white" | "black"; className?: string; priority?: boolean }) {
  const [w, h] = LOGO_RATIO[tone];
  return <Image src={SRC[tone]} width={w} height={h} alt="Concordia Soccer · European Pathway" unoptimized priority={priority} className={className} />;
}
