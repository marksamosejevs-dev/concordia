/**
 * Applicant email templates — Pathway Assessment funnel (Round 3).
 * Rendered for review at /review/emails. Sending requires a transactional email provider
 * (integration pending) — nothing here is sent by the static site.
 * Placeholders: {name} {appId} {acceptLink} {onboardingLink} {dueDate} {bookingLink}.
 */
import { ACCEPTED_MEANING, ASSESSMENT_INCLUDES, DELIVERY } from "./assessment";
import { ONBOARDING } from "./onboarding";

export interface EmailTemplate { key: string; trigger: string; subject: string; heading: string; body: string[]; list?: string[]; cta?: { label: string; href: string }; note?: string }

const checklist = ONBOARDING.flatMap((s) => s.fields.filter((f) => f.type !== "checkbox").map((f) => f.label));

export const EMAILS: EmailTemplate[] = [
  { key: "received", trigger: "Application submitted", subject: "We’ve received your application", heading: "Thanks — we’ve received your application.",
    body: ["Hi {name},", "Our team will review your profile and let you know whether we can offer you a Pathway Assessment.", "No payment is taken to apply. Your reference is {appId}."] },
  { key: "accepted", trigger: "Team accepts the application", subject: "You’ve been accepted for a Pathway Assessment", heading: "You’ve been accepted for a Pathway Assessment.",
    body: ["Hi {name},", ACCEPTED_MEANING, "The Pathway Assessment is $249, paid once. It includes:"], list: ASSESSMENT_INCLUDES,
    cta: { label: "Pay $249 and start", href: "{acceptLink}" }, note: DELIVERY },
  { key: "not_accepted", trigger: "Team does not accept at this stage", subject: "Your Pathway Assessment application", heading: "We can’t offer you an assessment at this stage.",
    body: ["Hi {name},", "Thank you for applying. Based on what you’ve shared, we don’t think a Pathway Assessment is the right step for you right now — and we’d rather say so than take your money.", "You’re welcome to apply again when your situation changes."] },
  { key: "onboarding", trigger: "Payment confirmed (sent immediately)", subject: "We’re ready to start your Pathway Assessment", heading: "We’re ready to start your Pathway Assessment.",
    body: ["Hi {name},", "Thanks for your payment. To start, please send us your football profile, CV and video — links are best for video (YouTube, Vimeo, Google Drive). Please don’t send raw video files.", "We’ll ask for:"], list: checklist,
    cta: { label: "Send your profile + video", href: "{onboardingLink}" }, note: DELIVERY },
  { key: "materials", trigger: "Onboarding submitted", subject: "Materials received — your assessment has started", heading: "Materials received. Your assessment has started.",
    body: ["Hi {name},", "Thanks — we have your materials and your Pathway Assessment is under way.", "We aim to have it ready by {dueDate}. If anything essential is missing, we’ll tell you straight away — the 7-day period starts once we have it."] },
  { key: "ready", trigger: "Assessment completed", subject: "Your Pathway Assessment is ready — book your call", heading: "Your Pathway Assessment is ready.",
    body: ["Hi {name},", "Your assessment is ready. Book your included 60-minute call — we’ll explain our assessment, realistic options, possible markets and recommended next steps. Parents and guardians are welcome.", "The call is advisory: it doesn’t promise a club, a trial, representation, an offer, a contract or a transfer."],
    cta: { label: "Book your 60-minute call", href: "{bookingLink}" } },
];
