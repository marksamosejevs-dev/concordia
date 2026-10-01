import { pending, type Evidence } from "@/lib/evidence";

export interface Testimonial {
  id: string;
  speaker: string;
  relationship: "Represented player" | "Pathway member" | "Parent" | "Other";
  entity: "Concordia Sports Agency" | "European Pathway";
  source: string;
  transcript?: string;
  approvedExcerpt?: string;
  permission?: { file: string; date: string };
  topic: ("Trust" | "Honest advice" | "Career decision" | "Contract / legal" | "Transfer experience" | "Communication" | "Professionalism" | "Market knowledge" | "Career planning")[];
  media?: { type: "video"; src: string; poster?: string };
  language?: string;
  date?: string;
  evidence: Evidence;
}

export const testimonials: Testimonial[] = [
  {
    id: "victor",
    speaker: "Victor",
    relationship: "Other",
    entity: "Concordia Sports Agency",
    source: "Video supplied by Concordia",
    topic: [],
    media: { type: "video", src: "/assets/pathway/videos/testimonials/victor-testimonial.mp4" },
    evidence: pending("E15", "Transcript, speaker, relationship, permission"),
  },
];
