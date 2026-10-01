import Image from "next/image";
import type { AgencyPlayer } from "@/content/agency-players";
import { Gate } from "@/components/ui/Gate";

export function PlayerCard({ p }: { p: AgencyPlayer }) {
  return (
    <Gate evidence={p.evidence} label="guardian permission">
      <article className="group">
        <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
          <Image src={p.photo} alt={p.name} fill sizes="(min-width:1024px) 22vw, 70vw" className="photo-grade object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          <span className="mono absolute left-3 top-3 bg-ink/80 px-2 py-1 text-[0.6rem] tracking-[0.1em]">{p.nationality}</span>
        </div>
        <h3 className="display mt-4 text-[1.6rem] leading-none">{p.name}</h3>
        <p className="mt-1.5 text-[0.9rem] text-white/80">{p.position}{p.club ? ` · ${p.club}` : ""}</p>
        {p.nationalTeam && <p className="mono mt-1 text-[0.7rem] text-slate-light">{p.nationalTeam}</p>}
      </article>
    </Gate>
  );
}
