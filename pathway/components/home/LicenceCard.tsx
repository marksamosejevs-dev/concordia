"use client";
import { useRef } from "react";
import Image from "next/image";

/** The FIFA licence card as a physical object: tilts toward the pointer with a moving sheen. Connect ID is redacted in the asset (E5). */
export function LicenceCard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${x * 16}deg) rotateX(${-y * 12}deg) translateZ(0)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`); el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const leave = () => { const el = ref.current; if (el) el.style.transform = ""; };
  return (
    <div className={className} onPointerMove={move} onPointerLeave={leave}>
      <div ref={ref} className="relative overflow-hidden rounded-[16px] shadow-[0_40px_80px_-30px_rgba(8,17,39,0.7)] transition-transform duration-300 ease-out [transform:perspective(1100px)_rotateY(-8deg)_rotateX(4deg)]" style={{ aspectRatio: "1010/650" }}>
        <Image src="/assets/pathway/credentials/fifa-licence-card.png" alt="FIFA football agent licence of Marks Amosejevs — licence number 202406-7079, status valid, authorised to represent minors as of 26 August 2024" fill sizes="(min-width:1024px) 34vw, 90vw" className="object-cover" />
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,30%)_var(--gy,20%),rgba(255,255,255,0.35),transparent_45%)] mix-blend-overlay" aria-hidden />
      </div>
    </div>
  );
}
