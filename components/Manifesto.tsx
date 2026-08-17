"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default function Manifesto({ photo }: { photo?: ReactNode }) {
  return (
    <section id="manifesto" className="dark-section bg-ink px-5 py-28 text-paper sm:px-8 sm:py-36 lg:py-48">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h2 className="text-[clamp(2.6rem,7.5vw,6.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
              <Reveal as="span" className="block">
                We don&rsquo;t manage
              </Reveal>
              <Reveal as="span" delay={0.08} className="relative mt-1 inline-block">
                <span className="text-paper/40">Transfers.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute left-0 top-1/2 h-[3px] w-full origin-left bg-paper"
                  aria-hidden="true"
                />
              </Reveal>

              <Reveal delay={0.5} className="mt-6 block sm:mt-8">
                We manage
              </Reveal>
              <Reveal delay={0.62} className="mt-1 block">
                Careers.
              </Reveal>
            </h2>
          </div>

          <div className="lg:col-span-4 lg:pt-4">
            <Reveal delay={0.68} className="space-y-6 text-lg leading-relaxed text-paper/60">
              <p>Professional football is more than the ninety minutes on the pitch.</p>
              <p>
                Contracts, transfers, legal matters, commercial opportunities, finances and
                life decisions all shape a player&rsquo;s career.
              </p>
              <p className="text-paper">Concordia brings these disciplines together under one strategy.</p>
            </Reveal>
            {photo && (
              <Reveal delay={0.8} className="mt-8">
                {photo}
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
