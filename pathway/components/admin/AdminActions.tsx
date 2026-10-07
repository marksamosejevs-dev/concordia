"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type A = { action: string; label: string; confirm?: string; tone?: "route" | "ghost" | "danger"; fields?: { key: string; label: string; type: "textarea" | "url"; placeholder?: string }[] };

/** Review actions for one application. Each posts to /api/admin/applications/:id; the server enforces the rules. */
export function AdminActions({ id, actions }: { id: string; actions: A[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const run = async (a: A) => {
    if (a.confirm && !window.confirm(a.confirm)) return;
    setBusy(true); setMsg(null);
    const body: Record<string, unknown> = { action: a.action };
    if (a.action === "request_info") body.items = (vals.items ?? "").split("\n");
    if (a.action === "assessment_ready") { body.reportUrl = vals.reportUrl; body.bookingUrl = vals.bookingUrl; }
    if (a.action === "note") body.text = vals.text;
    const r = await fetch(`/api/admin/applications/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const j = await r?.json().catch(() => ({}));
    setBusy(false);
    if (r?.ok) { setMsg({ ok: true, text: `Done.${j.emailed === true ? " Email sent." : j.emailed === false ? " ⚠ Email NOT sent — check the email log / configuration." : ""}` }); setOpen(null); setVals({}); router.refresh(); }
    else setMsg({ ok: false, text: j?.message ?? j?.error ?? "Action failed." });
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button key={a.action} disabled={busy} onClick={() => (a.fields ? setOpen(open === a.action ? null : a.action) : run(a))} className={`btn !min-h-[40px] !px-4 text-[0.85rem] ${a.tone === "route" ? "btn-route" : a.tone === "danger" ? "border border-[#ff7a66] text-[#ff7a66]" : "btn-ghost"}`}>{a.label}</button>
        ))}
      </div>
      {actions.filter((a) => a.fields && open === a.action).map((a) => (
        <div key={a.action} className="space-y-3 border border-white/15 p-4">
          {a.fields!.map((f) => (
            <label key={f.key} className="block text-[0.85rem] font-semibold">{f.label}
              {f.type === "textarea" ? <textarea rows={4} placeholder={f.placeholder} value={vals[f.key] ?? ""} onChange={(e) => setVals((x) => ({ ...x, [f.key]: e.target.value }))} className="mt-1 block w-full border border-white/20 bg-ink px-3 py-2 text-white" />
                : <input type="url" placeholder={f.placeholder} value={vals[f.key] ?? ""} onChange={(e) => setVals((x) => ({ ...x, [f.key]: e.target.value }))} className="mt-1 block w-full border border-white/20 bg-ink px-3 py-2 text-white" />}
            </label>
          ))}
          <button disabled={busy} onClick={() => run(a)} className="btn btn-route !min-h-[40px] !px-4 text-[0.85rem]">{busy ? "Working…" : `Confirm: ${a.label}`}</button>
        </div>
      ))}
      {msg && <p role="status" className={msg.ok ? "text-route" : "text-[#ff7a66]"}>{msg.text}</p>}
    </div>
  );
}
