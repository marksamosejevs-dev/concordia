import type { Metadata } from "next";
import { EMAILS } from "@/content/emails";
import { IS_REVIEW } from "@/lib/site-mode";

export const metadata: Metadata = { title: "Email templates (review)", robots: { index: false, follow: false } };

/** Review-only preview of every applicant email. Not linked publicly; empty in production builds. */
export default function EmailsReview() {
  if (!IS_REVIEW) return <section className="on-ink min-h-[60vh] pt-[calc(var(--header-h)+3rem)]"><p className="wrap">Not available.</p></section>;
  return (
    <section className="on-paper min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]">
      <div className="wrap-narrow">
        <h1 className="display d-lg">Applicant emails</h1>
        <p className="mt-3 text-ink/70">Templates for the Pathway Assessment funnel. <strong>Sending is not connected yet</strong> — a transactional email provider is required.</p>
        <div className="mt-10 space-y-10">
          {EMAILS.map((e) => (
            <article key={e.key} id={e.key} className="scroll-mt-28">
              <p className="text-[0.85rem] font-semibold text-ink/55">{e.trigger}</p>
              <div className="mt-2 overflow-hidden rounded-[14px] border border-ink/10 bg-white shadow-sm">
                <div className="border-b border-ink/10 px-6 py-3 text-[0.85rem]"><span className="text-ink/50">Subject: </span><strong>{e.subject}</strong></div>
                <div className="bg-ink px-6 py-5"><p className="display text-[1.6rem] leading-none text-white">{e.heading}</p></div>
                <div className="space-y-3 px-6 py-6 text-[0.95rem] text-ink/85">
                  {e.body.map((b) => <p key={b} className={b.startsWith("Being accepted") ? "rounded-[8px] bg-route/30 px-3 py-2 font-semibold" : ""}>{b}</p>)}
                  {e.list && <ul className="list-disc space-y-1 pl-5">{e.list.map((l) => <li key={l}>{l}</li>)}</ul>}
                  {e.cta && <p className="pt-2"><span className="inline-block rounded-full bg-route px-5 py-2.5 font-bold text-ink">{e.cta.label} →</span> <span className="ml-2 text-[0.75rem] text-ink/45">{e.cta.href}</span></p>}
                  {e.note && <p className="text-[0.85rem] text-ink/60">{e.note}</p>}
                  <p className="border-t border-ink/10 pt-3 text-[0.75rem] text-ink/45">Concordia Soccer · European Pathway — Concordia Sports Agency SIA, Rīga, Latvia</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
