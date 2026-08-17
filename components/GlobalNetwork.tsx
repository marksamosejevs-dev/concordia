"use client";

import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

// Equirectangular projection (plain lat/lon → x/y) over a bounding box that covers
// every market. Real relative geography, not an artistic layout — Europe clusters
// tightly together because it genuinely is tight next to the Atlantic/Americas span.
const VIEW_W = 1500;
const VIEW_H = 970;
const LON_MIN = -122;
const LON_MAX = 45;
const LAT_MIN = -40;
const LAT_MAX = 68;

type Coords = [number, number];
type Anchor = "start" | "middle" | "end";

function project([lat, lon]: Coords) {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * VIEW_W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VIEW_H;
  return { x, y };
}

const HUB = { coords: [56.95, 24.11] as Coords, label: "Riga" };

interface NodeDef {
  coords: Coords;
  label: string;
  labelOffset: { dx: number; dy: number };
  anchor: Anchor;
}

// labelOffset/anchor let a label sit away from its dot (with a leader line) when
// several real-world points sit too close together to label in place — the dot
// itself always stays at the true projected position.
const NODE_DEFS: NodeDef[] = [
  { coords: [59.44, 24.75], label: "Tallinn", labelOffset: { dx: 50, dy: -22 }, anchor: "start" },
  { coords: [54.69, 25.28], label: "Vilnius", labelOffset: { dx: 58, dy: 4 }, anchor: "start" },
  { coords: [52.23, 21.01], label: "Warsaw", labelOffset: { dx: -55, dy: 34 }, anchor: "end" },
  { coords: [44.55, 10.78], label: "Sassuolo", labelOffset: { dx: 0, dy: 42 }, anchor: "middle" },
  { coords: [50.45, 30.52], label: "Kyiv", labelOffset: { dx: 26, dy: 36 }, anchor: "start" },
  { coords: [41.01, 28.98], label: "Istanbul", labelOffset: { dx: 0, dy: 42 }, anchor: "middle" },
  { coords: [51.51, -0.13], label: "London", labelOffset: { dx: 0, dy: -26 }, anchor: "middle" },
  { coords: [3.87, 11.52], label: "Yaoundé", labelOffset: { dx: 0, dy: -26 }, anchor: "middle" },
  { coords: [43.65, -79.38], label: "Toronto", labelOffset: { dx: 0, dy: -26 }, anchor: "middle" },
  { coords: [34.05, -118.24], label: "Los Angeles", labelOffset: { dx: 8, dy: -24 }, anchor: "start" },
  { coords: [25.76, -80.19], label: "Miami", labelOffset: { dx: 0, dy: -26 }, anchor: "middle" },
  { coords: [-34.6, -58.38], label: "Buenos Aires", labelOffset: { dx: 0, dy: -26 }, anchor: "middle" },
];

const NODES = NODE_DEFS.map((n) => ({ ...n, ...project(n.coords) }));

const hubPos = project(HUB.coords);

export default function GlobalNetwork() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-paper px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionLabel index="06" label="Global Network" className="text-grey-500" />
              <h2 className="mt-4 text-[clamp(2.2rem,5vw,3.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
                Built in Europe.
                <br />
                Connected globally.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-grey-500">
                Our network connects players, clubs and football professionals across
                multiple markets.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.15}>
              <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-grey-400 lg:hidden">
                Scroll to explore →
              </p>
              <div className="overflow-x-auto">
                <svg
                  viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                  className="h-auto w-full min-w-[720px] text-ink"
                  role="img"
                  aria-label="Geographic diagram of Concordia's football network reach from Riga to London, Tallinn, Vilnius, Warsaw, Sassuolo, Kyiv, Istanbul, Yaoundé, Toronto, Los Angeles, Miami and Buenos Aires"
                >
                <g opacity="0.08" stroke="currentColor" strokeWidth="1">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2={VIEW_H} />
                  ))}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 112} x2={VIEW_W} y2={i * 112} />
                  ))}
                </g>

                {NODES.map((node, i) => (
                  <motion.line
                    key={`link-${node.label}`}
                    x1={hubPos.x}
                    y1={hubPos.y}
                    x2={node.x}
                    y2={node.y}
                    stroke="currentColor"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.3 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : 1.1,
                      delay: shouldReduceMotion ? 0 : 0.1 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                ))}

                {NODES.map((node, i) => {
                  const labelX = node.x + node.labelOffset.dx;
                  const labelY = node.y + node.labelOffset.dy;
                  const hasLeader =
                    Math.abs(node.labelOffset.dx) > 0 ||
                    Math.abs(node.labelOffset.dy) > 26;
                  return (
                    <g key={`node-${node.label}`}>
                      {hasLeader && (
                        <motion.line
                          x1={node.x}
                          y1={node.y}
                          x2={labelX}
                          y2={labelY - 6}
                          stroke="currentColor"
                          strokeWidth="0.75"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.3 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.6, delay: 0.1 * i + 0.6 }}
                        />
                      )}
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 0.5, scale: [0.8, 1.3, 1] }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1, delay: 0.1 * i + 0.5 }}
                      />
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="3.5"
                        fill="currentColor"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.1 * i + 0.5 }}
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor={node.anchor}
                        className="font-mono uppercase"
                        fontSize="13"
                        letterSpacing="1.5"
                        fill="currentColor"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}

                <circle cx={hubPos.x} cy={hubPos.y} r="6" fill="currentColor" />
                <circle
                  cx={hubPos.x}
                  cy={hubPos.y}
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <text
                  x={hubPos.x - 40}
                  y={hubPos.y + 6}
                  textAnchor="end"
                  className="font-mono font-bold uppercase"
                  fontSize="16"
                  letterSpacing="2"
                  fill="currentColor"
                >
                  {HUB.label}
                </text>
                </svg>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
