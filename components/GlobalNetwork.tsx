"use client";

import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

const HUB = { x: 320, y: 300, label: "Riga" };

const NODES = [
  { x: 620, y: 120, label: "Tallinn" },
  { x: 700, y: 260, label: "Vilnius" },
  { x: 830, y: 190, label: "Warsaw" },
  { x: 940, y: 340, label: "Kyiv" },
  { x: 860, y: 470, label: "Istanbul" },
  { x: 560, y: 460, label: "Central Europe" },
  { x: 140, y: 130, label: "London" },
];

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
              <svg
                viewBox="0 0 1000 560"
                className="h-auto w-full text-ink"
                role="img"
                aria-label="Abstract diagram of Concordia's football network reach from Riga to Tallinn, Vilnius, Warsaw, Kyiv, Istanbul, Central Europe and London"
              >
                <g opacity="0.08" stroke="currentColor" strokeWidth="1">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="560" />
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 112} x2="1000" y2={i * 112} />
                  ))}
                </g>

                {NODES.map((node, i) => (
                  <motion.line
                    key={node.label}
                    x1={HUB.x}
                    y1={HUB.y}
                    x2={node.x}
                    y2={node.y}
                    stroke="currentColor"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.35 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : 1.1,
                      delay: shouldReduceMotion ? 0 : 0.15 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                ))}

                {NODES.map((node, i) => (
                  <g key={`node-${node.label}`}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 0.5, scale: [0.8, 1.3, 1] }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1, delay: 0.15 * i + 0.6 }}
                    />
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="4"
                      fill="currentColor"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: 0.15 * i + 0.6 }}
                    />
                    <text
                      x={node.x}
                      y={node.y - 24}
                      textAnchor="middle"
                      className="font-mono uppercase"
                      fontSize="13"
                      letterSpacing="1.5"
                      fill="currentColor"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}

                <circle cx={HUB.x} cy={HUB.y} r="7" fill="currentColor" />
                <circle
                  cx={HUB.x}
                  cy={HUB.y}
                  r="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <text
                  x={HUB.x}
                  y={HUB.y + 46}
                  textAnchor="middle"
                  className="font-mono font-bold uppercase"
                  fontSize="16"
                  letterSpacing="2"
                  fill="currentColor"
                >
                  {HUB.label}
                </text>
              </svg>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
