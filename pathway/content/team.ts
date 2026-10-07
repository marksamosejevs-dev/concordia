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
  /** Team-card bio as short paragraphs (founder-supplied). Preferred over teamLine/shortBio. */
  teamBio?: Field<string[]>;
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
    role: { value: "Co-Founder & CEO", evidence: { state: "confirmed", ref: "FS-R6", note: "Founder-supplied, Round 6" } },
    secondaryRole: { value: "FIFA Licensed Football Agent", evidence: { state: "document", ref: "D1" } },
    shortBio: {
      // Founder-supplied wording (Round 3).
      value: "FIFA Licensed Football Agent working with professional and emerging players across European football. Co-Founder of the Latvian Professional Footballers Association and a sports lawyer with experience across player representation, contracts and football regulation.",
      evidence: { state: "confirmed", ref: "FS-R3", note: "Founder-supplied team description, Round 3" },
    },
    // Team card (approved earlier wording, condensed). The full founder description is used in the credential section.
    teamLine: { value: "FIFA Licensed Football Agent. Leads European Pathway and oversees its football assessment framework.", evidence: confirmed },
    teamBio: { value: [
      "Leads European Pathway and oversees its football assessment framework.",
      "Marks works with players across senior and youth international football, bringing direct European football-market experience into each player’s career strategy.",
    ], evidence: { state: "confirmed", ref: "FS-R6", note: "Founder-supplied team copy, Round 6" } },
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
    role: { value: "Co-Founder & COO", evidence: { state: "confirmed", ref: "FS-R6", note: "Founder-supplied, Round 6 (resolves E30)" } },
    secondaryRole: { value: "European Pathway", evidence: { state: "confirmed", ref: "FS-R6" } },
    shortBio: { value: "Co-founder of Concordia Soccer · European Pathway — building the service that brings professional football career thinking to players beyond an agency roster.", evidence: confirmed },
    // Founder-supplied team copy, Round 6 (resolves E31). LPFA role stated exactly as supplied.
    teamBio: { value: [
      "Filipp is building the service behind European Pathway — bringing professional football career thinking to players beyond a traditional agency roster. He is Chairman of the Latvian Professional Footballers Association, which works to protect the rights and interests of football players in Latvia.",
      "A legal professional with more than 20 years of experience, Filipp also brings experience from banking and finance. As a father of two, with his elder son involved in judo, he also understands first-hand many of the decisions and concerns parents face when supporting a young athlete with international ambitions.",
    ], evidence: { state: "confirmed", ref: "FS-R6", note: "Founder-supplied team copy, Round 6" } },
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
    role: { value: "Client Assistant Manager", evidence: { state: "confirmed", ref: "FS-R6", note: "Founder-supplied title, Round 6 (resolves E32)" } },
    secondaryRole: { value: "European Pathway", evidence: { state: "confirmed", ref: "FS-R6" } },
    shortBio: { value: "Part of the Concordia team behind European Pathway.", evidence: confirmed },
    // Founder-supplied team copy, Round 6. No details beyond the supplied wording.
    teamBio: { value: [
      "Valerija is part of the Concordia team behind European Pathway, supporting players and families with the day-to-day side of their journey.",
      "As a mother and the wife of a former national-team hockey player, she also understands professional sport from the family side — helping the team better understand the practical needs and concerns of players and their families.",
    ], evidence: { state: "confirmed", ref: "FS-R6", note: "Founder-supplied team copy, Round 6" } },
    photo: { evidence: photoPending },
    credentialIds: [],
    displayOrder: 3,
    featured: true,
    profilePage: false,
    assessmentRoles: [],
  },
];

export const sortedTeam = () => [...team].sort((a, b) => a.displayOrder - b.displayOrder);
