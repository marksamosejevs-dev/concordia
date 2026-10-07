"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePlayerView, useUrlParam } from "@/lib/client/player";
import { ACCEPTED_MEANING, ASSESSMENT_INCLUDES, DELIVERY } from "@/content/assessment";
import { REFUND_LINE, CREDIT_LINE } from "@/content/commerce";
import { track } from "@/lib/analytics";
import { Loading, InvalidLink, LoadError } from "@/components/funnel/LinkStates";
import { CountrySelect, Check, L, SellerNote, BuyerType, inputCls, guessCountry, TaxLine } from "./CheckoutParts";

/** $249 Pathway Assessment checkout — accepted applicants only; payment happens on Stripe’s hosted page. */
export function CheckoutForm() {
  const { token, view, state, reload } = usePlayerView();
  const [payerNameEdit, setPayerName] = useState<string | null>(null); const [payerEmailEdit, setPayerEmail] = useState<string | null>(null); const [countryEdit, setCountry] = useState<string | null>(null);
  const [buyerType, setBuyerType] = useState<"consumer" | "business">("consumer"); const [businessName, setBusinessName] = useState(""); const [vatId, setVatId] = useState("");
  const [guardian, setGuardian] = useState(false);
  const [c, setC] = useState({ terms: false, notRepresentation: false, residenceDeclaration: false, earlyStart: false });
  const [errors, setErrors] = useState<Record<string, string>>({}); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const cancelled = useUrlParam("cancelled") === "1";
  const payerName = payerNameEdit ?? (view ? (view.isMinor ? view.guardianName ?? "" : view.playerName) : "");
  const payerEmail = payerEmailEdit ?? view?.payerEmail ?? "";
  const country = countryEdit ?? (view ? guessCountry(view.residence) : "");
  useEffect(() => { if (view) track("checkout_start", { product: "assessment" }); }, [view]);

  if (state === "loading") return <Loading />;
  if (state === "invalid") return <InvalidLink />;
  if (state === "error" || !view || !token) return <LoadError retry={reload} />;
  const t = encodeURIComponent(token);
  if (view.paid) return <Notice title="Your payment is already confirmed." body="Next: send your football profile and materials." href={`/onboarding?t=${t}`} cta="Send your materials" />;
  if (!view.accepted || view.notAccepted) return <Notice title="Payment opens after acceptance." body="The Pathway Assessment is paid for only after a free application and our review. We’ll email you the outcome." href={`/status?t=${t}`} cta="Your status" />;

  const set = (k: keyof typeof c, v: boolean) => { setC((x) => ({ ...x, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };
  const pay = async () => {
    if (busy) return;
    const e: Record<string, string> = {};
    if (!payerName.trim()) e.payerName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payerEmail)) e.payerEmail = "Valid email required";
    if (!country) e.country = "Choose your country of residence";
    if (view.isMinor && !guardian) e.isGuardianPayer = "For players under 18, a parent or legal guardian must pay";
    if (buyerType === "business" && !businessName.trim()) e.businessName = "Required";
    if (!c.terms) e.terms = "Required"; if (!c.notRepresentation) e.notRepresentation = "Required"; if (!c.residenceDeclaration) e.residenceDeclaration = "Required";
    setErrors(e); setMsg("");
    if (Object.keys(e).length) { setTimeout(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/checkout/assessment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ t: token, payerName, payerEmail, country, buyerType, businessName, vatId, isGuardianPayer: guardian, consents: c }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.url) { window.location.assign(j.url); return; }
      if (j.errors) setErrors(j.errors);
      setMsg(j.message ?? (r.status === 409 && j.error === "already_paid" ? "This assessment is already paid." : "We couldn’t open the secure payment page just now. Nothing has been charged — please try again."));
    } catch { setMsg("We couldn’t open the secure payment page just now. Nothing has been charged — please try again."); }
    setBusy(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] [&>*]:min-w-0">
      <form className="order-2 border border-white/15 bg-ink-deep p-6 sm:p-9 lg:order-1" onSubmit={(ev) => { ev.preventDefault(); pay(); }} noValidate>
        <p className="inline-flex rounded-full bg-route px-3 py-1 text-[0.85rem] font-bold text-ink">Accepted for a Pathway Assessment · {view.id}</p>
        <p className="mt-3 text-[0.95rem] text-white/80">{ACCEPTED_MEANING}</p>
        <h1 className="display d-md mt-6">Pathway Assessment — $249</h1>
        {cancelled && <p className="mt-3 text-white/70">Payment was cancelled — nothing has been charged. You can try again below.</p>}

        <fieldset className="mt-8 grid gap-5 sm:grid-cols-2">
          <legend className="eyebrow mb-4 text-slate-light">Payer</legend>
          <label className="text-[0.92rem] font-semibold">Payer’s full name <span className="text-route" aria-hidden>*</span><input className={inputCls} value={payerName} onChange={(e) => setPayerName(e.target.value)} autoComplete="name" aria-invalid={Boolean(errors.payerName)} /></label>
          <label className="text-[0.92rem] font-semibold">Email for receipt <span className="text-route" aria-hidden>*</span><input className={inputCls} type="email" inputMode="email" autoComplete="email" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} aria-invalid={Boolean(errors.payerEmail)} /></label>
          <div className="sm:col-span-2"><CountrySelect value={country} onChange={setCountry} error={errors.country} /></div>
          <div className="sm:col-span-2"><BuyerType value={buyerType} onChange={setBuyerType} businessName={businessName} vatId={vatId} setBusinessName={setBusinessName} setVatId={setVatId} errors={errors} /></div>
          <div className="sm:col-span-2"><TaxLine baseCents={24900} country={country} buyerType={buyerType} vatId={vatId} /></div>
          {view.isMinor && <div className="sm:col-span-2"><Check checked={guardian} onChange={setGuardian} error={errors.isGuardianPayer} required>I am {view.playerName}’s parent or legal guardian and I am buying the Pathway Assessment for them.</Check></div>}
        </fieldset>

        <div className="mt-8 space-y-3 border-l-2 border-route pl-4 text-[0.92rem] text-white/85">
          <p><strong>Refunds.</strong> {REFUND_LINE} If you’re a consumer you also have a 14-day right of withdrawal — see the <L href="/legal/refunds">Refund &amp; Withdrawal Policy</L>.</p>
          <p><strong>Assessment credit.</strong> {CREDIT_LINE}</p>
        </div>

        <fieldset className="mt-8 space-y-3">
          <legend className="eyebrow mb-4 text-slate-light">Before you pay</legend>
          <Check checked={c.terms} onChange={(v) => set("terms", v)} error={errors.terms} required>I agree to the <L href="/legal/assessment-terms">Pathway Assessment Terms</L> and the <L href="/legal/terms">Terms of Service</L>, and I have read the <L href="/legal/refunds">Refund &amp; Withdrawal Policy</L> and the <L href="/legal/privacy">Privacy Policy</L>.</Check>
          <Check checked={c.notRepresentation} onChange={(v) => set("notRepresentation", v)} error={errors.notRepresentation} required>I understand this is a Pathway Assessment — not football-agent representation — and that no club, trial, contract, transfer or other outcome is promised or guaranteed.</Check>
          <Check checked={c.residenceDeclaration} onChange={(v) => set("residenceDeclaration", v)} error={errors.residenceDeclaration} required>I confirm that the country of residence above is correct (it determines how VAT applies).</Check>
          <Check checked={c.earlyStart} onChange={(v) => set("earlyStart", v)}>Optional — start now: I ask Concordia to begin the Pathway Assessment straight away, within my 14-day withdrawal period. I understand that if I withdraw during that period I pay for the work already done, and that I lose the right to withdraw once the assessment has been fully provided. <span className="text-white/60">(Recommended if you want your assessment without delay. If you leave it unticked, we still check your materials, but the assessment itself starts only when the 14 days have passed — you can ask us to start sooner from your status page.)</span></Check>
        </fieldset>

        {msg && <p role="alert" className="mt-5 border-l-2 border-alert pl-4 text-white">{msg}</p>}
        <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-route mt-8 w-full disabled:opacity-60">{busy ? "Opening secure payment…" : "Continue to secure payment · $249"} <span className="arrow" aria-hidden>→</span></button>
      </form>
      <aside className="order-1 self-start border border-white/15 bg-ink-deep p-6 sm:p-8 lg:sticky lg:top-24 lg:order-2">
        <p className="eyebrow text-slate-light">Order summary</p>
        <p className="display mt-4 text-[1.8rem] leading-none">Pathway Assessment</p>
        <p className="mt-1 text-[0.85rem] text-white/60">Player: {view.playerName}</p>
        <ul className="mt-4 space-y-1.5 text-[0.88rem] text-white/75">{ASSESSMENT_INCLUDES.map((x) => <li key={x}>— {x}</li>)}</ul>
        <p className="mt-4 text-[0.82rem] text-white/60">{DELIVERY}</p>
        <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5"><span className="font-semibold">Total · one time</span><span className="display text-[2.8rem] leading-none text-route">$249</span></div>
        <SellerNote />
      </aside>
    </div>
  );
}

function Notice({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return <div className="border border-white/15 bg-ink-deep p-8"><h1 className="display d-md">{title}</h1><p className="mt-3 text-white/80">{body}</p><Link href={href} className="btn btn-route mt-6">{cta} <span className="arrow" aria-hidden>→</span></Link></div>;
}
