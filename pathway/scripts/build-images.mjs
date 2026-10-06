/**
 * Responsive image pipeline for the static export.
 * Writes WebP variants of every photo under public/assets/pathway into public/_img/
 * at the widths next/image requests (see images.deviceSizes / imageSizes in next.config.ts).
 * lib/image-loader.ts maps <Image src width> to these files. Output is generated at build time
 * (git-ignored) and skipped when already up to date.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export const WIDTHS = [256, 480, 828, 1280, 1920];
const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "public/assets/pathway");
const out = path.join(root, "public/_img/assets/pathway");

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name);
  return e.isDirectory() ? walk(p) : /\.(jpe?g|png)$/i.test(e.name) ? [p] : [];
});

let made = 0;
for (const file of walk(src)) {
  const rel = path.relative(src, file).replace(/\.(jpe?g|png)$/i, "");
  const mtime = fs.statSync(file).mtimeMs;
  const meta = await sharp(file).metadata();
  for (const w of WIDTHS) {
    const dest = path.join(out, `${rel}-${w}.webp`);
    if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= mtime) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(file).rotate().resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true }).webp({ quality: 74 }).toFile(dest);
    made++;
  }
}
console.log(`✓ Images: ${made} variant(s) written`);
