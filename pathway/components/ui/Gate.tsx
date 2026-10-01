import type { ReactNode } from "react";
import { IS_REVIEW } from "@/lib/site-mode";
import { isPublic, type Evidence } from "@/lib/evidence";

/** Block-level gate: renders cleared content; in review mode shows pending content with a tag; hides it in production. */
export function Gate({ evidence, children, fallback = null, label, className = "" }: { evidence?: Evidence; children: ReactNode; fallback?: ReactNode; label?: string; className?: string }) {
  if (isPublic(evidence)) return <>{children}</>;
  if (!IS_REVIEW) return <>{fallback}</>;
  return (
    <div className={`gated ${className}`}>
      <span className="gate-tag absolute -top-3 left-2 z-20">{evidence?.state === "hold" ? "Hold" : "Pending"} · {evidence?.ref}{label ? ` · ${label}` : ""}</span>
      {children}
    </div>
  );
}

/** Inline gate for a single phrase inside copy. */
export function Pending({ evidence, children }: { evidence?: Evidence; children: ReactNode }) {
  if (isPublic(evidence)) return <>{children}</>;
  if (!IS_REVIEW) return null;
  return <span className="pending-inline" title={`Pending — ${evidence?.ref}${evidence?.note ? `: ${evidence.note}` : ""}`}>{children}<sup className="mono text-[0.6em] ml-0.5 opacity-70">{evidence?.ref}</sup></span>;
}

export function canShow(evidence?: Evidence) {
  return isPublic(evidence) || IS_REVIEW;
}
