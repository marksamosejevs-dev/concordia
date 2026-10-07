import Link from "next/link";
import { CookieSettingsLink } from "./ConsentBanner";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND, FOOTER_GROUPS, LEGAL_ENTITY, LICENCE } from "@/content/site";

export function Footer() {
  return (
    <footer className="on-deep border-t border-white/10 pb-28 pt-20 lg:pb-14">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <BrandLogo className="h-auto w-[280px] max-w-full" />
            <p className="display d-sm mt-10 text-route">{BRAND.signature}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-light">{BRAND.supporting}</p>
            <p className="mt-6 text-[0.8rem] text-slate-light">A project by <a href="https://concordia.football/" target="_blank" rel="noopener noreferrer" className="font-semibold tracking-[0.06em] text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-route">CONCORDIA SPORTS AGENCY</a></p>
          </div>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {FOOTER_GROUPS.map((g) => (
              <div key={g.title}>
                <p className="eyebrow mb-4 text-slate">{g.title}</p>
                <ul className="space-y-2.5 text-sm">
                  {g.links.map(([href, label]) => <li key={href}><Link href={href} className="text-white/75 hover:text-white">{label}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 grid gap-8 border-t border-white/10 pt-8 text-[0.8rem] leading-relaxed text-slate-light md:grid-cols-2">
          <div>
            <p className="font-semibold text-white">{LEGAL_ENTITY.name}</p>
            <p>Reg. No. {LEGAL_ENTITY.registrationNo} · VAT {LEGAL_ENTITY.vatNo}</p>
            <p>{LEGAL_ENTITY.address.join(", ")}</p>
            <p className="mt-2">{LEGAL_ENTITY.note}</p>
          </div>
          <div>
            <p className="font-semibold text-white">Led by FIFA Licensed Football Agent {LICENCE.holder}</p>
            <p>Licence No. {LICENCE.number}</p>
            <p className="mt-2"><Link href="/legal/terms#not-representation" className="underline">Legal notices</Link> · <CookieSettingsLink /></p>
          </div>
        </div>
        <p className="mono mt-10 text-[0.68rem] text-slate">© {new Date().getFullYear()} {LEGAL_ENTITY.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
