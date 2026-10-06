"use client";
import { useEffect, useRef } from "react";
import data from "@/content/europe-dots.json";

type Props = {
  className?: string;
  /** Countries (ISO alpha-2) that glow in Route Yellow. */
  highlight?: string[];
  /** Country the animated route flies to (from the west edge — the US side). */
  target?: string;
  /** Dot colour for land, as "r,g,b". */
  ink?: string;
  /** Pointer pushes dots away and lights them up. */
  interactive?: boolean;
  /** Horizontal anchor of the map inside the canvas (0 = left, 1 = right). */
  align?: number;
  /** Map scale relative to the "contain" fit. */
  zoom?: number;
};

const D = data as unknown as { w: number; h: number; isos: string[]; centroids: Record<string, [number, number]>; dots: [number, number, number][] };

/**
 * Dot-matrix Europe on canvas — the site's signature surface.
 * Pre-computed dots (scripts/build-dots.mjs), pointer-reactive, animates only while on screen,
 * static for prefers-reduced-motion. Props are read live, so highlight/target changes need no re-mount.
 */
export function EuropeDots({ className = "", highlight = [], target, ink = "255,255,255", interactive = true, align = 0.5, zoom = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ highlight, target, ink });
  const kick = useRef<() => void>(() => {});
  const hlKey = highlight.join(",");
  useEffect(() => { live.current = { highlight, target, ink }; kick.current(); }, [hlKey, target, ink]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, s = 1, ox = 0, oy = 0, raf = 0, visible = false;
    const off = new Float32Array(D.dots.length * 2);
    const glow = new Float32Array(D.dots.length);
    const ptr = { x: -9999, y: -9999 };
    let routeT = 0, lastTarget: string | undefined, t0 = performance.now();

    const fit = () => {
      const r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      s = Math.min(W / D.w, H / D.h) * zoom; ox = (W - D.w * s) * align; oy = (H - D.h * s) / 2;
      if (!raf) draw(performance.now());
    };

    const draw = (now: number) => {
      raf = 0;
      const { highlight: hl, target: tg, ink: c } = live.current;
      const hlIdx = new Set(hl.map((i) => D.isos.indexOf(i)));
      if (tg !== lastTarget) { lastTarget = tg; routeT = 0; }
      const tsec = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const r = Math.max(1, 2.3 * s * 1.6);
      for (let i = 0; i < D.dots.length; i++) {
        const [dx, dy, ci] = D.dots[i];
        let x = ox + dx * s, y = oy + dy * s;
        if (interactive && !reduced) {
          const vx = x - ptr.x, vy = y - ptr.y, d2 = vx * vx + vy * vy, R = 110;
          let tx = 0, ty = 0, tgGlow = 0;
          if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) ** 2; tx = (vx / d) * f * 16; ty = (vy / d) * f * 16; tgGlow = f; }
          off[i * 2] += (tx - off[i * 2]) * 0.14; off[i * 2 + 1] += (ty - off[i * 2 + 1]) * 0.14; glow[i] += (tgGlow - glow[i]) * 0.12;
          x += off[i * 2]; y += off[i * 2 + 1];
        }
        const isHl = ci >= 0 && hlIdx.has(ci);
        if (isHl) {
          const p = reduced ? 1 : 0.75 + 0.25 * Math.sin(tsec * 2.4 + dx * 0.05);
          ctx.fillStyle = `rgba(255,210,63,${p})`;
          ctx.beginPath(); ctx.arc(x, y, r * 1.25, 0, Math.PI * 2); ctx.fill();
        } else {
          const a = (ci >= 0 ? 0.42 : 0.16) + glow[i] * 0.55;
          ctx.fillStyle = glow[i] > 0.35 ? `rgba(255,210,63,${a})` : `rgba(${c},${a})`;
          ctx.fillRect(x - r / 2, y - r / 2, r, r);
        }
      }
      // Route: from the west edge (the US side) to the target market.
      const cxy = tg ? D.centroids[tg] : undefined;
      if (cxy) {
        routeT = reduced ? 1 : Math.min(1, routeT + 0.018);
        const sx = -20, sy = H * 0.98, ex = ox + cxy[0] * s, ey = oy + cxy[1] * s, mx = sx + (ex - sx) * 0.62, my = sy - (sy - ey) * 0.15;
        const e = 1 - (1 - routeT) ** 3;
        ctx.strokeStyle = "rgba(255,210,63,0.95)"; ctx.lineWidth = 2; ctx.setLineDash([]);
        ctx.beginPath();
        const N = 48; for (let k = 0; k <= N * e; k++) { const u = k / N, ix = (1 - u) ** 2 * sx + 2 * (1 - u) * u * mx + u * u * ex, iy = (1 - u) ** 2 * sy + 2 * (1 - u) * u * my + u * u * ey; if (k === 0) ctx.moveTo(ix, iy); else ctx.lineTo(ix, iy); }
        ctx.stroke();
        if (e > 0.98) {
          const pr = reduced ? 0 : (tsec * 1.2) % 1;
          ctx.strokeStyle = `rgba(255,210,63,${1 - pr})`; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(ex, ey, 6 + pr * 18, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = "#FFD23F"; ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(fit); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(draw); }, { threshold: 0 });
    io.observe(canvas);
    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; };
    const leave = () => { ptr.x = -9999; ptr.y = -9999; };
    const host = canvas.parentElement ?? canvas;
    if (interactive) { host.addEventListener("pointermove", move, { passive: true }); host.addEventListener("pointerleave", leave); }
    kick.current = () => { if (!raf) raf = requestAnimationFrame(draw); };
    fit(); t0 = performance.now();
    return () => { kick.current = () => {}; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); };
  }, [interactive, align, zoom]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
