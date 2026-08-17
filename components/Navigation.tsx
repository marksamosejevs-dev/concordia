"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Roster", href: "#roster" },
  { label: "Expertise", href: "#expertise" },
  { label: "Agency", href: "#agency" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation({ logo }: { logo: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const onHomePage = pathname === "/";

  useEffect(() => {
    if (!onHomePage || !window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const resolveHref = (hash: string) => (onHomePage ? hash : `/${hash}`);

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    setMenuOpen(false);
    if (!onHomePage) return; // let the browser navigate to `/${href}` normally
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-line bg-paper/85 backdrop-blur-md"
            : "border-transparent bg-paper/0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1600px] items-center justify-between px-5 transition-all duration-300 sm:px-8",
            scrolled ? "py-3" : "py-5 sm:py-7",
          )}
        >
          <a
            href={onHomePage ? "#top" : "/"}
            onClick={handleNavClick("#top")}
            className="relative z-10 shrink-0"
            aria-label="Concordia Sports Agency — home"
          >
            {logo}
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={resolveHref(link.href)}
                onClick={handleNavClick(link.href)}
                className="font-mono text-xs uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <a
              href={resolveHref("#contact")}
              onClick={handleNavClick("#contact")}
              className="group inline-flex items-center gap-2 border border-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
            >
              Get in Touch
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={cn(
                "h-px w-6 bg-ink transition-transform duration-300",
                menuOpen && "translate-y-[6.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-ink transition-all duration-300",
                menuOpen && "-translate-y-[1.5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 text-paper lg:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={resolveHref(link.href)}
                  onClick={handleNavClick(link.href)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                  className="border-b border-line-invert py-5 text-[clamp(2rem,9vw,2.75rem)] font-bold uppercase leading-none tracking-tight"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="flex flex-col gap-4">
              <a
                href={resolveHref("#contact")}
                onClick={handleNavClick("#contact")}
                className="inline-flex w-full items-center justify-center border border-paper px-5 py-4 font-mono text-xs uppercase tracking-[0.18em]"
              >
                Get in Touch
              </a>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-paper/50">
                Riga / Europe / Global
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
