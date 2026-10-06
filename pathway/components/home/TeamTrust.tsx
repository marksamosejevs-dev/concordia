import Image from "next/image";
import Link from "next/link";
import { Portrait } from "@/components/team/Portrait";
import { Gate, Pending } from "@/components/ui/Gate";
import { LicenceCard } from "./LicenceCard";
import { team, sortedTeam } from "@/content/team";
import { photos } from "@/content/photos";
import { LICENCE } from "@/content/site";

/** Existing documentary photos used until the team photoshoot (E33). Add a src here or in team.ts to swap. */
const INTERIM_PHOTO: Record<string, { src: string; position: string } | undefined> = {
  "marks-amosejevs": { src: photos.boardroom.src, position: "50% 22%" },
};

/** The people in your corner: Marks as the primary face with his licence as an object; the founders and team as an organisation. */
export function TeamTrust() {
  const marks = team.find((t) => t.id === "marks-amosejevs")!;
  const others = sortedTeam().filter((t) => t.id !== marks.id);
  const mp = INTERIM_PHOTO[marks.id];
  return (
    <section className="on-paper relative overflow-hidden py-[clamp(4.5rem,10vw,7.5rem)]" aria-labelledby="team-title">
      <div className="wrap">
        <h2 id="team-title" className="display max-w-[14ch] text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.9]">The people in your corner.</h2>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Marks + licence, layered */}
          <div className="relative pb-24 sm:pb-28">
            <div className="relative aspect-[4/5] w-[78%] overflow-hidden rounded-[14px]">
              {mp && <Image src={mp.src} alt={`${marks.name}`} fill sizes="(min-width:1024px) 32vw, 78vw" className="photo-grade object-cover" style={{ objectPosition: mp.position }} />}
            </div>
            <LicenceCard className="absolute bottom-0 right-0 w-[68%]" />
          </div>
          <div>
            <p className="display text-[clamp(2.2rem,4vw,3.6rem)] leading-none">{marks.name}</p>
            <p className="mt-3 text-[1.15rem] font-semibold">{marks.role.value} · {marks.secondaryRole?.value}</p>
            <p className="lede mt-5 max-w-lg text-ink/75">Marks leads the career team and oversees every assessment. His FIFA football agent licence is a personal professional credential — check it yourself.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/verify" className="btn btn-ink" data-magnetic>Verify licence {LICENCE.number} <span className="arrow" aria-hidden>→</span></Link>
              <Link href="/about/marks-amosejevs" className="font-semibold underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink">Marks’s story</Link>
            </div>

            <ul className="mt-12 grid gap-4 sm:grid-cols-2">
              {others.map((t) => (
                <li key={t.id} className="group grid grid-cols-[88px_1fr] items-center gap-4 rounded-[12px] bg-white p-3 transition-transform duration-500 hover:-translate-y-1">
                  <Gate evidence={t.photo.evidence} label="photo"><Portrait name={t.name} src={INTERIM_PHOTO[t.id]?.src} crop="mobilePortrait" sizes="88px" className="rounded-[8px]" /></Gate>
                  <div>
                    <p className="display text-[1.5rem] leading-none">{t.name}</p>
                    <p className="mt-1.5 text-[0.88rem] text-ink/70">{t.role.evidence.state === "pending" ? <Pending evidence={t.role.evidence}>Concordia team</Pending> : t.role.value}</p>
                    {t.role.evidence.state === "pending" && <span className="sr-only">Concordia team</span>}
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 font-semibold underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink">About Concordia <span aria-hidden>→</span></Link>
            <p className="mt-6 text-[0.75rem] text-ink/50">The licence is held personally by {LICENCE.holder}. No FIFA endorsement of Concordia is implied.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
