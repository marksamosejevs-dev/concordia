"use client";
/**
 * Application delivery.
 * 1) NEXT_PUBLIC_APPLICATION_ENDPOINT set → POST JSON there (CRM / webhook).
 * 2) Otherwise → Netlify Forms ("pathway-application"), emailed to the address configured in Netlify.
 * The submission is also kept in this browser so the applicant's own flow can continue.
 * A failed delivery returns ok:false — the UI must not show "received".
 */
import type { ApplicationSubmission } from "./schema";
import { submitNetlifyForm } from "../forms/netlify";
import { FORM_NAMES } from "@/content/onboarding";

const endpoint = process.env.NEXT_PUBLIC_APPLICATION_ENDPOINT;
const KEY = "cs_last_application";

export function applicationSummary(s: ApplicationSubmission): string {
  const d = s.data;
  const L = (k: string, v?: string | string[] | null) => `${k}: ${Array.isArray(v) ? v.join(", ") || "—" : v || "—"}`;
  return [
    "APPLICATION — PATHWAY ASSESSMENT", L("Application ID", s.id), L("Submitted", s.submittedAt), "",
    ...(s.duplicateOf ? [`⚠ POSSIBLE DUPLICATE of ${s.duplicateOf} (same email, same device)`, ""] : []),
    "PLAYER", L("Name", d.fullName), L("Football", d.footballCategory), L("DOB", d.dateOfBirth), L("Nationality", d.nationality), L("Residence", d.residence), L("Email", d.email), L("WhatsApp", d.whatsapp),
    ...(d.guardian ? ["", "PARENT / GUARDIAN", L("Name", d.guardian.name), L("Relationship", d.guardian.relationship), L("Email", d.guardian.email)] : []),
    "", "FOOTBALL", L("Positions", d.positions), L("Level", d.level), L("Current club", d.currentClub), L("Previous clubs", d.previousClubs), L("National team", d.nationalTeam), L("Contract", d.contractStatus), L("Contract ends", d.contractEnds), L("Agent", d.hasAgent),
    "", "VIDEO / PROFILES", L("Full match", d.fullMatchUrl), L("Highlights", d.highlightsUrl), L("Transfermarkt", d.transfermarktUrl),
    "", "GOALS", L("Objective", d.objective), L("Target countries", d.targetCountries), L("Passports", d.passports),
    "", "INTERNAL", L("Rules-based triage suggestion (not a decision)", s.triage.route), L("Notes", s.triage.reasons), L("Campaign", s.campaign ?? s.attribution.last?.utm_campaign), L("Source", [s.attribution.first?.utm_source, s.attribution.last?.utm_source].filter(Boolean).join(" → ")), L("Variant", s.attribution.last?.utm_content), L("Referral", s.attribution.last?.ref ?? s.attribution.first?.ref),
  ].join("\n");
}

export async function deliverApplication(sub: ApplicationSubmission): Promise<{ ok: boolean; mode: "remote" | "netlify"; error?: string }> {
  let ok = false, error: string | undefined, mode: "remote" | "netlify" = "netlify";
  if (endpoint) {
    mode = "remote";
    try { const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sub) }); ok = res.ok; if (!ok) error = `HTTP ${res.status}`; } catch (e) { error = String(e); }
  } else {
    const r = await submitNetlifyForm(FORM_NAMES.application, {
      subject: `APPLICATION — ${sub.data.fullName} (${sub.id})${sub.duplicateOf ? " (POSSIBLE DUPLICATE)" : ""}`, football_category: sub.data.footballCategory ?? "", campaign: sub.campaign ?? "", duplicate_of: sub.duplicateOf ?? "", application_id: sub.id, player_name: sub.data.fullName, email: sub.data.guardian?.email || sub.data.email,
      date_of_birth: sub.data.dateOfBirth, applicant: sub.data.applicant, submitted_at: sub.submittedAt, internal_triage: sub.triage.route, summary: applicationSummary(sub), data_json: JSON.stringify(sub),
    });
    ok = r.ok; error = r.error;
  }
  if (ok) { try { sessionStorage.setItem(KEY, JSON.stringify(sub)); localStorage.setItem(KEY, JSON.stringify(sub)); } catch {} }
  return { ok, mode, error };
}

export function lastApplication(): ApplicationSubmission | null {
  try { return JSON.parse(sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || "null"); } catch { return null; }
}
