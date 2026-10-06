"use client";
/** Maps local photos to the pre-generated WebP variants written by scripts/build-images.mjs. */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("/assets/pathway/") && /\.(jpe?g|png)$/i.test(src)) return `/_img${src.replace(/\.(jpe?g|png)$/i, "")}-${width}.webp`;
  return src;
}
