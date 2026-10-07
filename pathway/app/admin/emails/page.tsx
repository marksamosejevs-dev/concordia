import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/server/admin";
import { AdminLogin } from "@/components/admin/AdminLogin";
import * as T from "@/lib/server/templates";
import type { ApplicationRecord } from "@/lib/server/records";

export const metadata: Metadata = { title: "Email templates — admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Live previews of every transactional email, rendered with a fictional sample application. */
export default async function EmailsPage() {
  const wrap = (c: React.ReactNode) => <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2rem)]"><div className="wrap">{c}</div></section>;
  if (!(await isAdmin())) return wrap(<AdminLogin />);
  const now = "2026-10-01T09:00:00.000Z", later = "2026-10-08T09:00:00.000Z"; // fixed sample dates
  const r = {
    id: "CS-1001", createdAt: now, updatedAt: now, isMinor: false, campaign: undefined,
    data: { applicant: "player", fullName: "Sample Player", footballCategory: "Men’s football", dateOfBirth: "2004-05-01", nationality: "United States", residence: "United States", email: "player@example.com", positions: ["Central midfield"], level: "College", contractStatus: "Amateur / college registration", hasAgent: "No", passports: ["United States"], objective: "Europe specifically", targetCountries: ["Poland"], consents: { terms: true, assessmentData: true, agencyView: false, marketing: false } },
    triage: { route: "accepted", age: 22, reasons: [] }, attribution: {}, contact: { name: "Sample Player", firstName: "Sample", emails: ["player@example.com"] },
    consents: [], materials: [], notes: [], emails: [], timeline: [], credit: { amountCents: 15000, expiresAt: later }, reportUrl: "https://example.com/assessment",
    payment: { status: "paid", earlyStartRequested: true },
  } as unknown as ApplicationRecord;
  const link = "https://example.com/status?t=…";
  const list = [
    ["Application received", T.applicantReceived(r, link)], ["Accepted", T.applicantAccepted(r, link)], ["Not accepted", T.applicantNotAccepted(r)],
    ["Payment received + materials request", T.applicantPaymentReceived(r, link)], ["Materials received", T.applicantMaterialsReceived(r, link)],
    ["Additional information required", T.applicantAdditionalInfo(r, ["Recent playing history (last two seasons)"], link)], ["Assessment started", T.applicantStarted(r, now, later)],
    ["Assessment ready + booking", T.applicantReady(r, link, "https://example.com/book")], ["European Pathway offer", T.applicantPathwayOffer(r, link, later)],
    ["Subscription started", T.applicantSubscriptionStarted(r, link)], ["Renewal failed", T.applicantRenewalFailed(r, link)], ["Subscription ended", T.applicantSubscriptionEnded(r)],
    ["INTERNAL · new application", T.internalApplication(r, link, ["team@example.com"])],
  ] as const;
  return wrap(
    <div>
      <Link href="/admin" className="text-[0.85rem] underline underline-offset-4">← Admin</Link>
      <h1 className="display d-lg mt-4">Email templates</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">{list.map(([name, m]) => (
        <div key={name}><p className="font-semibold">{name}</p><p className="text-[0.82rem] text-white/60">Subject: {m.subject}</p><iframe title={name} srcDoc={m.html} className="mt-2 h-[520px] w-full rounded-[8px] bg-white" sandbox="" /></div>
      ))}</div>
    </div>
  );
}
