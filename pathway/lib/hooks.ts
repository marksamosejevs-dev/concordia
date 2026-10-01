"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};
/** true only after hydration — lets client-only data (browser storage) render without hydration mismatch. */
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia("(prefers-reduced-motion: reduce)"); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Tiny session-storage-backed store usable with useSyncExternalStore. */
export function createSessionStore<T extends string>(key: string, fallback: T, allowed: readonly T[]) {
  const listeners = new Set<() => void>();
  const get = (): T => { try { const v = sessionStorage.getItem(key) as T | null; return v && allowed.includes(v) ? v : fallback; } catch { return fallback; } };
  const set = (v: T) => { try { sessionStorage.setItem(key, v); } catch {} listeners.forEach((l) => l()); };
  const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
  const use = () => useSyncExternalStore(subscribe, get, () => fallback);
  return { use, set };
}
