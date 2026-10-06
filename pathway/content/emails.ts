/**
 * Applicant email templates — Pathway Assessment funnel (Round 3).
 * Rendered for review at /review/emails. Sending requires a transactional email provider
 * (integration pending) — nothing here is sent by the static site.
 * Placeholders: {name} {appId} {acceptLink} {onboardingLink} {missingItems} {startDate} {targetDate} {bookingLink} {pathwayLink}.
 */
import { ACCEPTED_MEANING, ASSESSMENT_INCLUDES, DELIVERY_FULL } from "./assessment";
import { ONBOARDING } from "./onboarding";

export interface EmailTemplate { key: string; trigger: string; subject: string; heading: string; body: string[]; list?: string[]; cta?: { label: string; href: string }; note?: string }

const checklist = ONBOARDING.flatMap((s) => s.fields.filter((f) => f.type !== "checkbox").map((f) => f.label));

export const EMAILS: EmailTemplate[] = [
  { key: "received", trigger: "Application submitted", subject: "We’ve received your application", heading: "Thanks — we’ve received your application.",
    body: ["Hi {name},", "Thanks — we’ve received your application. Our team will review your profile and let you know whether we can offer you a Pathway Assessment.", "No payment is taken to apply. Your reference is {appId}."] },
  { key: "accepted", trigger: "Team accepts the application", subject: "You’ve been accepted for a Pathway Assessment", heading: "You’ve been accepted for a Pathway Assessment.",
    body: ["Hi {name},", ACCEPTED_MEANING, "The Pathway Assessment is $249, paid once. It includes:"], list: ASSESSMENT_INCLUDES,
    cta: { label: "Pay $249 and start", href: "{acceptLink}" }, note: DELIVERY_FULL },
  { key: "not_accepted", trigger: "Team does not accept at this stage", subject: "Your Pathway Assessment application", heading: "We can’t offer you an assessment at this stage.",
    body: ["Hi {name},", "Thank you for applying. Based on what you’ve shared, we don’t think a Pathway Assessment is the right step for you right now — and we’d rather say so than take your money.", "You’re welcome to apply again when your situation changes."] },
  { key: "onboarding", trigger: "Payment confirmed (sent immediately)", subject: "We’re ready to start your Pathway Assessment", heading: "We’re ready to start your Pathway Assessment.",
    body: ["Hi {name},", "Thanks — your payment is confirmed. Please send us your football profile and materials now. Links are best for video (YouTube, Vimeo, Google Drive); please don’t send raw video files.", "If something doesn’t exist — no Transfermarkt profile, no highlight video, no current club — just say so. It isn’t a problem in itself.", "We’ll ask for:"], list: checklist,
    cta: { label: "Send your profile + materials", href: "{onboardingLink}" }, note: DELIVERY_FULL },
  { key: "materials", trigger: "Onboarding submitted", subject: "We’ve received your materials", heading: "Thanks — we’ve received your materials.",
    body: ["Hi {name},", "Thanks — we’ve received your materials. Our team will review them to confirm whether we have the information reasonably required to begin your Pathway Assessment.", "We’ll email you either to confirm your assessment has started, or to ask for anything we still need."] },
  { key: "additional_info", trigger: "Team: materials not yet sufficient", subject: "A little more information for your Pathway Assessment", heading: "We need some additional information.",
    body: ["Hi {name},", "We’ve reviewed your submission and need some additional information before we can begin your Pathway Assessment:", "{missingItems}", "Your 7-day assessment period begins once we’ve received these and confirmed your materials are sufficient."],
    cta: { label: "Send the missing information", href: "{onboardingLink}" } },
  { key: "in_progress", trigger: "Team: materials sufficient + payment confirmed", subject: "Your Pathway Assessment has started", heading: "Your Pathway Assessment is in progress.",
    body: ["Hi {name},", "We have the information required to begin your Pathway Assessment.", "Assessment start date: {startDate}", "Target completion: within 7 days — by {targetDate}."] },
  { key: "ready", trigger: "Assessment completed", subject: "Your Pathway Assessment is ready", heading: "Your Pathway Assessment is ready.",
    body: ["Hi {name},", "Your Pathway Assessment is ready. The next step is your included consultation call of up to 60 minutes, where we explain our assessment, realistic options, possible markets and recommended next steps. Parents and guardians are welcome."] },
  { key: "booking", trigger: "Call booking invitation", subject: "Book your 60-minute consultation", heading: "Book your consultation call.",
    body: ["Hi {name},", "Choose a time for your consultation call of up to 60 minutes.", "The call is advisory: it doesn’t promise a club, a trial, representation, an offer, a contract or a transfer, and it doesn’t create a representation relationship."],
    cta: { label: "Book your call", href: "{bookingLink}" } },
  { key: "next_steps", trigger: "After the call", subject: "Your next steps", heading: "Your next steps.",
    body: ["Hi {name},", "Thanks for your time on the call. The decision is yours.", "If it makes sense to continue, European Pathway is $399 per month — designed as a 6-month European career pathway, paid monthly, with no six-month upfront payment. Cancellation options are available; subscription terms apply.", "Any football-agent representation by Concordia Sports Agency would be a separate agreement under the applicable rules — it isn’t created by the assessment, the call or a European Pathway subscription."],
    cta: { label: "About European Pathway", href: "{pathwayLink}" } },
];
