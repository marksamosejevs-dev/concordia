import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/server/admin";
import { listApplications, stateOf, deadlineOf, type ApplicationRecord } from "@/lib/server/records";
import { configStatus } from "@/lib/server/env";
import { STATE_LABEL } from "@/lib/assessment-status";
import { AdminLogin, AdminLogout } from "@/components/admin/AdminLogin";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const FILTERS: Record<string, { label: string; test: (r: ApplicationRecord) => boolean }> = {
  all: { label: "All", test: () => true },
  decide: { label: "Needs decision", test: (r) => stateOf(r) === "application_received" },
  payment: { label: "Awaiting payment", test: (r) => stateOf(r) === "accepted_for_assessment" },
  materials: { label: "Materials to check", test: (r) => ["materials_requested", "materials_submitted", "materials_under_review", "additional_information_required"].includes(stateOf(r)) },
  progress: { label: "Assessment in progress", test: (r) => stateOf(r) === "assessment_in_progress" },
  call: { label: "Ready / call", test: (r) => ["assessment_ready", "call_to_be_scheduled"].includes(stateOf(r)) },
  closed: { label: "Next steps / not accepted", test: (r) => ["next_steps", "call_completed", "not_accepted"].includes(stateOf(r)) },
};
const fmt = (s?: string) => (s ? new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const wrap = (c: React.ReactNode) => <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2rem)]"><div className="wrap">{c}</div></section>;
  if (!(await isAdmin())) return wrap(<AdminLogin />);
  const f = (await searchParams).f ?? "all";
  const cfg = configStatus();
  let apps: ApplicationRecord[] = [], loadError = "";
  try { apps = await listApplications(); } catch (e) { loadError = e instanceof Error ? e.message : "Storage error"; }
  const shown = apps.filter((FILTERS[f] ?? FILTERS.all).test);
  return wrap(
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow text-route">Concordia admin</p><h1 className="display d-lg mt-2">Applications</h1></div>
        <div className="flex gap-4"><Link href="/admin/emails" className="text-[0.85rem] underline underline-offset-4">Email templates</Link><AdminLogout /></div>
      </div>
      <details className="mt-6 border border-white/15 p-4">
        <summary className="cursor-pointer font-semibold">System configuration {Object.values(cfg).every((x) => x.ok) ? "· all set" : `· ${Object.values(cfg).filter((x) => !x.ok).length} item(s) need setup`}</summary>
        <ul className="mt-3 grid gap-1 text-[0.85rem] sm:grid-cols-2">{Object.entries(cfg).map(([k, v]) => <li key={k}><span className={v.ok ? "text-route" : "text-[#ff7a66]"}>{v.ok ? "✓" : "✗"}</span> {k}: {v.detail}</li>)}</ul>
      </details>
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filter">{Object.entries(FILTERS).map(([k, v]) => <Link key={k} href={`/admin?f=${k}`} className={`rounded-full px-3 py-1.5 text-[0.82rem] ${f === k ? "bg-route font-bold text-ink" : "border border-white/20"}`}>{v.label} ({apps.filter(v.test).length})</Link>)}</nav>
      {loadError && <p role="alert" className="mt-6 text-[#ff7a66]">Could not load applications: {loadError}</p>}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[0.88rem]">
          <thead className="text-white/55"><tr><th className="py-2">ID</th><th>Player</th><th>Age</th><th>Received</th><th>Status</th><th>Flags</th></tr></thead>
          <tbody>
            {shown.map((r) => { const d = deadlineOf(r); return (
              <tr key={r.id} className="border-t border-white/10">
                <td className="py-3"><Link href={`/admin/applications/${r.id}`} className="font-semibold text-route underline underline-offset-4">{r.id}</Link></td>
                <td>{r.data.fullName}<span className="block text-[0.78rem] text-white/50">{r.data.footballCategory} · {r.data.residence}</span></td>
                <td>{r.triage.age ?? "—"}{r.isMinor ? " (minor)" : ""}</td>
                <td>{fmt(r.createdAt)}</td>
                <td>{STATE_LABEL[stateOf(r)]}{d.started && <span className="block text-[0.78rem] text-white/60">Target {fmt(d.targetDate)}</span>}</td>
                <td className="text-[0.78rem] text-white/70">{[r.duplicateOf?.length ? "duplicate?" : "", r.payment?.countryMismatch ? "country mismatch" : "", r.payment?.earlyStartRequested === false ? "no early start" : "", r.emails.some((e) => !e.ok) ? "email failed" : "", r.payment?.status === "disputed" ? "DISPUTE" : ""].filter(Boolean).join(" · ")}</td>
              </tr>
            ); })}
            {!shown.length && <tr><td colSpan={6} className="py-8 text-white/60">No applications here.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
