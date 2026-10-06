"use client";
import { useEffect } from "react";

/** Site-wide magnetic hover for [data-magnetic] buttons (fine pointers only, transform-only, reduced-motion aware). */
export function MagneticLayer() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let el: HTMLElement | null = null;
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");
      if (t !== el) { if (el) el.style.transform = ""; el = t; }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.22, y = (e.clientY - (r.top + r.height / 2)) * 0.32;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };
    const out = () => { if (el) el.style.transform = ""; el = null; };
    document.addEventListener("pointermove", over, { passive: true });
    document.addEventListener("pointerleave", out);
    return () => { document.removeEventListener("pointermove", over); document.removeEventListener("pointerleave", out); };
  }, []);
  return null;
}
