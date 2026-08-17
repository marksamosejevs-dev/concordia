"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { GrainOverlay } from "./motifs";
import AnimatedArrow from "./AnimatedArrow";

export default function Hero({ background }: { background: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.35]);

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#manifesto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative grid min-h-[100svh] grid-cols-12 overflow-hidden bg-paper pt-20 sm:pt-24 lg:pt-0"
    >
      <div className="relative z-10 col-span-7 flex flex-col justify-center px-4 py-10 sm:px-8 sm:py-14 lg:px-14 lg:py-0">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-grey-500 sm:mb-8"
        >
          Concordia Sports Agency
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> — </span>
          Riga / Europe / Global
        </motion.p>

        <h1 className="text-[clamp(3rem,10.5vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.03em]">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="block overflow-hidden"
          >
            Beyond
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="block overflow-hidden"
          >
            the Game.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-8 max-w-md text-lg leading-relaxed text-grey-500 sm:mt-10 sm:text-xl"
        >
          Strategic representation for professional footballers — from the first
          professional contract to the next chapter beyond the game.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-10 sm:mt-12"
        >
          <a
            href="#manifesto"
            onClick={handleExplore}
            className="group inline-flex items-center gap-3 border-b border-ink pb-1.5 font-mono text-sm uppercase tracking-[0.15em] transition-opacity hover:opacity-60"
          >
            Explore the Agency
            <AnimatedArrow />
          </a>
        </motion.div>
      </div>

      <div className="relative col-span-5 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 -top-10 lg:-top-14">
          {background}
          <GrainOverlay opacity={0.06} />
        </motion.div>
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-r from-paper/0 via-transparent to-transparent lg:from-paper lg:opacity-100"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        aria-hidden="true"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-grey-400">
          Scroll
        </span>
        <span className="h-10 w-px bg-grey-300">
          <motion.span
            className="block h-full w-full origin-top bg-ink"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
