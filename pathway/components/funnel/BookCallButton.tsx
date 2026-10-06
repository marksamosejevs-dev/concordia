"use client";
import { BOOKING_URL } from "@/lib/funnel";

/** Booking uses NEXT_PUBLIC_BOOKING_URL (e.g. a Calendly / Cal.com link). Without it, the link is sent by email. */
export function BookCallButton() {
  if (BOOKING_URL) return <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-route">Book your 60-minute call <span className="arrow" aria-hidden>→</span></a>;
  return <p className="rounded-[8px] border border-white/15 px-4 py-3 text-[0.92rem] text-white/80">Your booking link arrives by email as soon as your assessment is ready.</p>;
}
