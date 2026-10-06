// Pre-computes a dot-matrix Europe (content/europe-dots.json) from content/europe-map.json.
// Each dot: [x, y, countryIndex|-1] on the 1000×900 map grid. Used by the interactive canvas — no SVG paths ship.
import fs from "node:fs";
import sharp from "sharp";

const map = JSON.parse(fs.readFileSync("content/europe-map.json", "utf8"));
const STEP = 13;
const isos = map.countries.filter((c) => c.iso).map((c) => c.iso);
const fill = (c) => (c.iso ? `rgb(${isos.indexOf(c.iso) + 1},0,255)` : "rgb(0,0,255)");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${map.width}" height="${map.height}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#000"/>${map.countries.map((c) => `<path d="${c.d}" fill="${fill(c)}"/>`).join("")}</svg>`;
const { data, info } = await sharp(Buffer.from(svg)).raw().toBuffer({ resolveWithObject: true });
const dots = [];
for (let y = STEP / 2; y < info.height; y += STEP) for (let x = STEP / 2; x < info.width; x += STEP) {
  const i = (Math.round(y) * info.width + Math.round(x)) * info.channels;
  if (data[i + 2] > 200) dots.push([Math.round(x), Math.round(y), data[i] > 0 && data[i] <= isos.length ? data[i] - 1 : -1]);
}
const centroids = Object.fromEntries(map.countries.filter((c) => c.iso).map((c) => [c.iso, [c.cx, c.cy]]));
fs.writeFileSync("content/europe-dots.json", JSON.stringify({ w: map.width, h: map.height, isos, centroids, dots }));
console.log(`✓ ${dots.length} dots`);
