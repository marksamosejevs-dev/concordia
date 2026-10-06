"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Writes pointer (--px, --py ∈ [-1, 1]) and scroll (--sp ∈ [0, 1] across the element) to CSS variables.
 * Children animate with transform only. No React re-renders; disabled for reduced motion.
 */
export function Parallax({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, px = 0, py = 0, cx = 0, cy = 0, inView = true;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const tick = () => {
      raf = 0;
      cx += (px - cx) * 0.08; cy += (py - cy) * 0.08;
      const r = el.getBoundingClientRect();
      const sp = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      el.style.setProperty("--px", cx.toFixed(3)); el.style.setProperty("--py", cy.toFixed(3)); el.style.setProperty("--sp", sp.toFixed(3));
      if (inView && (Math.abs(px - cx) > 0.002 || Math.abs(py - cy) > 0.002)) raf = requestAnimationFrame(tick);
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => { if (!fine) return; const r = el.getBoundingClientRect(); px = ((e.clientX - r.left) / r.width) * 2 - 1; py = ((e.clientY - r.top) / r.height) * 2 - 1; req(); };
    const leave = () => { px = 0; py = 0; req(); };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    el.addEventListener("pointermove", move, { passive: true }); el.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", req, { passive: true }); req();
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); window.removeEventListener("scroll", req); };
  }, []);
  return <Tag ref={ref} className={className} style={{ ["--px" as string]: 0, ["--py" as string]: 0, ["--sp" as string]: 0 }}>{children}</Tag>;
}
