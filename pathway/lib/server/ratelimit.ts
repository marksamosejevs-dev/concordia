/** Fixed-window failure counter in the persistent store — throttles admin password guessing across function instances. */
import { store } from "./store";

const WINDOW_MS = 15 * 60_000, MAX_FAILURES = 10;
type W = { start: number; count: number };

export async function loginBlocked(key: string): Promise<boolean> {
  const cur = await store().getJSON<W>(`ratelimit/admin/${key}`);
  return Boolean(cur && Date.now() - cur.data.start < WINDOW_MS && cur.data.count >= MAX_FAILURES);
}
export async function recordLoginFailure(key: string): Promise<void> {
  const k = `ratelimit/admin/${key}`;
  for (let i = 0; i < 3; i++) {
    const cur = await store().getJSON<W>(k);
    const fresh = !cur || Date.now() - cur.data.start >= WINDOW_MS;
    const next: W = fresh ? { start: Date.now(), count: 1 } : { start: cur!.data.start, count: cur!.data.count + 1 };
    if (await store().setJSON(k, next, cur ? { etag: cur.etag } : { onlyIfNew: true })) return;
  }
}
export async function clearLoginFailures(key: string): Promise<void> { await store().delete(`ratelimit/admin/${key}`).catch(() => {}); }
