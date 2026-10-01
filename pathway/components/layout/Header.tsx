"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, Mark } from "@/components/brand/Logo";
import { NAV, CTA } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) { setPrevPath(pathname); setOpen(false); }
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? "bg-ink/92 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}>
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" aria-label="Concordia Soccer · European Pathway — home" className="shrink-0">
          <Logo className="hidden h-9 w-auto sm:block" />
          <span className="flex items-center gap-2 sm:hidden"><Mark className="h-8 w-8" /><span className="display text-[1.15rem] tracking-[0.06em]">Concordia</span></span>
        </Link>
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-7 text-[0.9rem] font-medium">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className={`relative py-2 transition-colors hover:text-white ${pathname.startsWith(n.href) ? "text-white" : "text-white/70"}`}>
                {n.label}{pathname.startsWith(n.href) && <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-route" />}
              </Link></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/apply" className="btn btn-route !min-h-[42px] !px-4 text-[0.85rem]" aria-label={`${CTA.apply} — ${CTA.micro}`}>
            <span className="hidden sm:inline">Apply free</span><span className="sm:hidden">Apply</span>
          </Link>
          <button className="xl:hidden flex h-[42px] w-[42px] items-center justify-center border border-white/20" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-[2px] w-5 bg-white transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute left-0 bottom-0 h-[2px] w-5 bg-white transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      <div id="mobile-menu" hidden={!open} className="xl:hidden h-[calc(100dvh-var(--header-h))] overflow-y-auto bg-ink">
        <div className="wrap flex flex-col gap-1 py-8">
          <Link href="/apply" className="btn btn-route mb-6 w-full">{CTA.apply} <span aria-hidden>→</span></Link>
          {[...NAV, { href: "/how-it-works", label: "How it works" }, { href: "/verify", label: "Verify us" }, { href: "/faq", label: "Questions" }].map((n) => (
            <Link key={n.href} href={n.href} className="display border-b border-white/10 py-4 text-[2rem] leading-none">{n.label}</Link>
          ))}
          <p className="mono mt-8 text-[0.7rem] text-slate-light">European Pathway is career advisory. Not representation.</p>
        </div>
      </div>
    </header>
  );
}
