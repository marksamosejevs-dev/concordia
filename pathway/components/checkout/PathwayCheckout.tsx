"use client";
import Link from "next/link";
import { useState } from "react";
import { usePlayerView, fmtDate } from "@/lib/client/player";
import { SUBSCRIPTION_LINES, CONTRACT_REVIEW_LINE } from "@/content/commerce";
import { Loading, InvalidLink, LoadError } from "@/components/funnel/LinkStates";
import { CountrySelect, Check, L, SellerNote, BuyerType, guessCountry, TaxLine } from "./CheckoutParts";

/** European Pathway — $399/month subscription, offered after the assessment call. Hosted Stripe Checkout. */
export function PathwayCheckout() {
  const { token, view, state, reload } = usePlayerView();
  const [countryEdit, setCountry] = useState<string | null>(null); const [buyerType, setBuyerType] = useState<"consumer" | "business">("consumer");
  const [businessName, setBusinessName] = useState(""); const [vatId, setVatId] = useState(""); const [guardian, setGuardian] = useState(false);
  const [c, setC] = useState({ subscriptionTerms: false, autoRenew: false, notRepresentation: false, earlyStart: false });
  const [errors, setErrors] = useState<Record<string, string>>({}); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);

  const country = countryEdit ?? (view ? guessCountry(view.residence) : "");
  if (state === "loading") return <Loading />;
  if (state === "invalid") return <InvalidLink />;
  if (state === "error" || !view || !token) return <LoadError retry={reload} />;
  const t = encodeURIComponent(token);
  if (view.subscription && view.subscription.status !== "cancelled") return <div className="border border-white/15 bg-ink-deep p-8"><h1 className="display d-md">You’re subscribed to European Pathway.</h1><Link href={`/status?t=${t}`} className="btn btn-route mt-6">Your status & subscription</Link></div>;
  if (!view.pathwayOffered) return <div className="border border-white/15 bg-ink-deep p-8"><h1 className="display d-md">European Pathway follows your assessment.</h1><p className="mt-3 text-white/80">We offer European Pathway after your Pathway Assessment and consultation call, when it makes sense for you.</p><Link href="/european-pathway" className="btn btn-ghost mt-6">About European Pathway</Link></div>;

  const first = view.credit ? 249 : 399;
  const set = (k: keyof typeof c, v: boolean) => { setC((x) => ({ ...x, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };
  const go = async () => {
    if (busy) return;
    const e: Record<string, string> = {};
    if (!country) e.country = "Choose your country of residence";
    if (view.isMinor && !guardian) e.isGuardianPayer = "For players under 18, a parent or legal guardian must subscribe";
    if (buyerType === "business" && !businessName.trim()) e.businessName = "Required";
    for (const k of ["subscriptionTerms", "autoRenew", "notRepresentation"] as const) if (!c[k]) e[k] = "Required";
    setErrors(e); setMsg("");
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const r = await fetch("/api/checkout/pathway", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ t: token, country, buyerType, businessName, vatId, isGuardianPayer: guardian, consents: c }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.url) { window.location.assign(j.url); return; }
      if (j.errors) setErrors(j.errors);
      setMsg(j.message ?? "We couldn’t open the secure payment page just now. Nothing has been charged — please try again.");
    } catch { setMsg("We couldn’t open the secure payment page just now. Nothing has been charged — please try again."); }
    setBusy(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] [&>*]:min-w-0">
      <form className="order-2 border border-white/15 bg-ink-deep p-6 sm:p-9 lg:order-1" onSubmit={(ev) => { ev.preventDefault(); go(); }} noValidate>
        <h1 className="display d-md">European Pathway — $399/month</h1>
        <ul className="mt-4 space-y-1 text-white/80">{SUBSCRIPTION_LINES.map((l) => <li key={l}>{l}</li>)}</ul>
        <p className="mt-4 text-[0.9rem] text-white/70">Includes: {CONTRACT_REVIEW_LINE.charAt(0).toLowerCase() + CONTRACT_REVIEW_LINE.slice(1)}</p>
        <div className="mt-8 grid gap-5"><CountrySelect value={country} onChange={setCountry} error={errors.country} /><BuyerType value={buyerType} onChange={setBuyerType} businessName={businessName} vatId={vatId} setBusinessName={setBusinessName} setVatId={setVatId} errors={errors} />
        <TaxLine baseCents={39900} country={country} buyerType={buyerType} vatId={vatId} suffix=" per month, before any assessment credit" />
          {view.isMinor && <Check checked={guardian} onChange={setGuardian} error={errors.isGuardianPayer} required>I am {view.playerName}’s parent or legal guardian and I am subscribing for them.</Check>}</div>
        <fieldset className="mt-8 space-y-3">
          <legend className="eyebrow mb-4 text-slate-light">Before you subscribe</legend>
          <Check checked={c.subscriptionTerms} onChange={(v) => set("subscriptionTerms", v)} error={errors.subscriptionTerms} required>I agree to the <L href="/legal/pathway-terms">European Pathway Subscription Terms</L> and the <L href="/legal/terms">Terms of Service</L>, and I have read the <L href="/legal/refunds">Refund &amp; Withdrawal Policy</L> and the <L href="/legal/privacy">Privacy Policy</L>.</Check>
          <Check checked={c.autoRenew} onChange={(v) => set("autoRenew", v)} error={errors.autoRenew} required>I authorise a recurring monthly charge: {view.credit ? "$249 today (after the $150 assessment credit), then " : ""}$399 every month until I cancel. I can cancel online at any time from my status page; cancellation takes effect at the end of the current billing month.</Check>
          <Check checked={c.notRepresentation} onChange={(v) => set("notRepresentation", v)} error={errors.notRepresentation} required>I understand European Pathway is advisory career management — not football-agent representation — and that no club, trial, contract, transfer or other outcome is guaranteed.</Check>
          <Check checked={c.earlyStart} onChange={(v) => set("earlyStart", v)}>Optional — start now: I ask Concordia to begin the service straight away, within my 14-day withdrawal period, and understand that if I withdraw during that period I pay for the service provided until then.</Check>
        </fieldset>
        {msg && <p role="alert" className="mt-5 border-l-2 border-alert pl-4 text-white">{msg}</p>}
        <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-route mt-8 w-full disabled:opacity-60">{busy ? "Opening secure payment…" : `Subscribe · $${first} today`} <span className="arrow" aria-hidden>→</span></button>
      </form>
      <aside className="order-1 self-start border border-white/15 bg-ink-deep p-6 sm:p-8 lg:sticky lg:top-24 lg:order-2">
        <p className="eyebrow text-slate-light">Summary</p>
        <p className="display mt-4 text-[1.8rem] leading-none">European Pathway</p>
        <dl className="mt-5 space-y-2 text-[0.92rem]">
          <div className="flex justify-between"><dt>Monthly price</dt><dd className="font-semibold">$399</dd></div>
          {view.credit && <div className="flex justify-between"><dt>Assessment credit (first payment only)</dt><dd className="font-semibold">−$150</dd></div>}
          <div className="flex justify-between border-t border-white/10 pt-2"><dt className="font-semibold">Today</dt><dd className="display text-[2rem] leading-none text-route">${first}</dd></div>
          <div className="flex justify-between text-white/70"><dt>Then</dt><dd>$399/month</dd></div>
        </dl>
        {view.credit && <p className="mt-3 text-[0.78rem] text-slate-light">{view.credit.expiresAt ? `Credit available until ${fmtDate(view.credit.expiresAt)}. ` : ""}One use only; not cash.</p>}
        <SellerNote />
      </aside>
    </div>
  );
}
