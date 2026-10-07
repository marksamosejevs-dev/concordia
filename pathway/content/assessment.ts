/**
 * PATHWAY ASSESSMENT — founder definition (Round 3). Single source for every page, form, email and the Terms.
 */
export const ACCEPTED_MEANING = "Being accepted means accepted for a Pathway Assessment — not for representation, by Concordia Sports Agency or by any club.";
export const DELIVERY = "We aim to complete the Pathway Assessment within 7 days after payment and receipt of the information and materials reasonably required to conduct the assessment.";
export const DELIVERY_FULL = DELIVERY + " If additional information or materials are reasonably required, the assessment period will begin once those materials have been received and the submitted materials are sufficient for the assessment to proceed.";
export const DELIVERY_SHORT = "Within 7 days once payment is received and your materials are confirmed";
export const CALL_MINUTES = 60;

/** What the $249 Pathway Assessment includes (founder wording, Round 3 final). */
export const ASSESSMENT_INCLUDES = [
  "Review of your football profile and submitted materials",
  "Review of your football CV and playing history",
  "Review of available match footage and highlight video, where available",
  "Review of your Transfermarkt profile, where available",
  "Review of current club, playing level, position, age category, nationality, passport and football eligibility where relevant",
  "A realistic European market assessment",
  "An individual Pathway Assessment, prepared for you",
  "A consultation call of up to 60 minutes: realistic options, possible markets, strengths and weaknesses of your current profile, and recommended next steps",
];

/** What the consultation call may cover — advisory only; the call does not create representation. */
export const CALL_COVERS = ["Your current football profile", "Realistic market positioning", "Suitable countries and leagues", "Strengths", "Weaknesses and profile gaps", "Career risks", "Possible next steps", "Whether further cooperation may make sense"];

/**
 * CANONICAL JOURNEY — the only version of the flow on the site (FlowLine, steps lists, Terms order).
 * `k` = short label (flow line), `b` = sub-line, `body` = full explanation (steps lists).
 */
export const FLOW = [
  { k: "Apply", b: "Free", body: "Tell us about your football, passports and goals. Free — no payment to apply." },
  { k: "We review", b: "Your application", body: "Concordia reviews your application. Outcome: accepted for a Pathway Assessment, or not accepted at this stage." },
  { k: "Accepted for assessment", b: "Not representation", body: ACCEPTED_MEANING },
  { k: "$249", b: "Pathway Assessment", body: "Only players accepted for a Pathway Assessment pay — once, online." },
  { k: "Onboarding", b: "Straight after payment", body: "Immediately after payment we send your onboarding request." },
  { k: "Profile + materials", b: "CV, history, video links", body: "Send your football profile and materials — links for video. Missing a Transfermarkt profile or highlight video? Tell us; it isn’t an automatic problem." },
  { k: "Materials check", b: "By our team", body: "We confirm whether we have what’s reasonably required for your assessment — or ask for anything missing." },
  { k: "Assessment in progress", b: "7 days from confirmation", body: DELIVERY },
  { k: "Your Pathway Assessment", b: "Prepared for you", body: "Your individual Pathway Assessment: realistic European options, written for you." },
  { k: "60-minute call", b: "Options explained", body: "A consultation call of up to 60 minutes to explain the assessment, possible markets and recommended next steps." },
  { k: "Next steps", b: "Your decision", body: "Your decision. Continuing with European Pathway ($399/month) or any representation is agreed separately." },
];

export const ASSESSMENT_STEPS = FLOW.map((f, i) => ({ n: String(i + 1).padStart(2, "0"), title: f.k, body: f.body }));

export const RECEIVE = ASSESSMENT_INCLUDES;
/** Homepage summary of RECEIVE (same scope, shorter). */
export const RECEIVE_SHORT = ["Review of your football profile, footage and materials", "A realistic European market assessment", "Your individual written Pathway Assessment", "A consultation call of up to 60 minutes"];

export const NOT_RECEIVE = [
  { t: "No trials.", b: "We don’t sell or arrange them. That’s why we can tell you honestly whether one is worth it." },
  { t: "No club introductions or outreach.", b: "European Pathway advises you. It never contacts clubs about you." },
  { t: "No representation.", b: "Concordia Sports Agency’s representation is separate, selective and cannot be bought." },
  { t: "No contract guarantee.", b: "Nobody can honestly promise one." },
  { t: "No promise that Europe is the answer.", b: "Sometimes it is. Sometimes it isn’t yet. You’ll know which." },
];

export const ASSESSMENT_FACTS = { deliveryDays: 7, price: 249, callMinutes: 60 };

/** INTERNAL — scalable workflow (E13). Not rendered publicly. Roles assigned via team.assessmentRoles. */
export const WORKFLOW_INTERNAL = [
  { stage: "Application / triage", by: "System + team" },
  { stage: "Player data / footage preparation", by: "Team" },
  { stage: "Full-match analysis", by: "Qualified team member / analyst" },
  { stage: "Career & market assessment", by: "Senior professional review" },
  { stage: "Report preparation", by: "Team" },
  { stage: "Final professional review", by: "Senior review (defined sign-off process — E13)" },
  { stage: "Client review call", by: "Appropriate team member by product / case" },
  { stage: "Escalation", by: "Marks, where senior football-agent judgement is required" },
];

/** Compact public journey — shown at the entrance to the application (the detailed lifecycle stays internal). */
export const JOURNEY_COMPACT = [
  { k: "Apply", b: "Free application" },
  { k: "We review", b: "Whether a Pathway Assessment is appropriate for you" },
  { k: "If accepted", b: "$249 Pathway Assessment" },
  { k: "Assessment", b: "Profile review, individual assessment and a consultation of up to 60 minutes" },
  { k: "Your decision", b: "Decide what to do next" },
];
