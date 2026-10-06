import Image from "next/image";
import Link from "next/link";
import { Portrait } from "@/components/team/Portrait";
import { Gate } from "@/components/ui/Gate";
import { LicenceCard } from "./LicenceCard";
import { team } from "@/content/team";
import { photos } from "@/content/photos";
import { LICENCE } from "@/content/site";

/**
 * One team composition: Marks leads (FIFA agent identity + licence object), Filipp and Valerija
 * alongside with their own descriptions. No separate biography pages.
 * Photos: documentary images until the team photoshoot (E33) — swap here.
 */
const PHOTO: Record<string, { src: string; alt: string; position: string } | undefined> = {
  "marks-amosejevs": { src: photos.boardroom.src, alt: "Marks Amosejevs", position: "50% 22%" },
  // Founder: "the photograph of Filipp at the stadium" — MetLife Stadium stand (confirm file, E36).
  "filipp-sviridenko": { src: photos.cwcStand.src, alt: "Filipp Sviridenko in a stadium stand above a full crowd", position: "30% 22%" },
};

export function TeamTrust() {
  const [marks, filipp, valerija] = ["marks-amosejevs", "filipp-sviridenko", "valerija-sevcenko"].map((id) => team.find((t) => t.id === id)!);
  const mp = PHOTO[marks.id]!, fp = PHOTO[filipp.id];
  return (
    <section id="team" className="on-paper relative overflow-hidden py-[clamp(4.5rem,10vw,7.5rem)]" aria-labelledby="team-title">
      <div className="wrap">
        <h2 id="team-title" className="display max-w-[14ch] text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.9]">The people in your corner.</h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
          {/* Marks — lead */}
          <article className="relative overflow-hidden rounded-[18px] bg-ink text-white">
            <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[360px] sm:min-h-full">
                <Image src={mp.src} alt={mp.alt} fill sizes="(min-width:1024px) 26vw, (min-width:640px) 45vw, 100vw" className="photo-grade object-cover" style={{ objectPosition: mp.position }} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-ink/70" aria-hidden />
              </div>
              <div className="relative flex flex-col p-6 sm:p-8">
                <h3 className="display text-[clamp(2.4rem,4vw,3.6rem)] leading-[0.9]">{marks.name}</h3>
                <p className="mt-3 text-[1rem] font-semibold text-white/75">{marks.role.value} · <span className="text-[1.15rem] font-bold text-route">{marks.secondaryRole?.value}</span></p>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-white/80">{marks.shortBio?.value}</p>
                <LicenceCard className="mt-6 w-full max-w-[320px]" />
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Link href="/verify" className="btn btn-route !min-h-[46px]" data-magnetic>Verify licence {LICENCE.number} <span className="arrow" aria-hidden>→</span></Link>
                </div>
                <p className="mt-4 text-[0.72rem] text-white/50">The licence is held personally by {LICENCE.holder}. No FIFA endorsement of Concordia is implied.</p>
              </div>
            </div>
          </article>

          {/* Filipp + Valerija */}
          <div className="grid gap-5 lg:gap-6">
            <article className="overflow-hidden rounded-[18px] bg-white">
              {fp && (
                <div className="relative aspect-[16/10]">
                  <Image src={fp.src} alt={fp.alt} fill sizes="(min-width:1024px) 34vw, 100vw" className="photo-grade object-cover" style={{ objectPosition: fp.position }} />
                </div>
              )}
              <div className="p-6">
                <h3 className="display text-[clamp(1.9rem,3vw,2.6rem)] leading-none">{filipp.name}</h3>
                <p className="mt-1.5 font-semibold text-ink/70">{filipp.role.value}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/75">{filipp.shortBio?.value}</p>
                {filipp.extendedBio && <Gate evidence={filipp.extendedBio.evidence} label="bio" className="mt-3"><p className="text-[0.9rem] text-ink/60">{filipp.extendedBio.value}</p></Gate>}
              </div>
            </article>
            <article className="grid grid-cols-[110px_1fr] items-center gap-5 overflow-hidden rounded-[18px] bg-white p-4 sm:grid-cols-[130px_1fr]">
              <Gate evidence={valerija.photo.evidence} label="photo"><Portrait name={valerija.name} crop="mobilePortrait" sizes="130px" className="rounded-[10px]" /></Gate>
              <div>
                <h3 className="display text-[clamp(1.7rem,2.6vw,2.2rem)] leading-none">{valerija.name}</h3>
                <p className="mt-1.5 font-semibold text-ink/70">{valerija.role.value}</p>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/75">{valerija.shortBio?.value}</p>
                {valerija.extendedBio && <Gate evidence={valerija.extendedBio.evidence} label="bio" className="mt-2"><p className="text-[0.85rem] text-ink/60">{valerija.extendedBio.value}</p></Gate>}
              </div>
            </article>
          </div>
        </div>
        <Link href="/about" className="mt-8 inline-flex items-center gap-2 font-semibold underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink">About Concordia <span aria-hidden>→</span></Link>
      </div>
    </section>
  );
}
