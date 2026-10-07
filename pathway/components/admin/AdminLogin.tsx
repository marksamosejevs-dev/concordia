"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) }).catch(() => null);
    const j = await r?.json().catch(() => ({}));
    setBusy(false);
    if (r?.ok) router.refresh(); else setErr(j?.error === "not_configured" ? "Admin access is not configured (PATHWAY_ADMIN_PASSWORD / PATHWAY_SECRET)." : j?.error === "too_many_attempts" ? "Too many failed attempts — try again in 15 minutes." : "Incorrect password.");
  };
  return (
    <form onSubmit={go} className="mx-auto max-w-md border border-white/15 bg-ink-deep p-8">
      <h1 className="display d-md">Concordia admin</h1>
      <label className="mt-6 block text-[0.92rem] font-semibold">Password<input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-2 block w-full border border-white/20 bg-ink px-4 py-3 text-white focus:border-route focus:outline-none" /></label>
      {err && <p role="alert" className="mt-3 text-[#ff7a66]">{err}</p>}
      <button disabled={busy} className="btn btn-route mt-6 w-full">{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}

export function AdminLogout() {
  const router = useRouter();
  return <button onClick={async () => { await fetch("/api/admin/login", { method: "DELETE" }); router.refresh(); }} className="text-[0.85rem] underline underline-offset-4">Sign out</button>;
}
