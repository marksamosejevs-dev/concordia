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

/** Public contact (the Concordia Sports Agency address already published on concordia.football). ⚑ owner to confirm a dedicated Pathway inbox. */
export const CONTACT = { email: "mail@concordia.football" };

export const LICENCE = { holder: "Marks Amosejevs", number: "202406-7079", registerUrl: undefined as string | undefined /* exact FIFA register URL confirmed at E19 */ };

export const CTA = {
  apply: "Start your assessment",
  micro: "Free application · $249 only if accepted for assessment",
  pathway: "Explore European Pathway",
};

export const NAV = [
  { href: "/assessment", label: "Assessment" },
  { href: "/european-pathway", label: "European Pathway" },
  { href: "/for/parents", label: "Parents" },
  { href: "/for/players", label: "Players" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

export const FOOTER_GROUPS = [
  { title: "European Pathway", links: [["/assessment", "Player Pathway Assessment · $249"], ["/european-pathway", "European Pathway · $399/mo"], ["/pricing", "Pricing"], ["/how-it-works", "How it works"], ["/find-your-path", "Find your path"], ["/markets", "European markets"]] },
  { title: "Who it’s for", links: [["/for/players", "Players"], ["/for/parents", "Parents & guardians"], ["/careers", "Real careers"], ["/faq", "Questions"]] },
  { title: "Concordia", links: [["/about", "About Concordia Soccer"], ["/agency", "Concordia Sports Agency"], ["/players", "Agency players"], ["/representation", "Representation"]] },
  { title: "Legal", links: [["/legal/terms", "Terms of Service"], ["/legal/assessment-terms", "Pathway Assessment Terms"], ["/legal/pathway-terms", "European Pathway Terms"], ["/legal/refunds", "Refunds & withdrawal"], ["/legal/privacy", "Privacy"], ["/legal/cookies", "Cookies"], ["/legal/minors", "Minors & parents"], ["/legal/complaints", "Complaints"], ["/legal/company", "Company information"]] },
] as const;


