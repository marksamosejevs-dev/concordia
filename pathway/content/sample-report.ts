/**
 * SAMPLE ASSESSMENT — ILLUSTRATIVE EXAMPLE.
 * A fictional demonstration player. Never presented as a real former Pathway customer.
 * `basis` lets a permitted, anonymised real assessment replace or sit alongside it later (E22).
 */
export interface SampleReport {
  id: string;
  basis: "illustrative" | "anonymised_real";
  label: string;
  player: { code: string; age: number; position: string; foot: string; context: string; passports: string; footage: string };
  pages: { key: string; title: string; caption: string }[];
  summary: string;
  levelBand: { range: string; confidence: string; reasoning: string[] };
  strengths: { t: string; b: string }[];
  gaps: { t: string; b: string }[];
  markets: { name: string; tier: string; why: string; caution: string }[];
  passport: string[];
  plan: { window: string; actions: string[] }[];
  decision: string[];
}

export const sampleReports: SampleReport[] = [
  {
    id: "sample-001",
    basis: "illustrative",
    label: "Sample assessment · Illustrative example · Fictional player",
    player: { code: "Player X", age: 21, position: "Left-back / left wing-back", foot: "Left", context: "US college senior, regular starter", passports: "United States + one EU passport (illustrative)", footage: "Two full matches + highlights" },
    pages: [
      { key: "cover", title: "Cover & summary", caption: "Your situation, our headline view and your next decision on one page." },
      { key: "level", title: "Level band & reasoning", caption: "A realistic range — and exactly why." },
      { key: "strengths", title: "Strengths & gaps", caption: "Three strengths to lead with. Three gaps to close." },
      { key: "markets", title: "Market & passport map", caption: "Three market directions and what your passport changes." },
      { key: "plan", title: "90-day action plan", caption: "What to do, in order, before the next window." },
    ],
    summary: "Player X has a credible profile for professional football at a modest level, with one clear physical strength and two coachable gaps. The second passport widens the options materially. The recommendation is to prepare properly for the following window rather than rush the next one.",
    levelBand: {
      range: "Lower-tier professional / strong semi-professional",
      confidence: "Moderate — based on two full matches at one competitive level",
      reasoning: [
        "Recovery pace and crossing volume stand out at the current level.",
        "Defensive positioning against direct opponents is inconsistent over 90 minutes.",
        "Limited evidence against professional-level opposition.",
      ],
    },
    strengths: [
      { t: "Repeat sprint capacity", b: "Maintains high-intensity runs late in both matches." },
      { t: "Left-sided delivery", b: "Early, varied crosses; good decision on when to go outside." },
      { t: "Availability", b: "Started every match last season — a signal clubs value." },
    ],
    gaps: [
      { t: "Body shape when defending", b: "Square stance invites inside runs; coachable within a season." },
      { t: "Decision speed under press", b: "Tends to play backwards when the first option closes." },
      { t: "Footage", b: "Highlights over-represent attacking moments; add defensive sequences." },
    ],
    markets: [
      { name: "Market A — Northern Europe", tier: "Tier 3 range", why: "Values athletic full-backs; seasons aligned with the next window.", caution: "Registration depends on passport recognition." },
      { name: "Market B — Central Europe", tier: "Tier 2–3 range", why: "Demand for left-footed wide defenders.", caution: "Tactical demands higher; footage must show defending." },
      { name: "Market C — Domestic option", tier: "Professional / development", why: "Keeps minutes high while gaps are closed.", caution: "Revisit Europe after one season of evidence." },
    ],
    passport: [
      "The EU passport removes non-EU registration limits in many leagues — confirm recognition per market.",
      "Without it, Market A would narrow significantly at this level.",
      "Keep documents current; some clubs ask at trial stage.",
    ],
    plan: [
      { window: "Days 1–30", actions: ["Film two more full matches (wide angle).", "Rebuild football CV and profile.", "Begin defensive-shape work with your coach."] },
      { window: "Days 31–60", actions: ["Re-cut highlights: 50% defensive sequences.", "Market briefing for A and B.", "Vet any opportunity before paying anything."] },
      { window: "Days 61–90", actions: ["Second review against the plan.", "Decide: target the next window, or stay and build evidence.", "Prepare a trial budget only if the decision is ‘go’."] },
    ],
    decision: ["wait", "improve-first"],
  },
];

export const activeSample = sampleReports[0];
