"use client";

import { useState } from "react";
import { services } from "@/data/services";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import { cn } from "@/lib/utils";

export default function Expertise() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="expertise" className="bg-cloud px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <SectionLabel index="04" label="Expertise" className="text-grey-500" />
          <h2 className="mt-4 max-w-3xl text-[clamp(2.4rem,6vw,5rem)] font-bold uppercase leading-[0.94] tracking-[-0.02em]">
            One team.
            <br />
            Every part of the career.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 border-t border-line sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const isOpen = openIndex === i;
            return (
              <button
                key={service.number}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={cn(
                  "group relative flex flex-col justify-between border-b border-r border-line p-8 text-left transition-colors duration-500 sm:p-10",
                  "hover:bg-ink hover:text-paper",
                  isOpen && "bg-ink text-paper",
                  "[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0",
                )}
              >
                <div>
                  <span className="font-mono text-sm text-grey-400 transition-colors duration-500 group-hover:text-paper/40">
                    {service.number}
                  </span>
                  <h3 className="mt-6 text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold uppercase leading-[0.98] tracking-tight">
                    {service.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p
                    className={cn(
                      "mt-4 text-sm text-grey-500 transition-colors duration-500 group-hover:text-paper/60",
                    )}
                  >
                    {service.summary}
                  </p>
                </div>

                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-500 ease-out",
                    isOpen ? "mt-8 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
                  )}
                >
                  <ul className="min-h-0 space-y-2 border-t border-line-invert/20 pt-6 font-mono text-xs uppercase tracking-[0.1em] text-paper/70">
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <span
                  className={cn(
                    "mt-8 font-mono text-xs uppercase tracking-[0.15em] text-grey-400 transition-colors duration-500 group-hover:text-paper/50",
                    isOpen && "text-paper/50",
                  )}
                  aria-hidden="true"
                >
                  {isOpen ? "Close −" : "Details +"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
