/**
 * PERSISTENCE — application records, materials files, processed webhook events, email outbox (tests).
 * Production: Netlify Blobs, site-wide store "pathway", EU region (eu-central-1), strong consistency.
 * Local tests only: JSON/binary files under .data/ (requires PATHWAY_ALLOW_TEST_TRANSPORTS=1, never on Netlify).
 */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import { ON_NETLIFY, TEST_TRANSPORTS } from "./env";

export class StorageUnavailable extends Error { constructor() { super("Persistent storage is not available in this environment."); } }

export interface Versioned<T> { data: T; etag: string }
export interface KV {
  getJSON<T>(key: string): Promise<Versioned<T> | null>;
  /** onlyIfNew → create only; etag → replace only if unchanged. Returns false when the condition failed. */
  setJSON(key: string, value: unknown, cond?: { onlyIfNew?: boolean; etag?: string }): Promise<boolean>;
  setBinary(key: string, data: ArrayBuffer, meta: Record<string, string>): Promise<void>;
  getBinary(key: string): Promise<{ data: ArrayBuffer; meta: Record<string, string> } | null>;
  list(prefix: string): Promise<string[]>;
  delete(key: string): Promise<void>;
}

function blobsKV(): KV {
  const store = getStore({ name: "pathway", consistency: "strong", region: "eu-central-1" });
  return {
    async getJSON<T>(key: string) {
      const r = await store.getWithMetadata(key, { type: "json" });
      return r ? { data: r.data as T, etag: r.etag ?? "" } : null;
    },
    async setJSON(key, value, cond) {
      const opts = cond?.onlyIfNew ? { onlyIfNew: true as const } : cond?.etag ? { onlyIfMatch: cond.etag } : {};
      const r = await store.setJSON(key, value, opts);
      return r.modified;
    },
    async setBinary(key, data, meta) { await store.set(key, data, { metadata: meta }); },
    async getBinary(key) {
      const r = await store.getWithMetadata(key, { type: "arrayBuffer" });
      return r ? { data: r.data, meta: (r.metadata ?? {}) as Record<string, string> } : null;
    },
    async list(prefix) { const { blobs } = await store.list({ prefix }); return blobs.map((b) => b.key); },
    async delete(key) { await store.delete(key); },
  };
}

const locks = new Map<string, Promise<unknown>>();
function withLock<T>(k: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(k) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  locks.set(k, next.catch(() => {}));
  return next;
}

function fileKV(root: string): KV {
  const p = (key: string) => path.join(root, ...key.split("/").map((s) => encodeURIComponent(s)));
  const tag = (s: string) => crypto.createHash("sha1").update(s).digest("hex");
  return {
    async getJSON<T>(key: string) {
      try { const s = await fs.readFile(p(key), "utf8"); return { data: JSON.parse(s) as T, etag: tag(s) }; } catch { return null; }
    },
    async setJSON(key, value, cond) {
      const file = p(key); await fs.mkdir(path.dirname(file), { recursive: true });
      const s = JSON.stringify(value);
      if (cond?.onlyIfNew) { try { await fs.writeFile(file, s, { flag: "wx" }); return true; } catch { return false; } }
      // Check-and-write under a per-key lock, written atomically (temp file + rename), like Blobs' onlyIfMatch.
      return withLock(file, async () => {
        if (cond?.etag) { try { if (tag(await fs.readFile(file, "utf8")) !== cond.etag) return false; } catch { return false; } }
        const tmp = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`;
        await fs.writeFile(tmp, s); await fs.rename(tmp, file); return true;
      });
    },
    async setBinary(key, data, meta) {
      const file = p(key); await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, Buffer.from(data)); await fs.writeFile(file + ".meta.json", JSON.stringify(meta));
    },
    async getBinary(key) {
      try { const b = await fs.readFile(p(key)); const meta = JSON.parse(await fs.readFile(p(key) + ".meta.json", "utf8")); return { data: b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer, meta }; } catch { return null; }
    },
    async list(prefix) {
      const parts = prefix.split("/").filter(Boolean);
      const dir = path.join(root, ...parts.map((s) => encodeURIComponent(s)));
      try { return (await fs.readdir(dir)).filter((f) => !f.endsWith(".meta.json") && !f.endsWith(".tmp")).map((f) => `${parts.join("/")}/${decodeURIComponent(f)}`); } catch { return []; }
    },
    async delete(key) { await fs.rm(p(key), { force: true }); await fs.rm(p(key) + ".meta.json", { force: true }); },
  };
}

let kv: KV | null = null;
export function store(): KV {
  if (kv) return kv;
  if (ON_NETLIFY) return (kv = blobsKV());
  if (TEST_TRANSPORTS) return (kv = fileKV(path.join(process.cwd(), ".data")));
  throw new StorageUnavailable();
}

/** Read-modify-write with optimistic concurrency (retries on conflicting writes). */
export async function update<T>(key: string, fn: (cur: T) => T | Promise<T>, tries = 8): Promise<T> {
  for (let i = 0; i < tries; i++) {
    const cur = await store().getJSON<T>(key);
    if (!cur) throw new Error(`Not found: ${key}`);
    const next = await fn(structuredClone(cur.data));
    if (await store().setJSON(key, next, { etag: cur.etag })) return next;
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 60 * (i + 1)));
  }
  throw new Error(`Concurrent update conflict: ${key}`);
}
