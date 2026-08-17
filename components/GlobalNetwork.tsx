"use client";

import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

const HUB = { x: 470, y: 300, label: "Riga" };

const NODES = [
  { x: 330, y: 70, label: "London" },
  { x: 600, y: 70, label: "Tallinn" },
  { x: 690, y: 190, label: "Vilnius" },
  { x: 800, y: 90, label: "Warsaw" },
  { x: 860, y: 210, label: "Sassuolo" },
  { x: 940, y: 300, label: "Kyiv" },
  { x: 840, y: 450, label: "Istanbul" },
  { x: 520, y: 520, label: "Yaoundé" },
  { x: 130, y: 80, label: "Toronto" },
  { x: 60, y: 230, label: "Los Angeles" },
  { x: 120, y: 380, label: "Miami" },
  { x: 170, y: 510, label: "Buenos Aires" },
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
                aria-label="Abstract diagram of Concordia's football network reach from Riga to London, Tallinn, Vilnius, Warsaw, Sassuolo, Kyiv, Istanbul, Yaoundé, Toronto, Los Angeles, Miami and Buenos Aires"
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
