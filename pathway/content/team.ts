import { confirmed, pending, type Evidence } from "@/lib/evidence";

export type AssessmentRole = "intake" | "footagePrep" | "matchAnalysis" | "careerMarketAssessment" | "reportPrep" | "seniorReview" | "clientCall" | "escalation";

/** A text field with its own evidence state: pending fields never render in production. */
export interface Field<T = string> { value?: T; evidence: Evidence }

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: Field;
  secondaryRole?: Field;
  shortBio?: Field;
  longBio?: Field<string[]>;
  photo: { desktopPortrait?: string; mobilePortrait?: string; gridCrop?: string; aboutCrop?: string; avatar?: string; evidence: Evidence };
  credentialIds: string[];      // → content/credentials.ts (Verify system)
  specialisms?: Field<string[]>;
  languages?: Field<string[]>;
  verificationLinks?: { label: string; url: string }[];
  linkedin?: string;
  displayOrder: number;
  featured: boolean;
  profilePage: boolean;         // enables a deep individual page
  /** INTERNAL — never rendered. Assigned later (E13). */
  assessmentRoles: AssessmentRole[];
}

const photoPending = pending("E33", "Team photoshoot — consistent visual system");

export const team: TeamMember[] = [
  {
    id: "marks-amosejevs",
    slug: "marks-amosejevs",
    name: "Marks Amosejevs",
    role: { value: "Co-Founder & CEO", evidence: confirmed },
    secondaryRole: { value: "FIFA Licensed Football Agent", evidence: { state: "document", ref: "D1" } },
    shortBio: {
      value: "Built and leads European Pathway, and provides senior professional oversight of its assessment framework. Works on real player moves, has supported players when contracts and clubs went wrong, and continues FIFA’s professional education for agents.",
      evidence: confirmed,
    },
    photo: { evidence: photoPending },
    credentialIds: ["fifa-licence", "minors", "lawyer", "llm", "players-association", "fifa-education", "agency"],
    displayOrder: 1,
    featured: true,
    profilePage: true,
    assessmentRoles: ["seniorReview", "escalation"],
  },
  {
    id: "filipp-sviridenko",
    slug: "filipp-sviridenko",
    name: "Filipp Sviridenko",
    role: { value: "Co-Founder", evidence: confirmed },
    secondaryRole: { value: "Additional role to be confirmed", evidence: pending("E30") },
    shortBio: { value: "Biography to be supplied.", evidence: pending("E31") },
    photo: { evidence: photoPending },
    credentialIds: [],
    displayOrder: 2,
    featured: true,
    profilePage: false,
    assessmentRoles: [],
  },
  {
    id: "valerija-sevcenko",
    slug: "valerija-sevcenko",
    name: "Valerija Sevcenko",
    role: { value: "Role to be confirmed", evidence: pending("E32") },
    shortBio: { value: "Biography to be supplied.", evidence: pending("E32") },
    photo: { evidence: photoPending },
    credentialIds: [],
    displayOrder: 3,
    featured: true,
    profilePage: false,
    assessmentRoles: [],
  },
];

export const sortedTeam = () => [...team].sort((a, b) => a.displayOrder - b.displayOrder);
