"use client";
/**
 * Application destination adapter. Configure NEXT_PUBLIC_APPLICATION_ENDPOINT to POST
 * submissions to a CRM/webhook/form backend. Without it (review build) the submission is
 * kept only in this browser so the flow can be tested end to end.
 * When the final stack is chosen, move delivery behind a server route to keep secrets server-side.
 */
import type { ApplicationSubmission } from "./schema";

const endpoint = process.env.NEXT_PUBLIC_APPLICATION_ENDPOINT;

export async function deliverApplication(sub: ApplicationSubmission): Promise<{ ok: boolean; mode: "remote" | "local" }> {
  if (endpoint) {
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sub) });
    return { ok: res.ok, mode: "remote" };
  }
  try { sessionStorage.setItem("cs_last_application", JSON.stringify(sub)); } catch {}
  return { ok: true, mode: "local" };
}

export function lastApplication(): ApplicationSubmission | null {
  try { return JSON.parse(sessionStorage.getItem("cs_last_application") || "null"); } catch { return null; }
}
