"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMounted } from "@/lib/hooks";
import { readConsent, saveConsent } from "@/lib/consent";
import { persistAttribution } from "@/lib/attribution";

/** Cookie / storage choice. Equal-weight Accept and Reject; nothing optional is stored until Accept. */
export function ConsentBanner() {
  const mounted = useMounted();
  const pathname = usePathname();
  const [forced, setForced] = useState(false);
  const [decided, setDecided] = useState(false);
  const [manage, setManage] = useState(false);
  const [attrib, setAttrib] = useState(false);
  useEffect(() => {
    const reopen = () => setForced(true);
    window.addEventListener("cs:consent-open", reopen);
    return () => window.removeEventListener("cs:consent-open", reopen);
  }, []);
  const open = mounted && (forced || (!decided && !readConsent() && !pathname.startsWith("/admin")));
  if (!open) return null;
  const choose = (yes: boolean) => { saveConsent(yes); if (yes) persistAttribution(); setDecided(true); setForced(false); setManage(false); };
  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl border border-white/15 bg-ink-deep p-5 text-white shadow-2xl sm:p-6">
      <p id="consent-title" className="font-bold">Your choice on cookies</p>
      <p className="mt-2 text-[0.9rem] text-white/80">We use only what the site needs to work. With your OK we’d also remember which campaign brought you here, across visits — no tracking, no advertising cookies. <Link href="/legal/cookies" className="underline underline-offset-2">Cookie Policy</Link></p>
      {manage ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 border border-white/15 p-3 text-[0.88rem]"><span className="mt-0.5 shrink-0 font-semibold text-route">Always on</span><span className="text-white/80">Strictly necessary: your cookie choice, your application draft (this tab only) and, for staff, the admin sign-in.</span></div>
          <label className="flex cursor-pointer items-start gap-3 border border-white/15 p-3 text-[0.88rem]"><input type="checkbox" checked={attrib} onChange={(e) => setAttrib(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#FFD23F]" /><span className="text-white/80"><strong className="text-white">Campaign attribution (optional).</strong> Remembers which link or campaign brought you here, across visits, so we can attach it to your application.</span></label>
          <div className="grid grid-cols-2 gap-3"><button onClick={() => setManage(false)} className="btn btn-ghost !min-h-[44px]">Back</button><button onClick={() => choose(attrib)} className="btn btn-ghost !min-h-[44px]">Save choice</button></div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <button onClick={() => choose(false)} className="btn btn-ghost !min-h-[44px] !px-2">Reject</button>
          <button onClick={() => { setAttrib(readConsent()?.attribution ?? false); setManage(true); }} className="btn btn-ghost !min-h-[44px] !px-2">Manage</button>
          <button onClick={() => choose(true)} className="btn btn-ghost !min-h-[44px] !px-2">Accept</button>
        </div>
      )}
    </div>
  );
}

export function CookieSettingsLink({ className = "" }: { className?: string }) {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("cs:consent-open"))} className={`underline ${className}`}>Cookie settings</button>;
}
