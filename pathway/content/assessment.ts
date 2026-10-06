/**
 * PATHWAY ASSESSMENT — founder definition (Round 3). Single source for every page, form, email and the Terms.
 */
export const ACCEPTED_MEANING = "Being accepted means accepted for a Pathway Assessment — not for representation, by the Agency or by any club.";
export const DELIVERY = "We aim to complete the Pathway Assessment within 7 days after payment and receipt of the information and materials reasonably required to conduct the assessment.";
export const DELIVERY_SHORT = "Ready within 7 days of payment and your materials";
export const CALL_MINUTES = 60;

/** What the $249 Pathway Assessment includes (founder wording). */
export const ASSESSMENT_INCLUDES = [
  "Review of your football profile and submitted materials",
  "Review of your CV and football history",
  "Review of your match footage and highlight video",
  "Review of your Transfermarkt profile, if available",
  "Review of current club, level, position, age category, passport and eligibility",
  "Assessment of realistic European market options",
  "An individual pathway assessment, prepared for you",
  "A 60-minute consultation call to explain our assessment, realistic options, possible markets and next steps",
];

/** What the 60-minute call covers — advisory only. */
export const CALL_COVERS = ["Our assessment of your current profile", "Realistic market positioning", "Countries and leagues that may fit", "Strengths and weaknesses of your football profile", "What may need to improve", "Possible next steps", "Whether there may be a basis for further cooperation"];

/** Application → next steps, as one line of the route. */
export const FLOW = [
  { k: "Apply", b: "Free, about 10 minutes" },
  { k: "Review", b: "We read your profile" },
  { k: "Accepted for assessment", b: "Not representation" },
  { k: "$249", b: "One payment" },
  { k: "Send profile + video", b: "CV, Transfermarkt, footage" },
  { k: "We assess", b: "Within 7 days of materials" },
  { k: "60-minute call", b: "Your options, explained" },
  { k: "Next steps", b: "Your decision" },
];

export const ASSESSMENT_STEPS = [
  { n: "01", title: "Apply", body: "Tell us about your football, passports and goals. Free — no payment to apply." },
  { n: "02", title: "We review", body: "We decide whether we can offer you a Pathway Assessment. You’re either accepted for an assessment or not at this stage." },
  { n: "03", title: "Pay $249", body: "Only after acceptance. " + ACCEPTED_MEANING },
  { n: "04", title: "Send your profile + video", body: "Straight after payment: CV, Transfermarkt, highlight and match video, contract and eligibility details." },
  { n: "05", title: "We assess", body: DELIVERY },
  { n: "06", title: "60-minute call", body: "We explain our assessment, realistic options, possible markets and recommended next steps." },
  { n: "07", title: "Next steps", body: "Your decision. Further cooperation, if any, is agreed separately." },
];

export const RECEIVE = ASSESSMENT_INCLUDES;

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
