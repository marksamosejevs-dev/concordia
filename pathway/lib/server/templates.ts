/**
 * EMAIL TEMPLATES — applicant/parent emails and internal Concordia notifications.
 * All transactional copy lives here (previewed at /admin/emails). Plain, premium, no promises of outcomes.
 */
import type { ApplicationRecord, MaterialsSubmission } from "./records";
import type { Message } from "./email";
import { ACCEPTED_MEANING, ASSESSMENT_INCLUDES, DELIVERY_FULL } from "../../content/assessment";
import { STATE_LABEL, currentState } from "../assessment-status";
import { ONBOARDING, NOT_AVAILABLE } from "../../content/onboarding";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "—");
const SIGN = ["Concordia Soccer", "European Pathway", "A project by Concordia Sports Agency"];
const FOOT = "Concordia Sports Agency SIA · Reg. No. 40203574668 · Krišjāņa Valdemāra iela 33A–4A, Rīga, LV-1010, Latvia";

interface Block { p?: string; list?: string[]; cta?: { label: string; href: string }; small?: string }
function render(subject: string, blocks: Block[], opts: { tag: string; to: string[]; internal?: boolean }): Message {
  const html = `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#0D1B36">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:#0D1B36;padding:18px 28px;color:#ffffff;font-weight:bold;letter-spacing:2px;font-size:14px">CONCORDIA SOCCER <span style="color:#FFD23F">·</span> EUROPEAN PATHWAY</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6">
${blocks.map((b) => b.p !== undefined ? `<p style="margin:0 0 14px">${esc(b.p).replace(/\n/g, "<br>")}</p>` : b.list ? `<ul style="margin:0 0 14px;padding-left:20px">${b.list.map((l) => `<li style="margin:0 0 4px">${esc(l)}</li>`).join("")}</ul>` : b.cta ? `<p style="margin:22px 0"><a href="${esc(b.cta.href)}" style="background:#FFD23F;color:#0D1B36;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:6px;display:inline-block">${esc(b.cta.label)}</a></p>` : b.small ? `<p style="margin:0 0 12px;font-size:13px;color:#5E6878">${esc(b.small)}</p>` : "").join("\n")}
${opts.internal ? "" : `<p style="margin:22px 0 0">${SIGN.map(esc).join("<br>")}</p>`}
</td></tr>
<tr><td style="padding:16px 28px;background:#f4f5f7;font-size:11px;color:#5E6878">${esc(FOOT)}</td></tr>
</table></td></tr></table></body></html>`;
  const text = [...blocks.map((b) => b.p ?? (b.list ? b.list.map((l) => `- ${l}`).join("\n") : b.cta ? `${b.cta.label}: ${b.cta.href}` : b.small ?? "")), "", ...(opts.internal ? [] : SIGN), "", FOOT].join("\n\n");
  return { to: opts.to, subject, html, text, tag: opts.tag };
}

const hi = (r: ApplicationRecord) => ({ p: `Hi ${r.contact.firstName},` });

/* ───────────── Applicant / parent emails ───────────── */

export const applicantReceived = (r: ApplicationRecord, statusLink: string) => render("We received your European Pathway application", [
  hi(r),
  { p: "Thank you for applying for a Concordia European Pathway Assessment." },
  { p: "We have received your application and our team will review your profile." },
  { p: "Applying is free and no payment has been taken." },
  { p: "If we believe a Pathway Assessment is appropriate for your situation, we will invite you to continue with the $249 assessment." },
  { p: "Being accepted means accepted for a Pathway Assessment — not for representation, by Concordia Sports Agency or by any club." },
  { p: "We’ll contact you at this email address with the outcome." },
  { small: `Your application reference: ${r.id}. You can check your status any time: ${statusLink}` },
], { tag: "application_received", to: r.contact.emails });

export const applicantAccepted = (r: ApplicationRecord, checkoutLink: string) => render("You’ve been accepted for a Pathway Assessment", [
  hi(r),
  { p: `Good news — after reviewing your application (${r.id}), we can offer ${r.isMinor ? `${r.data.fullName.split(" ")[0]}` : "you"} a Pathway Assessment.` },
  { p: ACCEPTED_MEANING },
  { p: "The Pathway Assessment is $249, paid once. It includes:" },
  { list: ASSESSMENT_INCLUDES },
  { p: "Before you pay, you’ll see the Pathway Assessment Terms, the refund and withdrawal information and our Privacy Policy." },
  { cta: { label: "Continue to the $249 Pathway Assessment", href: checkoutLink } },
  { small: DELIVERY_FULL },
  { small: "If you continue into the European Pathway after your assessment, $150 of your Pathway Assessment fee is credited toward your first monthly Pathway payment." },
], { tag: "accepted", to: r.contact.emails });

export const applicantNotAccepted = (r: ApplicationRecord) => render("Your Pathway Assessment application", [
  hi(r),
  { p: `Thank you for applying (${r.id}). Based on what you’ve shared, we don’t think a Pathway Assessment is the right step at this stage — and we’d rather say so than take your money.` },
  { p: "This isn’t a judgement on your future in football. You’re welcome to apply again when your situation changes — for example after a new season, new footage or a change of club." },
  { p: "No payment has been taken." },
], { tag: "not_accepted", to: r.contact.emails });

export const applicantPaymentReceived = (r: ApplicationRecord, onboardingLink: string) => render("Payment received — send your profile and materials", [
  hi(r),
  { p: `Thank you — your $249 Pathway Assessment payment is confirmed (reference ${r.id}).` },
  { p: "Next step: send us the football profile and materials we need for the assessment. Links are best for video (YouTube, Vimeo, Google Drive or Dropbox) — please don’t send raw video files." },
  { p: "If something doesn’t exist — no Transfermarkt profile, no highlight video, no current club — just tell us. That isn’t a problem in itself." },
  { cta: { label: "Send your profile + materials", href: onboardingLink } },
  { small: DELIVERY_FULL },
  ...(r.payment?.earlyStartRequested === false ? [{ small: `You asked us not to start before your 14-day withdrawal period ends (${fmt(r.payment.withdrawalEndsAt)}). You can still send your materials now; we will begin the assessment after that date.` }] : []),
  { small: "A receipt for your payment is sent separately by our payment provider, Stripe." },
], { tag: "payment_received", to: r.contact.emails });

export const applicantMaterialsReceived = (r: ApplicationRecord, statusLink: string) => render("We’ve received your materials", [
  hi(r),
  { p: "Thank you — we’ve received your materials." },
  { p: "Our team will now review them to confirm whether we have the information reasonably required to begin your Pathway Assessment. We’ll email you either to confirm your assessment has started, or to ask for anything we still need." },
  { p: "Your 7-day assessment period has not started yet — it begins once we confirm your materials are sufficient." },
  { small: `Status: ${statusLink}` },
], { tag: "materials_received", to: r.contact.emails });

export const applicantAdditionalInfo = (r: ApplicationRecord, items: string[], onboardingLink: string) => render("A little more information for your Pathway Assessment", [
  hi(r),
  { p: "We’ve reviewed your submission and need some additional information before we can begin your Pathway Assessment:" },
  { list: items },
  { p: "Your 7-day assessment period begins once we’ve received this and confirmed your materials are sufficient." },
  { cta: { label: "Send the additional information", href: onboardingLink } },
], { tag: "additional_info", to: r.contact.emails });

export const applicantStarted = (r: ApplicationRecord, start: string, target: string) => render("Your Pathway Assessment has started", [
  hi(r),
  { p: "We have the information required to begin your Pathway Assessment." },
  { p: `Assessment start date: ${fmt(start)}\nTarget completion: within 7 days — by ${fmt(target)}.` },
], { tag: "assessment_started", to: r.contact.emails });

export const applicantScheduled = (r: ApplicationRecord, start: string, statusLink: string) => render("Your materials are confirmed", [
  hi(r),
  { p: "Thank you — we have the information required for your Pathway Assessment." },
  { p: `You did not ask us to begin during your 14-day withdrawal period, so the assessment starts on ${fmt(start)}, when that period ends. Target completion: within 7 days of that date.` },
  { p: "If you would like us to start now instead, you can ask from your status page. If you do, and then withdraw within the 14 days, you pay a proportionate amount for the work already done." },
  { cta: { label: "Open your status page", href: statusLink } },
], { tag: "assessment_scheduled", to: r.contact.emails });

export const applicantWithdrawalReceived = (r: ApplicationRecord, contract: "assessment" | "pathway", at: string) => render("We received your withdrawal", [
  hi(r),
  { p: `We confirm that we received your withdrawal from the ${contract === "assessment" ? "Pathway Assessment" : "European Pathway subscription"} contract on ${fmt(at)} (${at.slice(11, 16)} UTC).` },
  { p: contract === "assessment"
    ? (r.payment?.earlyStartRequested ? "Because you asked us to start within the withdrawal period, we will refund the amount you paid minus a proportionate amount for the work already done, within 14 days, to the same payment method." : "We will refund the full amount within 14 days, to the same payment method.")
    : "We will cancel the subscription and refund in line with the Refund & Withdrawal Policy within 14 days, to the same payment method." },
  { small: `Reference: ${r.id}. Seller: Concordia Sports Agency SIA.` },
], { tag: "withdrawal_acknowledgement", to: [...new Set([...(r.payment?.payerEmail ? [r.payment.payerEmail] : []), ...r.contact.emails])] });

export const applicantNewLink = (r: ApplicationRecord, statusLink: string) => render("Your new European Pathway link", [
  hi(r),
  { p: "Here is your new personal link to your application status, payment and onboarding. Earlier links no longer work." },
  { cta: { label: "Open your status page", href: statusLink } },
  { small: "Please don’t forward this email — the link gives access to your application." },
], { tag: "link_reissued", to: r.contact.emails });

export const applicantReady = (r: ApplicationRecord, statusLink: string, bookingLink?: string) => render("Your Pathway Assessment is ready", [
  hi(r),
  { p: "Your Pathway Assessment is ready." },
  ...(r.reportUrl ? [{ cta: { label: "Open your Pathway Assessment", href: r.reportUrl } }] : []),
  { p: "The next step is your consultation call of up to 60 minutes, where we explain our assessment, realistic options, possible markets and recommended next steps. Parents and guardians are welcome." },
  ...(bookingLink ? [{ cta: { label: "Book your consultation call", href: bookingLink } }] : [{ p: "We’ll contact you shortly to arrange a time for the call." }]),
  { small: "The call is advisory. It doesn’t promise a club, a trial, representation, an offer, a contract or a transfer." },
  { small: `Status: ${statusLink}` },
], { tag: "assessment_ready", to: r.contact.emails });

export const applicantPathwayOffer = (r: ApplicationRecord, link: string, credit?: { until?: string }) => render("Your next steps — European Pathway", [
  hi(r),
  { p: "Thank you for your time on the call. The decision is yours." },
  { p: "If it makes sense to continue, European Pathway is $399 per month — designed as a 6-month European career pathway, paid monthly, with no six-month upfront payment. Cancellation options are available; subscription terms apply." },
  ...(credit ? [{ p: `Because you completed a Pathway Assessment, $150 of your assessment fee is credited toward your first monthly Pathway payment: your first payment is $249, then $399/month. The credit can be used once${credit.until ? `, until ${fmt(credit.until)}` : ""}.` }] : []),
  { cta: { label: "Review European Pathway and subscribe", href: link } },
  { small: "European Pathway is advisory career management. Any football-agent representation by Concordia Sports Agency would be a separate written agreement under the applicable FIFA rules." },
], { tag: "pathway_offer", to: r.contact.emails });

export const applicantSubscriptionStarted = (r: ApplicationRecord, statusLink: string) => render("Welcome to European Pathway", [
  hi(r),
  { p: "Your European Pathway subscription is active. Thank you for continuing with us." },
  { p: `You’re billed monthly. ${r.credit?.usedAt ? "Your first payment included the $150 Pathway Assessment credit. " : ""}You can manage or cancel your subscription online from your status page at any time; cancellation takes effect at the end of the current billing month.` },
  { cta: { label: "Your status & subscription", href: statusLink } },
  { small: "Subscription terms: European Pathway Subscription Terms (on our website)." },
], { tag: "subscription_started", to: r.contact.emails });

export const applicantRenewalFailed = (r: ApplicationRecord, statusLink: string) => render("Your European Pathway payment didn’t go through", [
  hi(r),
  { p: "We couldn’t collect your latest monthly European Pathway payment. Please update your payment method so your pathway continues without interruption." },
  { cta: { label: "Update payment method", href: statusLink } },
], { tag: "renewal_failed", to: r.contact.emails });

export const applicantSubscriptionEnded = (r: ApplicationRecord) => render("Your European Pathway subscription has ended", [
  hi(r),
  { p: "Your European Pathway subscription has ended and no further payments will be taken." },
  { p: "Thank you for working with us. You’re welcome back at any time." },
], { tag: "subscription_ended", to: r.contact.emails });

/* ───────────── Internal Concordia notifications ───────────── */

const L = (k: string, v?: unknown) => `${k}: ${Array.isArray(v) ? v.join(", ") || "—" : (v ?? "") === "" ? "—" : String(v)}`;

export function internalApplication(r: ApplicationRecord, adminLink: string, to: string[]): Message {
  const d = r.data, a = r.attribution;
  const age = r.triage.age;
  const sec = (title: string, lines: string[]) => [{ p: title }, { small: lines.join("\n") }];
  return render(`NEW PATHWAY APPLICATION — ${d.fullName} — ${r.id}`, [
    ...(r.duplicateOf?.length ? [{ p: `⚠ POSSIBLE DUPLICATE — same email as ${r.duplicateOf.join(", ")}` }] : []),
    ...sec("PLAYER", [L("Full name", d.fullName), L("Plays in", d.footballCategory), L("Date of birth", d.dateOfBirth), L("Age", age), L("Nationality", d.nationality), L("Passports / additional nationality", d.passports), L("Possible EU ancestry", d.ancestry), L("Current country", d.residence), L("Email", d.email), L("Phone / WhatsApp", d.whatsapp), L("Applicant", d.applicant === "guardian" ? "Parent / guardian" : "Player")]),
    ...(d.guardian ? sec("PARENT / GUARDIAN", [L("Name", d.guardian.name), L("Relationship", d.guardian.relationship), L("Email", d.guardian.email), L("Phone", d.guardian.phone), L("Guardian consent", d.guardian.consent ? "Yes" : "No")]) : []),
    ...sec("FOOTBALL", [L("Current club / team", d.currentClub), L("School / college / academy", [d.education?.status, d.education?.college, d.education?.division].filter(Boolean).join(" · ")), L("Eligibility years left", d.education?.eligibilityYears), L("Position(s)", d.positions), L("Preferred foot", d.foot), L("Height", d.height), L("Playing level", d.level), L("Minutes last season", d.minutesLastSeason), L("Previous clubs / recent history", d.previousClubs), L("National-team experience", d.nationalTeam), L("Contract status", d.contractStatus), L("Contract ends", d.contractEnds), L("Current offers", d.offers)]),
    ...sec("PROFILE", [L("Transfermarkt", d.transfermarktUrl), L("Highlights", d.highlightsUrl), L("Full match", d.fullMatchUrl), L("Other profile", d.instagram)]),
    ...sec("OBJECTIVE", [L("Objective", d.objective), L("What they’re looking for", d.lookingFor), L("Target markets", d.targetCountries), L("Available from / timeline", d.availableFrom), L("Ready to relocate", d.relocation), L("Budget", d.budget)]),
    ...sec("REPRESENTATION", [L("Current agent", d.hasAgent)]),
    ...sec("ATTRIBUTION", [L("UTM source", [a.first?.utm_source, a.last?.utm_source].filter(Boolean).join(" → ")), L("UTM medium", a.last?.utm_medium ?? a.first?.utm_medium), L("UTM campaign", a.last?.utm_campaign ?? a.first?.utm_campaign), L("UTM content / landing variant", a.last?.utm_content ?? a.first?.utm_content), L("Referral", a.last?.ref ?? a.first?.ref), L("Landing page", a.first?.landing), L("Campaign match", r.campaign), L("Consent to attribution storage", a.first || a.last ? "Yes" : "No / not captured")]),
    ...sec("CONSENTS", [L("Terms + Privacy", "Accepted"), L("Concordia Sports Agency may view profile", d.consents.agencyView ? "Yes" : "No"), L("Marketing emails", d.consents.marketing ? "Yes" : "No")]),
    ...sec("SYSTEM", [L("Application ID", r.id), L("Submitted", r.createdAt), L("Current status", STATE_LABEL[currentState(r)]), L("Rules-based triage hint (not a decision)", `${r.triage.route} — ${r.triage.reasons.join(" ")}`)]),
    { cta: { label: "Review in admin", href: adminLink } },
  ], { tag: "internal_application", to, internal: true });
}

export function internalMaterials(r: ApplicationRecord, m: MaterialsSubmission, adminLink: string, to: string[]): Message {
  const show = (k: string) => (m.notAvailable.includes(k) ? "Not available (player says it doesn’t exist)" : m.values[k]?.trim() || "Not provided");
  const sections = ONBOARDING.map((s) => ({ p: s.title.toUpperCase() as string, lines: s.fields.filter((f) => f.type !== "checkbox" && !Object.values(NOT_AVAILABLE).includes(f.name)).map((f) => f.type === "file" ? L(f.label, m.files.find((x) => x.field === f.name)?.name ?? "No file") : L(f.label, show(f.name))) }));
  return render(`PATHWAY MATERIALS — ${r.data.fullName} — ${r.id}`, [
    ...sections.flatMap((s) => [{ p: s.p }, { small: s.lines.join("\n") }]),
    { p: "HEALTH DATA" }, { small: m.values.injuries?.trim() ? `Injury information provided with explicit consent: ${m.healthConsent ? "Yes" : "No"}` : "No injury information provided" },
    { p: "SYSTEM" },
    { small: [L("Application ID", r.id), L("Payment status", r.payment?.status), L("Payment date", r.paymentReceivedAt), L("Materials submission date", m.at), L("Submission number", r.materials.length), L("Materials status", STATE_LABEL[currentState(r)]), "Assessment start: NOT STARTED — confirm sufficiency in admin. The 7-day period starts only on that confirmation.", ...(r.payment?.earlyStartRequested === false ? [`⚠ Customer did NOT request an early start — do not begin before ${r.payment.withdrawalEndsAt}`] : [])].join("\n") },
    { cta: { label: "Review materials in admin", href: adminLink } },
  ], { tag: "internal_materials", to, internal: true });
}

export const internalEvent = (r: ApplicationRecord, title: string, lines: string[], adminLink: string, to: string[]) => render(`${title} — ${r.data.fullName} — ${r.id}`, [{ small: lines.join("\n") }, { cta: { label: "Open in admin", href: adminLink } }], { tag: "internal_event", to, internal: true });
