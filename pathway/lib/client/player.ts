"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { PlayerView } from "@/lib/server/view";

export type { PlayerView };
const noop = () => () => {};
/** The signed link (?t=…) — read after hydration only, so server and client render the same first frame. */
export function useUrlParam(name: string): string | null | undefined {
  return useSyncExternalStore(noop, () => { try { return new URLSearchParams(window.location.search).get(name); } catch { return null; } }, () => undefined);
}
export const tokenFromUrl = () => { try { return new URLSearchParams(window.location.search).get("t"); } catch { return null; } };
export const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—");

/** Loads the signed-link view from the server (the source of truth). */
export function usePlayerView() {
  const token = useUrlParam("t");
  const [nonce, setNonce] = useState(0);
  const [res, setRes] = useState<{ key: string; view: PlayerView | null; state: "ok" | "invalid" | "error" } | null>(null);
  useEffect(() => {
    if (!token) return;
    let alive = true;
    const key = `${token}#${nonce}`;
    fetch(`/api/status?t=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (r) => { const j = await r.json().catch(() => ({})); if (alive) setRes(r.ok && j.ok ? { key, view: j.view, state: "ok" } : { key, view: null, state: r.status === 404 ? "invalid" : "error" }); })
      .catch(() => { if (alive) setRes({ key, view: null, state: "error" }); });
    return () => { alive = false; };
  }, [token, nonce]);
  const current = res && res.key === `${token}#${nonce}` ? res : null;
  const state = token === undefined ? "loading" : token === null ? "invalid" : current?.state ?? "loading";
  return { token: token ?? null, view: current?.view ?? null, state, reload: () => setNonce((n) => n + 1) };
}
