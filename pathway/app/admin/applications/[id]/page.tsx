import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/server/admin";
import { getApplication, stateOf, deadlineOf } from "@/lib/server/records";
import { playerToken } from "@/lib/server/tokens";
import { siteOrigin } from "@/lib/server/env";
import { STATE_LABEL } from "@/lib/assessment-status";
import { ONBOARDING } from "@/content/onboarding";
import { AdminActions } from "@/components/admin/AdminActions";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = { title: "Application — admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
const fmt = (s?: string) => (s ? new Date(s).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC" : "—");

function DL({ rows }: { rows: [string, unknown][] }) {
  return <dl className="grid gap-x-6 gap-y-2 text-[0.88rem] sm:grid-cols-[12rem_1fr]">{rows.map(([k, v]) => <div key={k} className="contents"><dt className="text-white/55">{k}</dt><dd className="break-words">{Array.isArray(v) ? v.join(", ") || "—" : v === true ? "Yes" : v === false ? "No" : (v ?? "") === "" ? "—" : String(v)}</dd></div>)}</dl>;
}
const Box = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="border border-white/15 bg-ink-deep p-5 sm:p-6"><h2 className="mb-4 text-[1.05rem] font-bold">{title}</h2>{children}</section>;

export default async function AdminApplication({ params }: { params: Promise<{ id: string }> }) {
  const wrap = (c: React.ReactNode) => <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2rem)]"><div className="wrap">{c}</div></section>;
  if (!(await isAdmin())) return wrap(<AdminLogin />);
  const { id } = await params;
  const r = await getApplication(id);
  if (!r) notFound();
  const s = stateOf(r), d = deadlineOf(r), a = r.data, p = r.payment;
  const playerLink = `${siteOrigin()}/status?t=${encodeURIComponent(playerToken(r.id))}`;
  const actions = [
    ...(s === "application_received" ? [{ action: "accept", label: "Accept for Pathway Assessment", tone: "route" as const, confirm: "Accept and email the $249 payment invitation?" }, { action: "not_accept", label: "Not accepted at this stage", tone: "danger" as const, confirm: "Record 'not accepted' and email the applicant?" }] : []),
    ...(s === "accepted_for_assessment" ? [{ action: "resend_acceptance", label: "Resend acceptance email" }] : []),
    ...(r.paymentReceivedAt && !r.sufficientConfirmedAt && r.materials.length ? [
      { action: "start_materials_review", label: "Start materials review" },
      { action: "request_info", label: "Request additional information", fields: [{ key: "items", label: "What is missing (one item per line)", type: "textarea" as const, placeholder: "Recent playing history (last two seasons)\nOne full-match link, or tell us none exists" }] },
      { action: "confirm_sufficient", label: "Confirm materials sufficient", tone: "route" as const, confirm: "This starts the 7-day assessment period today and emails the start date. Confirm?" },
    ] : []),
    ...(s === "assessment_in_progress" ? [{ action: "assessment_ready", label: "Mark assessment ready", tone: "route" as const, fields: [{ key: "reportUrl", label: "Link to the assessment document (https, optional)", type: "url" as const }, { key: "bookingUrl", label: "Personal booking link (https, optional — otherwise NEXT_PUBLIC_BOOKING_URL)", type: "url" as const }] }] : []),
    ...(["assessment_ready", "call_to_be_scheduled"].includes(s) ? [{ action: "call_completed", label: "Mark call completed", tone: "route" as const }] : []),
    ...(r.callCompletedAt && !r.pathwayOfferedAt ? [{ action: "offer_pathway", label: "Offer European Pathway (email)", tone: "route" as const }] : []),
    { action: "note", label: "Add internal note", fields: [{ key: "text", label: "Note", type: "textarea" as const }] },
  ];
  return wrap(
    <div className="space-y-6">
      <Link href="/admin" className="text-[0.85rem] underline underline-offset-4">← All applications</Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow text-route">{r.id} · {STATE_LABEL[s]}</p><h1 className="display d-lg mt-2">{a.fullName}</h1><p className="mt-1 text-white/70">{a.footballCategory} · age {r.triage.age ?? "—"}{r.isMinor ? " · MINOR (guardian is contact & payer)" : ""} · {a.residence}</p></div>
        <div className="text-right text-[0.85rem] text-white/70"><p>7-day period: {d.started ? `started ${fmt(d.startDate)} · target ${fmt(d.targetDate)}` : `not started — ${d.reason}`}</p></div>
      </div>
      {r.duplicateOf?.length ? <p className="border-l-2 border-route pl-3 text-[0.9rem]">⚠ Same email as {r.duplicateOf.map((x) => <Link key={x} href={`/admin/applications/${x}`} className="mr-2 underline">{x}</Link>)}</p> : null}
      {p?.countryMismatch && <p className="border-l-2 border-alert pl-3 text-[0.9rem]">⚠ Declared country ({p.declaredCountry}) differs from billing country ({p.billingCountry}). Review the VAT treatment before invoicing.</p>}
      <Box title="Actions"><AdminActions id={r.id} actions={actions} /><p className="mt-4 text-[0.78rem] text-white/50">Payment status changes only through the verified Stripe webhook — never manually. Player’s private link (do not share publicly): <span className="break-all">{playerLink}</span></p></Box>
      <div className="grid gap-6 lg:grid-cols-2">
        <Box title="Player"><DL rows={[["Applicant", a.applicant], ["Date of birth", a.dateOfBirth], ["Nationality", a.nationality], ["Passports", a.passports], ["EU ancestry", a.ancestry], ["Residence", a.residence], ["Email", a.email], ["Phone / WhatsApp", a.whatsapp]]} />
          {a.guardian && <div className="mt-5 border-t border-white/10 pt-4"><DL rows={[["Guardian", a.guardian.name], ["Relationship", a.guardian.relationship], ["Guardian email", a.guardian.email], ["Guardian phone", a.guardian.phone], ["Guardian consent", a.guardian.consent]]} /></div>}</Box>
        <Box title="Football"><DL rows={[["Positions", a.positions], ["Foot", a.foot], ["Height", a.height], ["Club", a.currentClub], ["Level", a.level], ["Minutes last season", a.minutesLastSeason], ["History / previous clubs", a.previousClubs], ["National team", a.nationalTeam], ["Education", [a.education?.status, a.education?.college, a.education?.division, a.education?.eligibilityYears].filter(Boolean).join(" · ")], ["Contract", a.contractStatus], ["Contract ends", a.contractEnds], ["Offers", a.offers], ["Agent", a.hasAgent]]} /></Box>
        <Box title="Profile & goals"><DL rows={[["Full match", a.fullMatchUrl], ["Highlights", a.highlightsUrl], ["Transfermarkt", a.transfermarktUrl], ["Other profile", a.instagram], ["Objective", a.objective], ["Looking for", a.lookingFor], ["Target countries", a.targetCountries], ["Available from", a.availableFrom], ["Relocation", a.relocation]]} /></Box>
        <Box title="Consents & attribution"><DL rows={[...r.consents.map((c) => [c.key, `${fmt(c.at)} (v${c.version})`] as [string, unknown]), ["UTM source", r.attribution.last?.utm_source ?? r.attribution.first?.utm_source], ["UTM medium", r.attribution.last?.utm_medium], ["UTM campaign", r.attribution.last?.utm_campaign ?? r.attribution.first?.utm_campaign], ["UTM content", r.attribution.last?.utm_content], ["Referral", r.attribution.last?.ref ?? r.attribution.first?.ref], ["Landing", r.attribution.first?.landing], ["Campaign match", r.campaign], ["Triage hint", `${r.triage.route} — ${r.triage.reasons.join(" ")}`]]} /></Box>
        <Box title="Payment & tax evidence">{p ? <DL rows={[["Status", p.status], ["Paid at", fmt(p.paidAt)], ["Amount", p.amount ? `${p.amount / 100} ${p.currency?.toUpperCase()}` : undefined], ["Payer", `${p.payerName ?? ""} <${p.payerEmail ?? ""}>${p.isGuardianPayer ? " (guardian)" : ""}`], ["Buyer type", p.buyerType], ["Business", p.businessName], ["VAT number", p.vatId ? `${p.vatId} — ${p.vatIdChecked ? (p.vatIdValid ? "valid (VIES)" : "INVALID (VIES)") : "not checked"}` : undefined], ["Declared country", p.declaredCountry], ["Billing country (Stripe)", p.billingCountry], ["Card country (Stripe)", p.cardCountry], ["Request country", p.requestCountry], ["Tax treatment", p.taxCode], ["VAT included", p.vatAmount ? `$${(p.vatAmount / 100).toFixed(2)} (${(p.vatRate ?? 0) * 100}%)` : "none"], ["Early start requested", p.earlyStartRequested], ["Withdrawal period ends", fmt(p.withdrawalEndsAt)], ["Stripe session", p.checkoutSessionId], ["Payment intent", p.paymentIntentId], ["Invoice", p.invoiceId]]} /> : <p className="text-white/60">No checkout yet.</p>}
          {r.subscription && <div className="mt-5 border-t border-white/10 pt-4"><DL rows={[["Subscription", r.subscription.status], ["Started", fmt(r.subscription.startedAt)], ["Cancels at", fmt(r.subscription.cancelAt)], ["Last paid", fmt(r.subscription.lastInvoicePaidAt)], ["Last failed", fmt(r.subscription.lastPaymentFailedAt)]]} /></div>}
          {r.credit && <div className="mt-5 border-t border-white/10 pt-4"><DL rows={[["$150 credit", r.credit.usedAt ? `used ${fmt(r.credit.usedAt)}` : r.credit.voidedAt ? `void — ${r.credit.voidReason}` : `available until ${fmt(r.credit.expiresAt)}`]]} /></div>}</Box>
        <Box title={`Materials (${r.materials.length})`}>{r.materials.length ? r.materials.map((m, i) => (
          <details key={m.at} className="mb-3 border border-white/10 p-3" open={i === r.materials.length - 1}>
            <summary className="cursor-pointer font-semibold">Submission {i + 1} · {fmt(m.at)}</summary>
            <div className="mt-3"><DL rows={ONBOARDING.flatMap((sec) => sec.fields.filter((f) => f.type !== "checkbox" && f.type !== "file").map((f) => [f.label, m.notAvailable.includes(f.name) ? "Not available (player says it doesn’t exist)" : m.values[f.name] || "Not provided"] as [string, unknown]))} /></div>
            {m.files.length > 0 && <ul className="mt-3 space-y-1 text-[0.88rem]">{m.files.map((f) => <li key={f.key}><a href={`/api/admin/files?key=${encodeURIComponent(f.key)}`} className="text-route underline">{f.name}</a> <span className="text-white/50">({Math.round(f.size / 1024)} KB · {f.field})</span></li>)}</ul>}
            <p className="mt-2 text-[0.78rem] text-white/50">Health data consent: {m.healthConsent ? "given" : "not given (no injury data stored)"}</p>
          </details>
        )) : <p className="text-white/60">No materials yet.</p>}</Box>
        <Box title="Emails"><ul className="space-y-1 text-[0.85rem]">{r.emails.map((e, i) => <li key={i}><span className={e.ok ? "text-route" : "text-[#ff7a66]"}>{e.ok ? "✓" : "✗"}</span> {fmt(e.at)} · {e.template} → {e.to.join(", ") || "—"}{e.error ? ` · ${e.error}` : ""}</li>)}{!r.emails.length && <li className="text-white/60">None.</li>}</ul></Box>
        <Box title="Timeline & notes"><ul className="space-y-1 text-[0.85rem]">{r.timeline.map((t, i) => <li key={i}>{fmt(t.at)} · {t.type}{t.detail ? ` — ${t.detail}` : ""}</li>)}</ul>{r.notes.length > 0 && <ul className="mt-4 space-y-2 border-t border-white/10 pt-3 text-[0.88rem]">{r.notes.map((n, i) => <li key={i}><span className="text-white/50">{fmt(n.at)}</span> {n.text}</li>)}</ul>}</Box>
      </div>
    </div>
  );
}
