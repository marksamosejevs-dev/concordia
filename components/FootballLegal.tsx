"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

const FOOTBALL_POINTS = ["Transfers", "Contracts", "Club Relations", "Career Strategy"];
const LEGAL_POINTS = [
  "Employment Contracts",
  "FIFA Regulations",
  "Disciplinary Matters",
  "Image Rights",
  "Immigration",
  "International Transfers",
];

export default function FootballLegal() {
  return (
    <section className="relative bg-paper px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <Reveal className="mb-16 sm:mb-20">
          <SectionLabel index="05" label="Football + Law" className="justify-center text-grey-500" />
          <h2 className="mx-auto mt-4 max-w-2xl text-center text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-[1] tracking-[-0.02em]">
            Representation backed by legal expertise.
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-0">
          <div className="relative pr-0 md:pr-16">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-grey-500">Football</p>
              <h3 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
                Football
                <br />
                Expertise.
              </h3>
              <ul className="mt-8 space-y-3 border-t border-line pt-6">
                {FOOTBALL_POINTS.map((point) => (
                  <li key={point} className="font-mono text-sm uppercase tracking-[0.1em] text-grey-500">
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="relative pl-0 md:pl-16">
            <div
              className="absolute -left-px top-0 hidden h-full w-px bg-line md:block"
              aria-hidden="true"
            >
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                className="h-full w-full origin-top bg-ink"
              />
            </div>
            <Reveal delay={0.1}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-grey-500">Legal</p>
              <h3 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
                Legal
                <br />
                Precision.
              </h3>
              <ul className="mt-8 space-y-3 border-t border-line pt-6">
                {LEGAL_POINTS.map((point) => (
                  <li key={point} className="font-mono text-sm uppercase tracking-[0.1em] text-grey-500">
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2} className="mx-auto mt-20 max-w-2xl text-center">
          <p className="text-lg leading-relaxed text-grey-500">
            Concordia combines professional football representation with legal expertise —
            supporting players across employment contracts, transfer agreements, FIFA
            regulations, disciplinary matters, image rights, immigration, international
            transfers and football disputes.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
