/**
 * Acquisition campaign registry — ready for segment-specific campaigns that all enter the SAME
 * application → Pathway Assessment → European Pathway funnel. No separate brands or public pages.
 * Matching: utm_campaign starts with the key (e.g. "us-womens-college-fall26"). utm_content = variant.
 * Pure module (no browser APIs).
 */
export type FootballCategory = "Women’s football" | "Men’s football";
export interface Campaign { key: string; label: string; category?: FootballCategory; stage: "college" | "youth"; heroLede?: string }

export const CAMPAIGNS: Campaign[] = [
  { key: "us-mens-college", label: "US men’s college soccer → Europe", category: "Men’s football", stage: "college", heroLede: "Finishing college soccer? Find out where you really stand in European football — then a career team manages your pathway, month by month." },
  { key: "us-womens-college", label: "US women’s college soccer → Europe", category: "Women’s football", stage: "college", heroLede: "Finishing college soccer? Find out where you really stand in European women’s football — then a career team manages your pathway, month by month." },
  { key: "youth-mens", label: "Youth men’s football → Europe", category: "Men’s football", stage: "youth", heroLede: "A young player with European ambitions? Get an honest assessment first — then a career team manages the pathway, with parents involved." },
  { key: "youth-womens", label: "Youth women’s football → Europe", category: "Women’s football", stage: "youth", heroLede: "A young player aiming for European women’s football? Get an honest assessment first — then a career team manages the pathway, with parents involved." },
];

export function campaignFor(utmCampaign?: string): Campaign | undefined {
  if (!utmCampaign) return undefined;
  const c = utmCampaign.toLowerCase();
  return CAMPAIGNS.find((x) => c === x.key || c.startsWith(x.key + "-") || c.startsWith(x.key + "_"));
}
