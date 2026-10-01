import { pending, type Evidence } from "@/lib/evidence";

export type VerifyAction = "VERIFY" | "VIEW" | "VISIT" | "VIEW PLAYERS" | "EXPLORE" | "WATCH" | "VIEW CREDENTIAL";

export interface VerifyEntry {
  id: string;
  claim: string;
  detail?: string;
  evidenceLabel: string;
  action: VerifyAction;
  href?: string;
  external?: boolean;
  documentImage?: string;
  /** Sensitive identifiers blurred by default in the document viewer (E5). */
  redact?: { label: string; top: string; left: string; width: string; height: string }[];
  howToCheck?: string;
  soWhatPlayer: string;
  soWhatParent: string;
  evidence: Evidence;
  compact: boolean; // appears in the homepage rail
}

export const verifyEntries: VerifyEntry[] = [
  {
    id: "fifa-licence",
    claim: "FIFA Licensed Football Agent",
    detail: "Marks Amosejevs · Licence No. 202406-7079",
    evidenceLabel: "FIFA Football Agent licence",
    action: "VERIFY",
    // Exact public-register URL is confirmed at E19; the document viewer + “how to check” cover it meanwhile.
    documentImage: "/assets/pathway/credentials/fifa-licence-card.png",
    redact: [{ label: "Connect ID", top: "49%", left: "5%", width: "34%", height: "8%" }, { label: "QR", top: "10%", left: "67%", width: "28%", height: "44%" }],
    howToCheck: "Search “Amosejevs” on FIFA’s public football agent register.",
    soWhatPlayer: "You can check who leads the team assessing you.",
    soWhatParent: "A licence you can check yourself, in about a minute.",
    evidence: { state: "document", ref: "D1", note: "Register re-check before launch (E19)" },
    compact: true,
  },
  {
    id: "minors",
    claim: "Authorised to represent minors",
    detail: "Recorded on the FIFA licence",
    evidenceLabel: "FIFA licence entry",
    action: "VERIFY",
    soWhatPlayer: "Relevant if you are under 18.",
    soWhatParent: "The rules that protect young players are rules he is authorised to work within.",
    evidence: pending("E19", "Exact FIFA terminology re-checked on the public register"),
    compact: true,
  },
  {
    id: "lawyer",
    claim: "Lawyer",
    evidenceLabel: "Bar / law register entry",
    action: "VERIFY",
    soWhatPlayer: "Someone reads the offer, not just the badge on it.",
    soWhatParent: "A contract mistake can cost far more than the assessment.",
    evidence: pending("E6", "Jurisdiction and public register link"),
    compact: true,
  },
  {
    id: "llm",
    claim: "Master’s degree in International and European Law",
    evidenceLabel: "Degree",
    action: "VIEW",
    soWhatPlayer: "Moving countries means moving between legal systems.",
    soWhatParent: "Cross-border moves are cross-border law.",
    evidence: pending("E7", "Institution and exact degree wording"),
    compact: false,
  },
  {
    id: "players-association",
    claim: "Co-Founder & Chairman, Latvian Professional Footballers Association",
    evidenceLabel: "Organisation",
    action: "VISIT",
    soWhatPlayer: "He has seen careers go wrong — and helped players through it.",
    soWhatParent: "Protecting players’ interests is his background, not a marketing line.",
    evidence: pending("E8", "Legal name, status, website, public source"),
    compact: true,
  },
  {
    id: "fifa-education",
    claim: "FIFA professional education for football agents",
    evidenceLabel: "Certificate",
    action: "VIEW CREDENTIAL",
    documentImage: "/assets/pathway/photos/fifa/fifa-education-certificate.jpg",
    soWhatPlayer: "Current knowledge — not a licence from years ago.",
    soWhatParent: "Evidence of a professional standard.",
    evidence: pending("E3", "Programme name, edition, year; certificate scan"),
    compact: false,
  },
  {
    id: "agency",
    claim: "Co-Founder, Concordia Sports Agency",
    evidenceLabel: "Company register",
    action: "VIEW",
    href: "/agency",
    soWhatPlayer: "Real player moves inform realistic advice.",
    soWhatParent: "A real agency, with real players, behind the service.",
    evidence: { state: "confirmed", note: "Registry link pending (E25 details now supplied: Reg. 40203574668)" },
    compact: false,
  },
  {
    id: "players",
    claim: "Players represented by Concordia Sports Agency",
    evidenceLabel: "Agency roster",
    action: "VIEW PLAYERS",
    href: "/players",
    soWhatPlayer: "Established internationals and young players starting out.",
    soWhatParent: "Real careers — clearly labelled as Agency work.",
    evidence: { state: "confirmed" },
    compact: true,
  },
  {
    id: "cases",
    claim: "Real career work",
    evidenceLabel: "Labelled cases",
    action: "EXPLORE",
    href: "/careers",
    soWhatPlayer: "See how real decisions were made.",
    soWhatParent: "Every case names which entity acted.",
    evidence: pending("E14", "Case facts and approvals"),
    compact: false,
  },
  {
    id: "testimonials",
    claim: "Player experiences",
    evidenceLabel: "Video testimonials",
    action: "WATCH",
    href: "/careers#testimonials",
    soWhatPlayer: "Hear it from players.",
    soWhatParent: "Unedited voices, with permission on file.",
    evidence: pending("E15", "Transcripts and publication permission"),
    compact: false,
  },
];
