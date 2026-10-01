"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA } from "@/content/site";

/** Mobile sticky CTA. Hidden at the top, inside the application/checkout, and while [data-hide-sticky] sections are on screen. */
export function StickyCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.9);
    on(); window.addEventListener("scroll", on, { passive: true });
    const targets = document.querySelectorAll("[data-hide-sticky]");
    const vis = new Set<Element>();
    const io = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target))); setBlocked(vis.size > 0); }, { threshold: 0.15 });
    targets.forEach((t) => io.observe(t));
    return () => { window.removeEventListener("scroll", on); io.disconnect(); };
  }, [pathname]);
  if (pathname.startsWith("/apply") || pathname.startsWith("/checkout")) return null;
  const visible = show && !blocked;
  return (
    <div aria-hidden={!visible} className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 p-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <Link href="/apply" tabIndex={visible ? 0 : -1} className="btn btn-route w-full !min-h-[50px]">{CTA.apply} <span aria-hidden>→</span></Link>
      <p className="mono mt-1.5 text-center text-[0.66rem] tracking-[0.08em] text-slate-light">{CTA.micro}</p>
    </div>
  );
}
