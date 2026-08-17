import Image from "next/image";
import { publicAssetExists } from "@/lib/server-assets";

const CAREERS_PHOTO = "/football/careers.jpg";

export default function CareersPhoto() {
  if (!publicAssetExists(CAREERS_PHOTO)) return null;

  return (
    <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden border border-line-invert">
      <Image
        src={CAREERS_PHOTO}
        alt="A Concordia-represented player"
        fill
        sizes="280px"
        className="object-cover object-top grayscale contrast-[1.05]"
      />
    </div>
  );
}
