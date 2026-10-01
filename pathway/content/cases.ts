import { hold, type Evidence } from "@/lib/evidence";

export interface AgencyCase {
  type: "agency";
  slug: string;
  title: string;
  from?: string; to?: string; year?: string;
  situation?: string; problem?: string; options?: string; decision?: string; role?: string; result?: string; lesson?: string;
  photo?: string;
  evidence: Evidence;
}
export interface WorkedExample {
  type: "worked";
  slug: string;
  title: string;
  profile: string[];
  question: string;
  examine: string[];
  reasoning: string;
  decision: string[]; // decision keys
  next: string;
  legalReview?: boolean;
}

export const agencyCases: AgencyCase[] = [
  {
    type: "agency",
    slug: "korona-kielce-move",
    title: "A move to Korona Kielce, Poland",
    to: "Korona Kielce, Poland",
    role: "Concordia Sports Agency — representation",
    photo: "/assets/pathway/photos/cases/korona-kielce-signing.jpg",
    evidence: hold("E11/E14", "Player name, from-club, year, transfer type, Agency role, consent"),
  },
];

export const workedExamples: WorkedExample[] = [
  {
    type: "worked",
    slug: "passport-isnt-the-plan",
    title: "The passport isn’t the plan.",
    profile: ["19", "US college, second year", "Holds an EU passport", "Few competitive minutes this season", "Highlights only — no full match"],
    question: "Should he leave college and go to Europe now?",
    examine: ["Evidence of current level (limited without minutes or a full match)", "Depth at his position", "What the passport genuinely changes", "Eligibility and education status", "Timing relative to transfer windows"],
    reasoning: "An EU passport is a real asset, but it doesn’t replace evidence. Without regular minutes and a full match, no honest adviser can place him in a level range with confidence — and clubs can’t either. Moving now would mean arriving without the evidence clubs need.",
    decision: ["play-more", "wait"],
    next: "Priority one is minutes and a filmed full match; revisit before a later window with real evidence. The passport stays an asset, not a shortcut.",
  },
  {
    type: "worked",
    slug: "trial-that-needed-a-second-look",
    title: "The trial that needed a second look.",
    profile: ["22", "Finished college", "No second passport", "Offered a European “trial” that requires an upfront fee"],
    question: "Should he pay and go?",
    examine: ["Who is organising the trial, and what’s actually included", "Whether a club is genuinely involved, and in what capacity", "What non-EU registration would mean at that level", "Total cost including travel and accommodation", "Whether his level fits the market"],
    reasoning: "A fee doesn’t automatically mean a scam — but it means the questions must be answered before any money moves. If they can’t be, the opportunity isn’t ready to be trusted.",
    decision: ["read-it-again", "say-no"],
    next: "Hold until the questions are answered; redirect attention to markets that fit a non-EU profile.",
  },
  {
    type: "worked",
    slug: "europe-or-college-at-17",
    title: "Europe or college at 17.",
    profile: ["17", "Strong youth level", "Family weighing a European academy against a college scholarship"],
    question: "Which way?",
    examine: ["International-transfer rules for under-18s", "What the academy actually offers and costs", "The scholarship’s value and timeline", "The player’s level evidence", "The family’s goals"],
    reasoning: "Rules for moving minors internationally are strict, and an honest assessment starts there. A scholarship can be a development pathway, not a dead end.",
    decision: ["stay", "improve-first"],
    next: "Keep developing, with a clear view of what would need to be true to revisit Europe later.",
    legalReview: true,
  },
];
