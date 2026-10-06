import { pending, type Evidence } from "@/lib/evidence";

/**
 * EUROPEAN PATHWAY — the core recurring product ($399/month).
 * All commitment / cancellation wording lives here so it can be changed in one place
 * once the final subscription terms are legally and commercially locked (founder Q2, legal review).
 */
export const PATHWAY_TERMS = {
  priceLine: "per month",
  horizon: "Designed as a 6-month European career pathway. Paid monthly.",
  cancellation: "Cancellation options available — subscription terms apply.",
  /** Positive, low-risk billing points (founder-confirmed Round 2). */
  points: ["Paid monthly", "No six-month upfront payment", "Cancellation options available*"],
  footnote: "*Subscription terms apply.",
  termsHref: "/legal/terms#notices",
  short: "6-month pathway · paid monthly · no upfront payment",
  /** Shown beside the terms in review mode until the subscription terms are final. */
  evidence: pending("LEGAL", "Final subscription terms: minimum term, early exit, renewal") as Evidence,
};

export const ASSESSMENT_POINTS = ["Full-match review", "Level band", "Three market directions", "90-day action plan", "Review call"];

/** The eight things the career team does — homepage shows name + one line; product page shows detail. */
export interface Pillar { key: string; n: string; name: string; line: string; detail: string[] }
export const PILLARS: Pillar[] = [
  { key: "strategy", n: "01", name: "Career strategy", line: "A written plan for the next six months — and the season after.", detail: ["Written career roadmap built from your assessment", "Regular strategy calls with your career team", "Plan reviewed and adjusted as your situation changes"] },
  { key: "analysis", n: "02", name: "Match analysis", line: "Full-match reviews that show what scouts and coaches will see.", detail: ["Full-match analysis during the pathway", "Clear strengths and development priorities", "Progress measured against your assessment baseline"] },
  { key: "positioning", n: "03", name: "Player positioning", line: "Your profile, CV and footage presented the way football reads them.", detail: ["Football CV and player-profile optimisation", "Highlight-reel direction", "How to present yourself to the market"] },
  { key: "markets", n: "04", name: "European market matching", line: "Which countries and leagues actually fit your level and profile.", detail: ["Market briefing for each target country", "League-fit and level guidance", "Registration, calendar and passport considerations"] },
  { key: "mentorship", n: "05", name: "Mentorship & direct support", line: "A career team you can reach when a decision can’t wait.", detail: ["Direct contact with your career team", "Parent and guardian updates", "Support through setbacks, injuries and quiet periods"] },
  { key: "window", n: "06", name: "Transfer window planning", line: "Every move planned around the windows — not around hope.", detail: ["Transfer-window plan", "Trial and travel budget planning", "Visa, work-permit and relocation orientation"] },
  { key: "contract", n: "07", name: "Contract & offer review", line: "Before you sign anything, we go through it with you.", detail: ["Review of offers and contracts you receive", "What the terms commit you to, in plain English", "Questions to ask before you sign"] },
  { key: "opportunity", n: "08", name: "Opportunity support", line: "Trials, academies, showcases and agents — checked before you pay.", detail: ["Opportunity, trial, academy and agent vetting", "Red-flag checks on anything that asks for money", "Decision support: go, wait or say no"] },
];

/** Illustrative six-month shape. Each player’s plan follows their own assessment. */
export const MONTHS = [
  { m: "01", t: "Foundation", b: "Assessment debrief, written roadmap, target markets agreed." },
  { m: "02", t: "Positioning", b: "Football CV, player profile and highlight-reel direction." },
  { m: "03", t: "Market fit", b: "Country briefings, league fit, opportunity screening." },
  { m: "04", t: "Progress review", b: "New match analysis measured against your baseline." },
  { m: "05", t: "Window prep", b: "Window plan, trial budget, every opportunity vetted." },
  { m: "06", t: "Decision", b: "Offer and contract review. Next move: go, wait or stay." },
];

/** Product-mockup data for the Career Dashboard. Fictional player; illustrative only. */
export const DASHBOARD = {
  player: "Sample player · CM · 20",
  month: 3,
  level: { label: "Current level", value: "Tier 3–4 European level" },
  strengths: ["Progressive passing", "Press resistance", "Work rate"],
  priorities: ["Weak-foot delivery", "Aerial duels"],
  markets: [{ c: "Poland", fit: 82 }, { c: "Czechia", fit: 74 }, { c: "Sweden", fit: 66 }],
  positioning: 70,
  nextWindow: "Summer window",
  actions: ["Upload last two full matches", "Review Polish 2nd-tier shortlist", "Parent call — Thursday"],
};

/** Full inclusion list for the product page (detailed; never on the homepage). */
export const PATHWAY_INCLUDED: { t: string; e?: Evidence }[] = [
  { t: "Written career roadmap" },
  { t: "Regular strategy calls", e: pending("E13", "Cadence and who takes calls") },
  { t: "Full-match analyses", e: pending("E13", "Number per pathway") },
  { t: "Football CV and player-profile optimisation" },
  { t: "Highlight-reel direction" },
  { t: "Market briefing for each target country" },
  { t: "League-fit and level guidance" },
  { t: "Opportunity, trial, academy and agent vetting" },
  { t: "Contract and offer review" },
  { t: "Transfer-window plan and trial budget planning" },
  { t: "Visa and work-permit orientation" },
  { t: "Relocation checklist" },
  { t: "Direct contact with your career team", e: pending("E13", "Response time") },
  { t: "Parent and guardian updates" },
  { t: "Progress review against your assessment" },
  { t: "Career dashboard" },
];

export const JOURNEY = [
  { k: "Apply", price: "Free", b: "Two minutes. Tell us where you play." },
  { k: "Assess", price: "$249", b: "Your level, markets and next move — in writing." },
  { k: "Build", price: "$399/mo", b: "Your career team runs the pathway with you." },
  { k: "Next move", price: "", b: "Go, wait, stay or move — decided with evidence." },
];

export const PARENT_QUESTIONS = ["Is my child really at this level?", "Europe now?", "Stay in college?", "Which country?", "Is this trial real?", "Is this contract fair?", "Are we losing time?"];
export const PLAYER_QUESTIONS = ["Am I good enough for Europe?", "Which league fits me?", "Why is nobody replying?", "Should I pay for this showcase?", "Is my reel working?", "Is this offer real?", "What do I do this window?"];

export const SERVICES_TICKER = ["Career management", "Player assessment", "Match analysis", "Player positioning", "European market strategy", "League matching", "Career mentorship", "Contract review", "Opportunity support", "Transfer window planning"];

/**
 * "Your career, month by month" — states for the scroll-driven pathway board. Fictional, illustrative player.
 * Shows the profile becoming more complete, targeted and market-ready across the six months.
 */
export interface MonthState { m: number; t: string; done: number; focus: string[]; level: string; markets: { c: string; fit: number }[]; ready: string[]; note: string }
export const MONTH_STATES: MonthState[] = [
  { m: 1, t: "Foundation", done: 22, focus: ["strategy", "analysis"], level: "Tier 3–5 (baseline)", markets: [{ c: "Poland", fit: 70 }, { c: "Czechia", fit: 66 }, { c: "Sweden", fit: 64 }, { c: "Portugal", fit: 60 }, { c: "Denmark", fit: 55 }, { c: "Latvia", fit: 58 }], ready: ["Assessment debrief", "Written roadmap"], note: "Baseline set from your assessment." },
  { m: 2, t: "Positioning", done: 41, focus: ["positioning", "mentorship"], level: "Tier 3–5", markets: [{ c: "Poland", fit: 72 }, { c: "Czechia", fit: 67 }, { c: "Sweden", fit: 65 }, { c: "Portugal", fit: 60 }], ready: ["Assessment debrief", "Written roadmap", "Football CV", "Reel direction"], note: "Profile and footage rebuilt for scouts." },
  { m: 3, t: "Market fit", done: 58, focus: ["markets", "opportunity"], level: "Tier 3–4", markets: [{ c: "Poland", fit: 78 }, { c: "Czechia", fit: 71 }, { c: "Sweden", fit: 66 }], ready: ["Assessment debrief", "Written roadmap", "Football CV", "Reel direction", "Market briefings"], note: "Shortlist narrowed to three markets." },
  { m: 4, t: "Progress review", done: 72, focus: ["analysis", "strategy"], level: "Tier 3–4 ↑", markets: [{ c: "Poland", fit: 81 }, { c: "Czechia", fit: 73 }, { c: "Sweden", fit: 66 }], ready: ["Assessment debrief", "Written roadmap", "Football CV", "Reel direction", "Market briefings", "New match analysis"], note: "New match analysed against the baseline." },
  { m: 5, t: "Window prep", done: 87, focus: ["window", "opportunity"], level: "Tier 3–4 ↑", markets: [{ c: "Poland", fit: 83 }, { c: "Czechia", fit: 74 }], ready: ["Assessment debrief", "Written roadmap", "Football CV", "Reel direction", "Market briefings", "New match analysis", "Window plan"], note: "Window plan and trial budget agreed." },
  { m: 6, t: "Decision", done: 100, focus: ["contract", "window"], level: "Tier 3 target", markets: [{ c: "Poland", fit: 84 }], ready: ["Assessment debrief", "Written roadmap", "Football CV", "Reel direction", "Market briefings", "New match analysis", "Window plan", "Offer reviewed"], note: "Next move decided with evidence." },
];
