// Builds the default Open Graph image (app/opengraph-image.png, 1200×630) — text as outlines, no runtime fonts.
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const font = (f) => opentype.parse(fs.readFileSync(path.join(root, "node_modules/@fontsource", f)).buffer);
const anton = font("anton/files/anton-latin-400-normal.woff");
const sans = font("public-sans/files/public-sans-latin-700-normal.woff");
// Manual glyph layout, one <path> per glyph (avoids opentype.js layout NaNs and over-long path attributes).
const text = (f, s, x, y, size, fill) => {
  const k = size / f.unitsPerEm; let cx = x; const out = [];
  for (const ch of s) {
    const g = f.charToGlyph(ch);
    const X = (v) => (cx + v * k).toFixed(2), Y = (v) => (y - v * k).toFixed(2);
    const d = (g.path?.commands ?? []).map((c) => c.type === "M" || c.type === "L" ? `${c.type}${X(c.x)} ${Y(c.y)}` : c.type === "Q" ? `Q${X(c.x1)} ${Y(c.y1)} ${X(c.x)} ${Y(c.y)}` : c.type === "C" ? `C${X(c.x1)} ${Y(c.y1)} ${X(c.x2)} ${Y(c.y2)} ${X(c.x)} ${Y(c.y)}` : "Z").join("");
    if (d) out.push(`<path d="${d}" fill="${fill}"/>`);
    cx += (g.advanceWidth ?? 0) * k;
  }
  return out.join("");
};

const W = 1200, H = 630, INK = "#0D1B36", ROUTE = "#FFD23F";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <path d="M-20 600 C 300 590, 640 520, 860 420 S 1080 250, 1060 170" fill="none" stroke="${ROUTE}" stroke-opacity="0.6" stroke-width="3"/>
  <circle cx="1060" cy="170" r="12" fill="${ROUTE}"/>
  ${text(sans, "CONCORDIA SOCCER · EUROPEAN PATHWAY", 64, 92, 22, "#AEB6C4")}
  ${text(sans, "LED BY FIFA LICENSED FOOTBALL AGENT MARKS AMOSEJEVS", 64, 596, 16, "#AEB6C4")}
  ${text(anton, "THINK YOU CAN PLAY", 64, 200, 74, "#FFFFFF")}
  ${text(anton, "IN EUROPE? ASK PEOPLE", 64, 280, 74, ROUTE)}
  ${text(anton, "WHO WORK IN IT.", 64, 360, 74, ROUTE)}
  <rect x="64" y="430" width="300" height="120" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2"/>
  ${text(sans, "ASSESSMENT · ONE TIME", 84, 466, 16, "#AEB6C4")}
  ${text(anton, "$249", 84, 528, 54, "#FFFFFF")}
  <rect x="384" y="430" width="330" height="120" fill="${ROUTE}"/>
  ${text(sans, "EUROPEAN PATHWAY", 404, 466, 16, INK)}
  ${text(anton, "$399/MONTH", 404, 528, 54, INK)}
</svg>`;

await sharp({ create: { width: W, height: H, channels: 3, background: INK } })
  .composite([{ input: Buffer.from(svg) }])
  .png({ compressionLevel: 9 }).toFile(path.join(root, "app/opengraph-image.png"));
console.log("✓ app/opengraph-image.png");
