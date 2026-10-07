import Image from "next/image";
import Link from "next/link";
import { agencyPlayers, intlStatus, playerMeta, AGENCY_STATS } from "@/content/agency-players";
import { isPublic } from "@/lib/evidence";
import { IS_REVIEW } from "@/lib/site-mode";

/**
 * Players represented by Concordia Sports Agency — an endless moving rail (pauses on hover/focus),
 * cards wake up in colour on hover with their international status.
 * Senior and youth internationals are counted separately from verified roster data.
 */
export function PlayersRail() {
  const shown = agencyPlayers.filter((p) => isPublic(p.evidence) || IS_REVIEW);
  const cleared = agencyPlayers.filter((p) => isPublic(p.evidence));
  const senior = cleared.filter((p) => intlStatus(p)?.level === "senior").length;
  const youth = cleared.filter((p) => intlStatus(p)?.level === "youth").length;
  const loop = [...shown, ...shown];

  return (
    <section className="on-white relative overflow-hidden py-[clamp(4rem,9vw,7rem)]" aria-labelledby="players-title">
      <div className="wrap grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id="players-title" className="display max-w-[16ch] text-[clamp(2.6rem,5.6vw,5.4rem)] leading-[0.9]">Players represented by Concordia Sports Agency</h2>
        <dl className="flex gap-8 lg:gap-12">
          <div><dd className="display text-[clamp(3rem,6vw,5rem)] leading-none">{senior}</dd><dt className="mt-1 text-[0.85rem] font-semibold text-ink/65">Senior<br />internationals</dt></div>
          <div><dd className="display text-[clamp(3rem,6vw,5rem)] leading-none">{youth}</dd><dt className="mt-1 text-[0.85rem] font-semibold text-ink/65">Youth<br />internationals</dt></div>
          <div><dd className="display text-[clamp(3rem,6vw,5rem)] leading-none">{AGENCY_STATS.professionalClubs}</dd><dt className="mt-1 text-[0.85rem] font-semibold text-ink/65">Professional<br />clubs</dt></div>
        </dl>
      </div>

      <div className="marquee-wrap rail mt-12 overflow-hidden" aria-label="Players">
        <ul className="marquee gap-4 pl-4" style={{ ["--marquee-s" as string]: "55s" }}>
          {loop.map((p, n) => {
            const st = intlStatus(p);
            return (
              <li key={`${p.slug}-${n}`} aria-hidden={n >= shown.length} className="group relative w-[58vw] max-w-[260px] shrink-0 sm:w-[240px]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-paper">
                  <Image src={p.photo} alt={n < shown.length ? p.name : ""} fill sizes="260px" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" style={p.photoPosition ? { objectPosition: p.photoPosition } : undefined} />
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/90 to-transparent p-3 pt-10 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {p.position && <p className="text-[0.8rem] font-semibold text-white">{p.position}</p>}
                    {p.club && <p className="text-[0.75rem] text-white/75">{p.club}</p>}
                  </div>
                  {st && <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[0.66rem] font-bold ${st.level === "senior" ? "bg-route text-ink" : "bg-white text-ink"}`}>{st.label}</span>}
                </div>
                <p className="display mt-3 text-[1.35rem] leading-none">{p.name}</p>
                <p className="mt-1 text-[0.82rem] text-ink/60">{playerMeta(p)}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="wrap mt-8"><Link href="/players" className="inline-flex items-center gap-2 font-semibold underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink">Meet the players <span aria-hidden>→</span></Link></div>
    </section>
  );
}
