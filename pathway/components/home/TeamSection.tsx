import Image from "next/image";
import Link from "next/link";
import { sortedTeam } from "@/content/team";
import { TEAM_PORTRAITS, type PortraitAsset } from "@/content/people-assets";

/** One crop system for every portrait: same ratio, framing (focus + zoom) and treatment. */
export function PortraitFrame({ a, name, sizes, className = "" }: { a?: PortraitAsset; name: string; sizes: string; className?: string }) {
  return (
    <div className={`relative aspect-[4/5] overflow-hidden rounded-[14px] bg-ink ${className}`}>
      {a?.src ? (
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" style={{ transformOrigin: a.focus }}>
          <div className="absolute inset-0" style={{ transform: `scale(${a.zoom})`, transformOrigin: a.focus }}>
            <Image src={a.src} alt={a.alt} fill sizes={sizes} className="object-cover grayscale-[0.25] contrast-[1.05] transition-[filter] duration-700 group-hover:grayscale-0" style={{ objectPosition: a.focus }} />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_0%,#1E3C9C66,transparent_65%)]" aria-label={`${name} — portrait to follow`} role="img">
          <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#fff_1px,transparent_1.2px)] [background-size:14px_14px] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" aria-hidden />
          <svg viewBox="0 0 200 250" className="absolute inset-x-0 bottom-0 mx-auto h-[78%] w-auto text-white/[0.14]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <circle cx="100" cy="92" r="38" />
            <path d="M28 250c4-52 34-86 72-86s68 34 72 86" />
          </svg>
          <span className="absolute left-4 top-4 h-[2px] w-8 bg-route" aria-hidden />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/45 to-transparent" aria-hidden />
    </div>
  );
}

/** TEAM — three people, one organisation. Marks first; equal card system. */
export function TeamSection() {
  const team = sortedTeam();
  return (
    <section id="team" className="on-paper relative overflow-hidden py-[clamp(4.5rem,10vw,7.5rem)]" aria-labelledby="team-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="team-title" className="display max-w-[14ch] text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.9]">The people in your corner.</h2>
          <Link href="/about" className="inline-flex items-center gap-2 font-semibold underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink">About Concordia <span aria-hidden>→</span></Link>
        </div>
        <ul className="mt-10 grid gap-x-6 gap-y-7 sm:mt-12 sm:grid-cols-3 sm:gap-y-10">
          {team.map((m) => (
            <li key={m.id} className="group grid grid-cols-[minmax(96px,32%)_1fr] items-start gap-x-4 gap-y-4 sm:block">
              <PortraitFrame a={TEAM_PORTRAITS[m.id]} name={m.name} sizes="(min-width:1360px) 400px, (min-width:640px) 31vw, 32vw" />
              <div className="self-center sm:self-auto">
                <h3 className="display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none sm:mt-5">{m.name}</h3>
                <p className="mt-1.5 font-semibold text-ink">{m.role.value}</p>
                {m.secondaryRole && <p className="text-[0.9rem] font-semibold text-ink/60">{m.secondaryRole.value}</p>}
              </div>
              <div className="col-span-2 max-w-[40ch] sm:mt-4">
                {m.teamBio?.value ? m.teamBio.value.map((para, n) => (
                  <p key={n} className={n === 0 ? "text-[0.95rem] leading-relaxed text-ink/80" : "mt-2.5 text-[0.88rem] leading-relaxed text-ink/65"}>{para}</p>
                )) : <p className="text-[0.95rem] leading-relaxed text-ink/75">{(m.teamLine ?? m.shortBio)?.value}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
