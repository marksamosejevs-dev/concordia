import { pending, type Evidence } from "@/lib/evidence";

export const BRAND = {
  name: "Concordia Soccer",
  product: "European Pathway",
  full: "Concordia Soccer · European Pathway",
  endorsement: "From the team behind Concordia Sports Agency",
  signature: "Big ambition. Honest advice.",
  supporting: "Guidance without false hope. Support without empty promises.",
  decisionLine: "The right football decision is not always “go.”",
  trustLine: "Don’t just trust us. Verify us.",
};

/** Legal contracting entity — merchant of record for all Concordia Soccer services. */
export const LEGAL_ENTITY = {
  name: "Concordia Sports Agency SIA",
  registrationNo: "40203574668",
  vatNo: "LV40203574668",
  address: ["Krišjāņa Valdemāra iela 33A–4A", "Rīga, LV-1010", "Latvia"],
  note: "Concordia Soccer · European Pathway is a brand and service of Concordia Sports Agency SIA.",
};

export const LICENCE = { holder: "Marks Amosejevs", number: "202406-7079", registerUrl: undefined as string | undefined /* exact FIFA register URL confirmed at E19 */ };

export const CTA = {
  apply: "Apply for your assessment",
  micro: "Apply free · Assessment $249 if accepted",
};

export const NAV = [
  { href: "/assessment", label: "Assessment" },
  { href: "/programmes", label: "Programmes" },
  { href: "/for/parents", label: "For Parents" },
  { href: "/for/players", label: "For Players" },
  { href: "/markets", label: "Markets" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

export const FOOTER_GROUPS = [
  { title: "European Pathway", links: [["/assessment", "Player Pathway Assessment"], ["/programmes", "Programmes"], ["/pricing", "Pricing"], ["/how-it-works", "How it works"], ["/find-your-path", "Find your path"], ["/markets", "European markets"]] },
  { title: "Who it’s for", links: [["/for/players", "Players"], ["/for/parents", "Parents & guardians"], ["/careers", "Real careers"], ["/faq", "Questions"]] },
  { title: "Concordia", links: [["/about", "About Concordia Soccer"], ["/about/marks-amosejevs", "Marks Amosejevs"], ["/verify", "Verify us"], ["/agency", "Concordia Sports Agency"], ["/players", "Agency players"], ["/representation", "Pathway is not representation"], ["/football-law", "Football law"]] },
  { title: "Legal", links: [["/legal/terms", "Terms"], ["/legal/privacy", "Privacy"], ["/legal/refunds", "Refunds & cancellations"], ["/legal/cookies", "Cookies"], ["/legal/safeguarding", "Safeguarding"], ["/legal/complaints", "Complaints"], ["/legal/company", "Company information"]] },
] as const;

/** Items still pending that affect sitewide copy. */
export const SITE_PENDING: Record<string, Evidence> = {
  contactChannel: pending("E27", "“Talk to us first” channel"),
  refundPolicy: pending("E24", "Approved refund policy text"),
  legalWording: pending("E35", "Final legal / consent wording"),
};
