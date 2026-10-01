// Pre-projects a Europe map (Natural Earth via world-atlas, public domain) into static SVG paths.
import fs from "node:fs";
import { feature } from "topojson-client";
import { geoConicConformal, geoPath } from "d3-geo";

const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
const all = feature(topo, topo.objects.countries).features;

// ISO 3166-1 numeric → our ISO alpha-2 key. Launch set (Phase 1 §10) + context countries.
const launch = { 428:"LV",440:"LT",233:"EE",246:"FI",752:"SE",578:"NO",208:"DK",352:"IS",616:"PL",276:"DE",203:"CZ",703:"SK",40:"AT",348:"HU",642:"RO",100:"BG",191:"HR",705:"SI",688:"RS",300:"GR",196:"CY",470:"MT",724:"ES",620:"PT",380:"IT",56:"BE",528:"NL",372:"IE",826:"GB",756:"CH",250:"FR",804:"UA" };
const context = [8,70,499,807,112,498,643,792,442,20,438,674,492,383,268,51,31,504,12,788,434,818,760,368,364,400,376,422,795];

const W = 1000, H = 900;
const projection = geoConicConformal().rotate([-12, 0]).parallels([35, 65]).center([0, 53.5]).scale(1180).translate([W / 2, H / 2]).clipExtent([[-20, -20], [W + 20, H + 20]]);
const path = geoPath(projection);

const out = [];
for (const f of all) {
  const id = Number(f.id);
  const iso = launch[id];
  if (!iso && !context.includes(id)) continue;
  const d = path(f);
  if (!d) continue;
  const [cx, cy] = path.centroid(f);
  out.push({ iso: iso ?? null, name: f.properties.name, d: d.replace(/\.\d+/g, ""), cx: Math.round(cx), cy: Math.round(cy), launchSet: Boolean(iso) });
}
fs.writeFileSync("content/europe-map.json", JSON.stringify({ width: W, height: H, countries: out }));
console.log(out.length, "shapes;", out.filter((c) => c.launchSet).length, "in launch set");
