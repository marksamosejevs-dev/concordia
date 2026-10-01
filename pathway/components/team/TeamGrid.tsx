import Link from "next/link";
import { sortedTeam } from "@/content/team";
import { Portrait } from "./Portrait";
import { Gate, Pending } from "@/components/ui/Gate";
import { isPublic } from "@/lib/evidence";
import { IS_REVIEW } from "@/lib/site-mode";

export function TeamGrid({ variant = "row", tone = "ink" }: { variant?: "row" | "full"; tone?: "ink" | "paper" }) {
  const members = sortedTeam().filter((m) => variant === "full" || m.featured);
  const muted = tone === "paper" ? "text-ink/65" : "text-slate-light";
  return (
    <ul className={variant === "row" ? "rail -mx-[var(--gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:overflow-visible sm:px-0" : "grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3"}>
      {members.map((m) => {
        const showRole = isPublic(m.role.evidence) || IS_REVIEW;
        return (
          <li key={m.id} className={`group ${variant === "row" ? "w-[64%] shrink-0 snap-start sm:w-auto" : ""}`}>
            <Portrait name={m.name} src={isPublic(m.photo.evidence) ? m.photo.gridCrop : undefined} crop="gridCrop" />
            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="display text-[1.7rem] leading-none">{m.name}</h3>
                {showRole && <p className="mt-2 text-[0.95rem] font-semibold"><Pending evidence={m.role.evidence}>{m.role.value}</Pending></p>}
                {m.secondaryRole && <p className={`mt-1 text-[0.9rem] ${muted}`}><Pending evidence={m.secondaryRole.evidence}>{m.secondaryRole.value}</Pending></p>}
              </div>
              {m.profilePage && <Link href={`/about/${m.slug}`} className="mono mt-1 shrink-0 text-[0.7rem] uppercase tracking-[0.1em] underline underline-offset-4" aria-label={`Read ${m.name}’s story`}>Profile →</Link>}
            </div>
            {variant === "full" && m.shortBio && (
              <Gate evidence={m.shortBio.evidence} className="mt-4"><p className={`text-[0.95rem] leading-relaxed ${muted}`}>{m.shortBio.value}</p></Gate>
            )}
          </li>
        );
      })}
    </ul>
  );
}
