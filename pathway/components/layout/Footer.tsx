import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { BRAND, FOOTER_GROUPS, LEGAL_ENTITY, LICENCE } from "@/content/site";

export function Footer() {
  return (
    <footer className="on-deep border-t border-white/10 pb-28 pt-20 lg:pb-14">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo className="h-12 w-auto" />
            <p className="display d-sm mt-10 text-route">{BRAND.signature}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-light">{BRAND.supporting}</p>
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
            <p className="mt-2"><Link href="/legal/terms#notices" className="underline">Legal notices</Link></p>
          </div>
        </div>
        <p className="mono mt-10 text-[0.68rem] text-slate">© {new Date().getFullYear()} {LEGAL_ENTITY.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
