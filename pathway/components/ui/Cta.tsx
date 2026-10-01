import Link from "next/link";
import { CTA } from "@/content/site";

export function ApplyCta({ micro = true, className = "", label = CTA.apply, href = "/apply", tone = "route" }: { micro?: boolean; className?: string; label?: string; href?: string; tone?: "route" | "ink" }) {
  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <Link href={href} className={`btn ${tone === "route" ? "btn-route" : "btn-ink"}`} data-cta="apply">
        {label} <span className="arrow" aria-hidden>→</span>
      </Link>
      {micro && <p className="mono text-[0.72rem] tracking-[0.08em] opacity-80">{CTA.micro}</p>}
    </div>
  );
}

export function GhostLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={`btn btn-ghost ${className}`}>{children} <span className="arrow" aria-hidden>→</span></Link>;
}

export function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={`inline-flex items-center gap-2 font-semibold underline decoration-1 underline-offset-[6px] decoration-current/40 hover:decoration-current ${className}`}>{children} <span aria-hidden>→</span></Link>;
}
