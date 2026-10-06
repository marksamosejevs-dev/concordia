"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { team } from "@/content/team";
import { CREDENTIAL_PHOTO, CREDENTIAL_DOCS, type CredentialDoc } from "@/content/people-assets";
import { IS_REVIEW } from "@/lib/site-mode";

/**
 * MARKS AMOSEJEVS — FIFA LICENSED FOOTBALL AGENT.
 * Editorial credential moment after the team: a different Marks photograph, the credential as the
 * dominant line, and real documents as proof (tap to enlarge). Documents render only from real assets.
 */
export function CredentialSection() {
  const marks = team.find((t) => t.id === "marks-amosejevs")!;
  const [open, setOpen] = useState<CredentialDoc | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const show = (d: CredentialDoc) => { setOpen(d); requestAnimationFrame(() => dlg.current?.showModal()); };
  const docs = CREDENTIAL_DOCS.filter((d) => d.status === "real" || IS_REVIEW);
  const p = CREDENTIAL_PHOTO;

  return (
    <section className="on-ink relative overflow-hidden py-[clamp(4.5rem,10vw,7.5rem)]" aria-labelledby="credential-title">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <figure className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[18px] lg:max-w-none">
          {p.src && (
            <div className="absolute inset-0" style={{ transform: `scale(${p.zoom})`, transformOrigin: p.focus }}>
              <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 40vw, 92vw" className="photo-grade object-cover" style={{ objectPosition: p.focus }} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" aria-hidden />
          <figcaption className="absolute bottom-4 left-5 text-[0.85rem] font-semibold text-white/85">{marks.name} · {marks.role.value}</figcaption>
        </figure>

        <div>
          <h2 id="credential-title" className="display text-[clamp(3rem,6.6vw,6.4rem)] leading-[0.86]">FIFA Licensed<br /><span className="text-route">Football Agent</span></h2>
          <p className="display mt-5 text-[clamp(1.7rem,2.8vw,2.4rem)] leading-none">{marks.name}</p>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-white/80">{marks.shortBio?.value}</p>

          <ul className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            {docs.map((d) => (
              <li key={d.key}>
                {d.status === "real" && d.src ? (
                  <button onClick={() => show(d)} className="group block w-full text-left" aria-label={`Enlarge: ${d.title}`}>
                    <span className="relative block overflow-hidden rounded-[10px] bg-white/5 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]" style={{ aspectRatio: `${d.w}/${d.h}` }}>
                      <Image src={d.src} alt={d.alt} fill sizes="(min-width:640px) 280px, 92vw" className="object-cover" />
                      <span className="absolute bottom-2 right-2 rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Enlarge</span>
                    </span>
                    <span className="mt-2 block text-[0.92rem] font-bold">{d.title}</span>
                    {d.detail && <span className="block text-[0.8rem] text-white/60">{d.detail}</span>}
                  </button>
                ) : (
                  <div className="gated min-h-[7rem] rounded-[10px] p-4 sm:h-full">
                    <span className="gate-tag absolute -top-3 left-2">Review only · waiting for document scan</span>
                    <p className="text-[0.85rem] text-white/60">{d.title} — the real document’s title and institution will appear here once supplied.</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dialog ref={dlg} onClose={() => setOpen(null)} onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }} className="m-auto w-[min(100vw,960px)] max-w-none rounded-[14px] bg-ink p-0 text-white backdrop:bg-ink-deep/85 sm:w-[min(92vw,960px)]" aria-label={open?.title}>
        {open?.src && (
          <div className="p-2 sm:p-5">
            <div className="relative w-full" style={{ aspectRatio: `${open.w}/${open.h}` }}><Image src={open.src} alt={open.alt} fill sizes="960px" className="rounded-[8px] object-contain" /></div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-[0.9rem] font-semibold">{open.title}</p><div className="flex gap-2"><a href={open.src} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-[40px]">Open full size ↗</a><button onClick={() => dlg.current?.close()} className="btn btn-ghost !min-h-[40px]">Close</button></div></div>
          </div>
        )}
      </dialog>
    </section>
  );
}
