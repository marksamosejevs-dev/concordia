import { pending, type Evidence } from "@/lib/evidence";

/** Creator / partner landing pages. Disabled until the partner policy is approved (E28). */
export interface Creator {
  slug: string;
  displayName: string;
  referralCode: string;
  audience: "player" | "parent";
  heroEyebrow: string;
  heroHeadline: string;
  heroSub: string;
  intro?: string;
  enabled: boolean;
  evidence: Evidence;
}

export const creators: Creator[] = [
  {
    slug: "example-creator",
    displayName: "Example Creator (template)",
    referralCode: "EXAMPLE",
    audience: "player",
    heroEyebrow: "Recommended by Example Creator",
    heroHeadline: "Silence isn’t an answer. An assessment is.",
    heroSub: "No replies tells you almost nothing. A professional look at your level, market and footage tells you what to do next.",
    enabled: false,
    evidence: pending("E28", "Partner policy, disclosure wording"),
  },
];
