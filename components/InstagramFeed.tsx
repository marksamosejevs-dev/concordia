import Image from "next/image";
import { publicAssetExists } from "@/lib/server-assets";
import { getInstagramPosts } from "@/lib/instagram";

const INSTAGRAM_URL = "https://www.instagram.com/concordia.football/";

const FALLBACK_CANDIDATES = [
  { src: "/players/renars-varslavans.jpg", alt: "Renars Varslavans — Concordia Sports Agency" },
  { src: "/players/glebs-zaleiko.jpg", alt: "Glebs Zaleiko — Concordia Sports Agency" },
  { src: "/players/maksims-semesko.jpg", alt: "Maksims Semesko — Concordia Sports Agency" },
  { src: "/players/kristofers-rekis.jpg", alt: "Kristofers Rekis — Concordia Sports Agency" },
  { src: "/players/emilija-ambaine.jpg", alt: "Emīlija Ambaine — Concordia Sports Agency" },
  { src: "/football/hero-celebration.jpg", alt: "Concordia-represented players on matchday" },
];

function ViewOnInstagramIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/50">
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

export default async function InstagramFeed() {
  const livePosts = await getInstagramPosts(6);

  const tiles = livePosts
    ? livePosts.map((post) => ({
        key: post.id,
        href: post.permalink,
        node: (
          <Image
            src={post.mediaUrl}
            alt={post.caption ? post.caption.slice(0, 160) : "Concordia Sports Agency on Instagram"}
            fill
            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover grayscale-[75%] contrast-[1.05] transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ),
      }))
    : FALLBACK_CANDIDATES.filter((c) => publicAssetExists(c.src)).map((photo) => ({
        key: photo.src,
        href: INSTAGRAM_URL,
        node: (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover object-top grayscale-[75%] contrast-[1.05] transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ),
      }));

  if (tiles.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map((tile) => (
        <a
          key={tile.key}
          href={tile.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square overflow-hidden bg-ink"
          aria-label="View on Instagram"
        >
          {tile.node}
          <ViewOnInstagramIcon />
        </a>
      ))}
    </div>
  );
}
