import Image from "next/image";
import { publicAssetExists } from "@/lib/server-assets";
import { FloodlightMotif } from "./motifs";

const HERO_PHOTO = "/football/hero-celebration.jpg";

export default function HeroBackground() {
  if (publicAssetExists(HERO_PHOTO)) {
    return (
      <div className="absolute inset-0">
        <Image
          src={HERO_PHOTO}
          alt="Concordia-represented players celebrating on the international stage"
          fill
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover object-[50%_25%] grayscale contrast-[1.05]"
        />
      </div>
    );
  }

  return <FloodlightMotif className="h-full w-full" />;
}
