import { creditUsable } from "@/lib/credit";
/** What a player/parent may see through their signed link — never internal notes, triage or other applicants. */
import type { ApplicationRecord } from "./records";
import { currentState, assessmentDeadline, STATE_LABEL } from "../assessment-status";
import { env } from "./env";
import { withdrawalOpen } from "./withdrawal";

export function playerView(r: ApplicationRecord) {
  const now = new Date().toISOString();
  const state = currentState(r, now);
  const d = assessmentDeadline(r, now);
  const credit = creditUsable(r.credit, now) ? { amount: r.credit!.amountCents / 100, expiresAt: r.credit!.expiresAt ?? null } : null;
  return {
    id: r.id, state, label: STATE_LABEL[state], firstName: r.contact.firstName, playerName: r.data.fullName, isMinor: r.isMinor,
    guardianName: r.data.guardian?.name, payerEmail: r.contact.emails[0], residence: r.data.residence,
    accepted: Boolean(r.acceptedAt), notAccepted: Boolean(r.notAcceptedAt),
    paymentStatus: r.payment?.status ?? null, paid: r.payment?.status === "paid" && Boolean(r.paymentReceivedAt),
    earlyStartRequested: r.payment?.earlyStartRequested, withdrawalEndsAt: r.payment?.withdrawalEndsAt,
    /** performance not yet permitted → the customer may ask us to start now */
    canRequestEarlyStart: Boolean(r.paymentReceivedAt && !r.withdrawnAt && r.performancePermittedAt && r.performancePermittedAt > now),
    performancePermittedAt: r.performancePermittedAt,
    withdraw: { assessment: withdrawalOpen(r, "assessment", now), pathway: withdrawalOpen(r, "pathway", now) },
    withdrawals: (r.withdrawals ?? []).map((w) => ({ contract: w.contract, at: w.at })),
    materialsCount: r.materials.length, lastMaterialsAt: r.materialsSubmittedAt,
    additionalInfoItems: state === "additional_information_required" ? r.additionalInfoItems ?? [] : [],
    deadline: d.started ? { startDate: d.startDate, targetDate: d.targetDate } : null,
    reportUrl: r.assessmentReadyAt ? r.reportUrl : undefined,
    bookingUrl: r.assessmentReadyAt ? r.bookingUrl ?? env.bookingUrl : undefined,
    pathwayOffered: Boolean(r.pathwayOfferedAt), credit,
    subscription: r.subscription ? { status: r.subscription.status, cancelAt: r.subscription.cancelAt, manageable: Boolean(r.subscription.customerId || r.payment?.customerId) && Boolean(r.subscription.subscriptionId) } : null,
    prefill: r.paymentReceivedAt ? {
      full_name: r.data.fullName, football_category: r.data.footballCategory ?? "", dob: r.data.dateOfBirth, nationalities: r.data.nationality, passports: r.data.passports.join(", "), current_country: r.data.residence,
      positions: r.data.positions.join(", "), preferred_foot: r.data.foot ?? "", height: r.data.height ?? "", current_club: r.data.currentClub ?? "", previous_clubs: r.data.previousClubs ?? "",
      international_experience: r.data.nationalTeam ?? "", transfermarkt_url: r.data.transfermarktUrl ?? "", highlights_url: r.data.highlightsUrl ?? "", full_match_urls: r.data.fullMatchUrl ?? "",
      target_countries: r.data.targetCountries.join(", "), has_agent: r.data.hasAgent === "Yes" ? "Yes — currently represented" : r.data.hasAgent === "No" ? "No" : "",
    } : undefined,
  };
}
export type PlayerView = ReturnType<typeof playerView>;
