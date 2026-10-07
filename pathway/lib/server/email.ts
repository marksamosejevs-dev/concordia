/**
 * TRANSACTIONAL EMAIL — Resend (https://resend.com) via its HTTPS API.
 * Never claims success unless the provider accepted the message. Every attempt is logged on the record.
 * Test-only "outbox" transport writes messages to storage (PATHWAY_ALLOW_TEST_TRANSPORTS=1, never on Netlify).
 */
import { env, TEST_TRANSPORTS } from "./env";
import { store } from "./store";

export interface Message { to: string[]; subject: string; html: string; text: string; replyTo?: string; tag?: string }
export interface SendResult { ok: boolean; id?: string; error?: string; transport: "resend" | "outbox" | "none" }

export async function sendEmail(m: Message): Promise<SendResult> {
  const to = [...new Set(m.to.map((x) => x.trim()).filter((x) => /^\S+@\S+\.\S+$/.test(x)))];
  if (!to.length) return { ok: false, error: "No valid recipient", transport: "none" };
  if (env.resendKey && env.emailFrom) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: env.emailFrom, to, subject: m.subject, html: m.html, text: m.text, reply_to: m.replyTo ?? env.emailReplyTo, tags: m.tag ? [{ name: "type", value: m.tag.replace(/[^a-z0-9_-]/gi, "_") }] : undefined }),
        signal: AbortSignal.timeout(10_000),
      });
      const j = (await r.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
      if (!r.ok || !j.id) { console.error(`[email] Resend rejected "${m.subject}": ${r.status} ${j.name ?? ""} ${j.message ?? ""}`); return { ok: false, error: `Resend ${r.status}: ${j.message ?? "error"}`, transport: "resend" }; }
      return { ok: true, id: j.id, transport: "resend" };
    } catch (e) { console.error(`[email] Resend request failed: ${String(e)}`); return { ok: false, error: String(e), transport: "resend" }; }
  }
  if (TEST_TRANSPORTS) {
    const id = `outbox-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await store().setJSON(`outbox/${id}`, { ...m, to, at: new Date().toISOString() });
    return { ok: true, id, transport: "outbox" };
  }
  console.error(`[email] NOT SENT — email provider not configured (RESEND_API_KEY / EMAIL_FROM): "${m.subject}"`);
  return { ok: false, error: "Email provider not configured", transport: "none" };
}

export const internalRecipients = () => (env.internalEmail ?? "").split(",").map((s) => s.trim()).filter(Boolean);
