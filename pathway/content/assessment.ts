export const ASSESSMENT_STEPS = [
  { n: "01", title: "Application", body: "You tell us about your football, education, passports and goals. Free." },
  { n: "02", title: "Player profile", body: "Your profile, statistics, passports and contract status are reviewed." },
  { n: "03", title: "Full-match review", body: "A full match is analysed — at least 60 minutes — plus your highlights." },
  { n: "04", title: "Football assessment", body: "Technical and tactical assessment: three key strengths, three development gaps." },
  { n: "05", title: "Market & passport context", body: "What your passport(s) mean for market access." },
  { n: "06", title: "Realistic level band", body: "A playing-level range, with the reasoning behind it." },
  { n: "07", title: "Three market directions", body: "Three recommended European markets and league levels." },
  { n: "08", title: "90-day action plan", body: "What to do, in order, over the next three months." },
  { n: "09", title: "Review call", body: "A 30-minute career strategy call to go through the report." },
  { n: "10", title: "Next decision", body: "Go, wait, stay, move, play more, change market, improve first, say no — or read it again." },
];

export const RECEIVE = [
  "A written report, 6–8 pages",
  "Structured review of your profile, statistics, passports and contract status",
  "Review of one full match (at least 60 minutes watched) plus highlights",
  "A realistic playing-level range, with reasoning",
  "Three key strengths and three development gaps",
  "Passport and market-access analysis",
  "Three recommended European markets and league levels",
  "A 90-day action plan",
  "A 30-minute career strategy call",
  "Senior professional review under Concordia’s assessment framework",
];

export const NOT_RECEIVE = [
  { t: "No trials.", b: "We don’t sell or arrange them. That’s why we can tell you honestly whether one is worth it." },
  { t: "No club introductions or outreach.", b: "European Pathway advises you. It never contacts clubs about you." },
  { t: "No representation.", b: "Concordia Sports Agency’s representation is separate, selective and cannot be bought." },
  { t: "No contract guarantee.", b: "Nobody can honestly promise one." },
  { t: "No promise that Europe is the answer.", b: "Sometimes it is. Sometimes it isn’t yet. You’ll know which." },
];

export const ASSESSMENT_FACTS = { deliveryDays: 7, price: 249 };

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
