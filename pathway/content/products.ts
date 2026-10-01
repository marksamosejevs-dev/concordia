import type { Product } from "@/lib/commerce/types";
import { pending, type Evidence } from "@/lib/evidence";

export interface ProgrammeContent {
  productId: string;
  concept: string;
  bestFor: string;
  answers: string[];
  inclusions: string[];
  footnote?: string;
  pending?: Record<string, Evidence>;
}

/** Locked prices (current). Regular/reference prices are NOT displayed until E16 clears. */
export const products: Product[] = [
  { id: "assessment", slug: "assessment", name: "Player Pathway Assessment", term: "One-off", billingType: "one_time", price: 249, assessmentCreditEligible: false, affiliateEligible: true, access: "application_required", cancellationPolicyRef: "refunds" },
  { id: "cohort", slug: "cohort", name: "Pathway Cohort", term: "6 months", billingType: "fixed_term", price: 1500, termMonths: 6, assessmentCreditEligible: true, renewalBehaviour: "manual", affiliateEligible: true, access: "assessment_required", cancellationPolicyRef: "refunds" },
  { id: "window", slug: "window", name: "Window Programme", term: "6 months", billingType: "fixed_term", price: 2400, termMonths: 6, instalmentOptions: [{ count: 3, amount: 850 }], assessmentCreditEligible: true, renewalBehaviour: "manual", affiliateEligible: true, access: "assessment_required", label: "Most popular", cancellationPolicyRef: "refunds" },
  { id: "two-window", slug: "two-window", name: "Two-Window Programme", term: "12 months", billingType: "fixed_term", price: 4200, termMonths: 12, instalmentOptions: [{ count: 6, amount: 750 }], assessmentCreditEligible: true, renewalBehaviour: "manual", affiliateEligible: true, access: "assessment_required", label: "Best value", cancellationPolicyRef: "refunds" },
  { id: "elite", slug: "elite", name: "Elite European Pathway", term: "12 months", billingType: "fixed_term", price: 7500, termMonths: 12, instalmentOptions: [{ count: 4, amount: 2000 }], assessmentCreditEligible: true, renewalBehaviour: "manual", affiliateEligible: true, access: "assessment_required", label: "Limited capacity", cancellationPolicyRef: "refunds" },
  { id: "club", slug: "pathway-club", name: "Pathway Club", term: "Monthly · alumni only", billingType: "recurring", price: 149, billingInterval: "month", minimumTermMonths: 1, assessmentCreditEligible: false, renewalBehaviour: "auto_renew", affiliateEligible: false, access: "invitation_only", cancellationPolicyRef: "refunds" },
];

export const product = (id: string) => products.find((p) => p.id === id)!;

export const ASSESSMENT_CREDIT = { amount: 150, days: 14 };

/** "Limited capacity" renders only with a real seat counter (E20). */
export const ELITE_CAPACITY: { seatsRemaining?: number; evidence: Evidence } = { evidence: pending("E20", "Real seat cap / counter") };

export const programmes: ProgrammeContent[] = [
  {
    productId: "window",
    concept: "One transfer window. One professional plan.",
    bestFor: "Players targeting the next window.",
    answers: ["What should I do this month?", "What changes as the window approaches?", "Is this opportunity worth it?"],
    inclusions: [
      "Written 12-month career roadmap",
      "Monthly 45-minute strategy call",
      "Two full-match analyses per window cycle",
      "Football CV and player-profile optimisation",
      "Highlight-reel direction",
      "Market briefing for each target country",
      "Outreach education and templates",
      "Unlimited opportunity, trial, academy and agent vetting (48-hour response)",
      "Offer evaluation",
      "Transfer-window plan and trial budget planning",
      "Visa and work-permit orientation",
      "Relocation checklist",
      "Quarterly written review",
      "Quarterly parent update call",
      "Member dashboard",
      "Monthly recorded group workshops",
    ],
  },
  {
    productId: "two-window",
    concept: "Two windows. One year. One career strategy.",
    bestFor: "Players 12–24 months from a professional move.",
    answers: ["How do I use a full season to improve and reposition?", "When should the plan change?"],
    inclusions: ["Everything in the Window Programme, across both windows", "Four full-match analyses", "End-of-year re-assessment"],
    footnote: "Development takes time. A move that isn’t right in January may be right in July. Two windows give you a season to improve, reposition and prepare — without starting over.",
  },
  {
    productId: "cohort",
    concept: "The same curriculum, in a group.",
    bestFor: "Self-driven players who want structure at a lower price.",
    answers: ["How do markets, windows and outreach really work?", "Is this opportunity legitimate?"],
    inclusions: [
      "Fortnightly live group sessions (groups of 12–15)",
      "Structured football-career curriculum and market education",
      "One individual review call per quarter",
      "One full-match analysis per quarter",
      "Opportunity and trial vetting",
      "Member community",
      "European market briefings",
    ],
  },
  {
    productId: "elite",
    concept: "More time. More depth. More frequent professional review.",
    bestFor: "Families and players who want the most intensive version of the Pathway.",
    answers: ["What if an opportunity appears tomorrow?", "What exactly would we be signing?", "How do we prepare a move abroad?"],
    inclusions: [
      "Everything in the Two-Window Programme",
      "Monthly advisory call with a FIFA Licensed Football Agent",
      "Fortnightly strategy calls",
      "Six full-match analyses",
      "Bespoke market report for two target countries",
      "Two prepaid legal credits for contract or agreement reviews, provided and invoiced separately",
      "Quarterly family call",
      "24-hour response on opportunity vetting",
      "Relocation coordination: housing-search guidance, local contacts, insurance checklist",
    ],
    pending: { legalCredits: pending("E9", "Law-practice presentation"), staffing: pending("E13", "Who takes fortnightly calls"), capacity: pending("E20") },
  },
  {
    productId: "club",
    concept: "Stay sharp between moves.",
    bestFor: "Players who have completed a programme.",
    answers: ["What’s changed in my markets?", "Is this new opportunity sound?"],
    inclusions: ["Monthly market update", "Monthly group call", "Opportunity vetting", "Quarterly profile review", "Profile updates", "Educational library", "Member network", "Dashboard access"],
    footnote: "Not an agent subscription. Available after completing a programme.",
  },
];

export const programmeFor = (id: string) => programmes.find((p) => p.productId === id)!;

export const BEFORE_AFTER: [string, string][] = [
  ["Random DMs", "Outreach education and templates"],
  ["Random showcases and trials", "Every opportunity vetted before you pay"],
  ["An unclear level", "A defined level, reviewed with new match analysis"],
  ["Unclear target countries", "Market briefings for your target countries"],
  ["A weak football CV", "CV and player-profile optimisation"],
  ["Poor footage", "Highlight-reel direction"],
  ["No window strategy", "A transfer-window plan and trial budget plan"],
  ["Unchecked offers", "Offer evaluation"],
  ["No review", "Quarterly written review"],
  ["Reactive decisions", "A written 12-month roadmap"],
];

export const LADDER = [
  { step: "Free application", price: "Free", answers: "Is an assessment right for me?" },
  { step: "Player Pathway Assessment", price: "$249", answers: "Where am I? What level and markets make sense? What should I do next?" },
  { step: "Career decision", price: "", answers: "Go · Wait · Stay · Move · Play more · Change market · Improve first · Say no · Read it again" },
  { step: "European Pathway programme", price: "Optional", answers: "How do I execute the plan — this month, as the window approaches, when an opportunity appears, when nothing happens?" },
  { step: "Pathway Club", price: "Optional", answers: "How do I stay sharp between moves?" },
  { step: "Representation", price: "Not for sale", answers: "Separate and selective — Concordia Sports Agency, under its own agreement." },
];
