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
  /** Short pending line shown only in review until the founder supplies it. */
  extendedBio?: Field;
  /** Team-card line (2–3 short lines). Falls back to shortBio. */
  teamLine?: Field;
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
    role: { value: "Co-Founder", evidence: confirmed },
    secondaryRole: { value: "FIFA Licensed Football Agent", evidence: { state: "document", ref: "D1" } },
    shortBio: {
      // Founder-supplied wording (Round 3).
      value: "FIFA Licensed Football Agent working with professional and emerging players across European football. Co-Founder of the Latvian Professional Footballers Association and a sports lawyer with experience across player representation, contracts and football regulation.",
      evidence: { state: "confirmed", ref: "FS-R3", note: "Founder-supplied team description, Round 3" },
    },
    // Team card (approved earlier wording, condensed). The full founder description is used in the credential section.
    teamLine: { value: "FIFA Licensed Football Agent. Leads European Pathway and oversees its football assessment framework.", evidence: confirmed },
    photo: { evidence: photoPending },
    credentialIds: ["fifa-licence", "minors", "lawyer", "llm", "players-association", "fifa-education", "agency"],
    displayOrder: 1,
    featured: true,
    profilePage: false, // Round 3: no separate biography pages
    assessmentRoles: ["seniorReview", "escalation"],
  },
  {
    id: "filipp-sviridenko",
    slug: "filipp-sviridenko",
    name: "Filipp Sviridenko",
    role: { value: "Co-Founder", evidence: confirmed },
    secondaryRole: { value: "Additional role to be confirmed", evidence: pending("E30") },
    // Approved facts only (F13): Co-Founder. Personal background pending founder wording (E31).
    shortBio: { value: "Co-founder of Concordia Soccer · European Pathway — building the service that brings professional football career thinking to players beyond an agency roster.", evidence: confirmed },
    extendedBio: { value: "[Background, responsibilities and languages — founder to confirm]", evidence: pending("E31") },
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
    role: { value: "Concordia Team", evidence: { state: "confirmed", ref: "FS-R3", note: "Founder-approved label, Round 3; formal title still E32" } },
    shortBio: { value: "Part of the Concordia team behind European Pathway.", evidence: confirmed },
    extendedBio: { value: "[Role and responsibilities — founder to confirm]", evidence: pending("E32") },
    photo: { evidence: photoPending },
    credentialIds: [],
    displayOrder: 3,
    featured: true,
    profilePage: false,
    assessmentRoles: [],
  },
];

export const sortedTeam = () => [...team].sort((a, b) => a.displayOrder - b.displayOrder);
