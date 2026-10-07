"use client";
import Link from "next/link";
import { useMemo } from "react";
import { countryOptions } from "@/lib/countries";
import { PRICE_TAX_NOTE } from "@/lib/tax";
import { LEGAL_ENTITY } from "@/content/site";

export const inputCls = "mt-2 block w-full border border-white/20 bg-ink px-4 py-3.5 text-white focus:border-route focus:outline-none focus-visible:ring-2 focus-visible:ring-route/50 aria-[invalid=true]:border-alert [color-scheme:dark]";

export function guessCountry(text: string): string {
  const t = text.trim().toLowerCase();
  if (!t) return "";
  if (["usa", "us", "u.s.", "united states of america", "america"].includes(t)) return "US";
  if (["uk", "england", "scotland", "wales", "great britain"].includes(t)) return "GB";
  return countryOptions().find((c) => c.name.toLowerCase() === t)?.code ?? "";
}

export function CountrySelect({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const opts = useMemo(() => countryOptions(), []);
  return (
    <label className="block text-[0.92rem] font-semibold">Country of residence <span className="text-route" aria-hidden>*</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} autoComplete="country" className={inputCls}>
        <option value="">Select…</option>{opts.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
      </select>
      {error && <span role="alert" className="mt-1 block text-[0.82rem] font-semibold text-[#ff7a66]">{error}</span>}
    </label>
  );
}

export function Check({ checked, onChange, error, children, required }: { checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className={`flex cursor-pointer items-start gap-3 border p-4 text-[0.92rem] leading-relaxed ${error ? "border-alert" : "border-white/15"}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={Boolean(error)} aria-required={required} className="mt-1 h-5 w-5 shrink-0 accent-[#FFD23F]" />
        <span>{children}{required && <span className="text-route" aria-hidden> *</span>}</span>
      </label>
      {error && <p role="alert" className="mt-1 text-[0.82rem] font-semibold text-[#ff7a66]">{error}</p>}
    </div>
  );
}

export const L = ({ href, children }: { href: string; children: React.ReactNode }) => <Link href={href} target="_blank" className="underline underline-offset-2">{children}</Link>;

export function SellerNote() {
  return (
    <>
      <p className="mt-4 text-[0.78rem] leading-relaxed text-slate-light">{PRICE_TAX_NOTE}</p>
      <p className="mt-3 border-t border-white/10 pt-4 text-[0.78rem] leading-relaxed text-slate-light">Seller: {LEGAL_ENTITY.name} · Reg. No. {LEGAL_ENTITY.registrationNo} · VAT No. {LEGAL_ENTITY.vatNo} · {LEGAL_ENTITY.address.join(", ")}. Card payment is processed by Stripe; we never see or store your card details.</p>
    </>
  );
}

export function BuyerType({ value, onChange, businessName, vatId, setBusinessName, setVatId, errors }: { value: "consumer" | "business"; onChange: (v: "consumer" | "business") => void; businessName: string; vatId: string; setBusinessName: (v: string) => void; setVatId: (v: string) => void; errors: Record<string, string> }) {
  return (
    <fieldset>
      <legend className="text-[0.92rem] font-semibold">Buying as</legend>
      <div className="mt-2 flex flex-wrap gap-4 text-[0.92rem]">
        {(["consumer", "business"] as const).map((o) => <label key={o} className="flex items-center gap-2"><input type="radio" name="buyerType" checked={value === o} onChange={() => onChange(o)} className="h-5 w-5 accent-[#FFD23F]" />{o === "consumer" ? "An individual / family" : "A business or organisation"}</label>)}
      </div>
      {value === "business" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-[0.92rem] font-semibold">Business name <span className="text-route" aria-hidden>*</span><input className={inputCls} value={businessName} onChange={(e) => setBusinessName(e.target.value)} aria-invalid={Boolean(errors.businessName)} autoComplete="organization" />{errors.businessName && <span role="alert" className="mt-1 block text-[0.82rem] font-semibold text-[#ff7a66]">{errors.businessName}</span>}</label>
          <label className="text-[0.92rem] font-semibold">EU VAT number (if any)<input className={inputCls} value={vatId} onChange={(e) => setVatId(e.target.value)} placeholder="e.g. DE123456789" /><span className="mt-1 block text-[0.78rem] font-normal text-white/50">EU businesses outside Latvia with a valid VAT number are invoiced under the reverse charge (checked with the EU VIES service).</span></label>
        </div>
      )}
    </fieldset>
  );
}
