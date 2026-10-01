"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMounted } from "@/lib/hooks";
import { buildOrder, redirectTo, type PayerForm } from "@/lib/commerce/order";
import { lastApplication } from "@/lib/applications/destination";
import { readAttribution } from "@/lib/attribution";
import { getPaymentProvider } from "@/lib/commerce/provider";
import type { Consent } from "@/lib/commerce/types";
import { product } from "@/content/products";
import { LEGAL_ENTITY } from "@/content/site";
import { usd } from "@/lib/format";
import { track } from "@/lib/analytics";
import { IS_REVIEW, FEATURES } from "@/lib/site-mode";

const ACKS: { key: Consent["key"]; label: string }[] = [
  { key: "not_representation", label: "I understand that purchasing a Concordia Soccer · European Pathway service does not constitute football-agent representation and does not create a FIFA Representation Agreement." },
  { key: "terms", label: "I agree to the Terms of Service." },
  { key: "privacy", label: "I have read the Privacy Policy." },
  { key: "refund", label: "I have read the Refund & Cancellation Policy." },
];

function initialForm(): PayerForm {
  const a = lastApplication();
  const attr = readAttribution();
  return { playerName: a?.data.fullName ?? "", payerName: a?.data.guardian?.name ?? a?.data.fullName ?? "", email: a?.data.guardian?.email ?? a?.data.email ?? "", country: a?.data.residence ?? "", line1: "", city: "", postcode: "", isGuardian: a?.triage.route === "guardian_payment", code: attr.last?.ref ?? attr.first?.ref ?? "" };
}

export function CheckoutForm() {
  const mounted = useMounted();
  if (!mounted) return <div className="h-64" />;
  return <CheckoutInner />;
}

function CheckoutInner() {
  const router = useRouter();
  const p = product("assessment");
  const [f, setF] = useState<PayerForm>(initialForm);
  const [acks, setAcks] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState("");
  const [eligible] = useState<boolean>(() => { const a = lastApplication(); return Boolean(a && (a.triage.route === "accepted" || a.triage.route === "guardian_payment")) || IS_REVIEW; });
  useEffect(() => { track("checkout_start", { product: "assessment", price_mode: "current" }); }, []);
  const set = (k: keyof PayerForm, v: string | boolean) => setF((x) => ({ ...x, [k]: v }));

  const pay = async () => {
    const missing = !f.playerName || !f.payerName || !/^\S+@\S+\.\S+$/.test(f.email) || !f.country || !f.line1 || !f.city || !f.postcode;
    if (missing) return setErr("Please complete the payer details.");
    if (ACKS.some((a) => !acks[a.key])) return setErr("Please confirm each acknowledgement.");
    setErr("");
    const order = buildOrder({ productId: p.id, amount: p.price, form: f, consentKeys: ACKS.map((a) => a.key), applicationId: lastApplication()?.id, attribution: readAttribution() });
    const session = await getPaymentProvider().createCheckout(order);
    try { sessionStorage.setItem("cs_last_order", JSON.stringify({ order, session })); } catch {}
    if (session.status === "redirect" && session.redirectUrl) redirectTo(session.redirectUrl);
    else router.push("/checkout/confirmation");
  };

  if (!eligible) return (
    <div className="border border-white/15 bg-ink-deep p-8">
      <h1 className="display d-md">Apply first.</h1>
      <p className="mt-3 text-white/80">The assessment is purchased after a free application, once you’ve been accepted. It takes about ten minutes.</p>
      <Link href="/apply" className="btn btn-route mt-6">Apply free <span className="arrow">→</span></Link>
    </div>
  );

  const input = "mt-2 block w-full border border-white/20 bg-ink px-4 py-3.5 text-white focus:border-route focus:outline-none";
  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] [&>*]:min-w-0">
      <form className="order-2 border border-white/15 bg-ink-deep p-6 sm:p-9 lg:order-1" onSubmit={(e) => { e.preventDefault(); pay(); }} noValidate>
        <h1 className="display d-md">Complete your assessment purchase</h1>
        {!FEATURES.paymentsLive && <p className="gate-tag mt-4 inline-block">Preview · payments not active · no card will be charged</p>}
        <fieldset className="mt-8 grid gap-5 sm:grid-cols-2">
          <legend className="eyebrow mb-4 text-slate-light">Player &amp; payer</legend>
          <label className="sm:col-span-2 text-[0.92rem] font-semibold">Player’s name<input className={input} value={f.playerName} onChange={(e) => set("playerName", e.target.value)} /></label>
          <label className="flex items-center gap-3 sm:col-span-2 text-[0.92rem]"><input type="checkbox" checked={f.isGuardian} onChange={(e) => set("isGuardian", e.target.checked)} className="h-5 w-5 accent-[#FFD23F]" />I’m paying as the player’s parent or guardian</label>
          <label className="text-[0.92rem] font-semibold">Payer’s full name<input className={input} autoComplete="name" value={f.payerName} onChange={(e) => set("payerName", e.target.value)} /></label>
          <label className="text-[0.92rem] font-semibold">Email for receipt<input className={input} type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></label>
        </fieldset>
        <fieldset className="mt-8 grid gap-5 sm:grid-cols-2">
          <legend className="eyebrow mb-4 text-slate-light">Billing address</legend>
          <label className="sm:col-span-2 text-[0.92rem] font-semibold">Address<input className={input} autoComplete="address-line1" value={f.line1} onChange={(e) => set("line1", e.target.value)} /></label>
          <label className="text-[0.92rem] font-semibold">City<input className={input} autoComplete="address-level2" value={f.city} onChange={(e) => set("city", e.target.value)} /></label>
          <label className="text-[0.92rem] font-semibold">Postcode / ZIP<input className={input} autoComplete="postal-code" value={f.postcode} onChange={(e) => set("postcode", e.target.value)} /></label>
          <label className="sm:col-span-2 text-[0.92rem] font-semibold">Country<input className={input} autoComplete="country-name" value={f.country} onChange={(e) => set("country", e.target.value)} /></label>
        </fieldset>
        <fieldset className="mt-8">
          <legend className="eyebrow mb-4 text-slate-light">Referral or promo code</legend>
          <input className={input} value={f.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="Optional" aria-label="Referral or promo code" />
        </fieldset>
        <fieldset className="mt-8 space-y-3">
          <legend className="eyebrow mb-4 text-slate-light">Acknowledgements</legend>
          {ACKS.map((a) => (
            <label key={a.key} className="flex cursor-pointer items-start gap-3 border border-white/15 p-4 text-[0.92rem] leading-relaxed">
              <input type="checkbox" checked={Boolean(acks[a.key])} onChange={(e) => setAcks((x) => ({ ...x, [a.key]: e.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-[#FFD23F]" />
              <span>{a.label}{IS_REVIEW && <span className="gate-tag ml-2 align-middle">Final legal wording pending</span>}</span>
            </label>
          ))}
        </fieldset>
        {err && <p role="alert" className="mt-5 font-semibold text-[#ff7a66]">{err}</p>}
        <button type="submit" className="btn btn-route mt-8 w-full">Continue to secure payment · {usd(p.price)} <span className="arrow">→</span></button>
        <p className="mt-4 text-center text-[0.78rem] text-slate-light">Card payment is handled by a secure payment provider. Tax/VAT is shown at payment where applicable.</p>
      </form>
      <aside className="order-1 self-start border border-white/15 bg-ink-deep p-6 sm:p-8 lg:sticky lg:top-24 lg:order-2">
        <p className="eyebrow text-slate-light">Order summary</p>
        <p className="display mt-4 text-[1.8rem] leading-none">{p.name}</p>
        <ul className="mt-4 space-y-1.5 text-[0.88rem] text-white/75">
          <li>— Written report, 6–8 pages</li><li>— Full-match review + highlights</li><li>— Level band, strengths &amp; gaps</li><li>— Three market directions · passport analysis</li><li>— 90-day action plan · 30-minute review call</li>
        </ul>
        <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5"><span className="font-semibold">Total</span><span className="display text-[2.8rem] leading-none text-route">{usd(p.price)}</span></div>
        <p className="mono mt-4 text-[0.68rem] text-slate-light">$150 credited toward any programme booked within 14 days.</p>
        <p className="mt-6 border-t border-white/10 pt-5 text-[0.78rem] leading-relaxed text-slate-light">Seller: {LEGAL_ENTITY.name} · Reg. No. {LEGAL_ENTITY.registrationNo} · VAT {LEGAL_ENTITY.vatNo} · {LEGAL_ENTITY.address.join(", ")}</p>
      </aside>
    </div>
  );
}
