import { hold, pending, type Evidence } from "@/lib/evidence";

/** Documentary photography. Captions never imply partnership, endorsement or client relationship. */
export interface DocPhoto {
  id: string;
  src: string;
  w: number; h: number;
  alt: string;
  /** Caption shown publicly once facts clear; template placeholders mark missing facts. */
  caption: string;
  location?: string;
  evidence: Evidence;
}

const B = "/assets/pathway/photos/";
export const photos: Record<string, DocPhoto> = {
  pitch: { id: "pitch", src: B + "founder/marks-fifa-hq-pitch.jpg", w: 960, h: 1280, alt: "Marks Amosejevs standing on a pitch in front of a line of national flags", caption: "Marks Amosejevs at FIFA headquarters, Zurich.", location: "Zurich", evidence: pending("E10", "Year / context") },
  boardroom: { id: "boardroom", src: B + "founder/marks-fifa-hq-boardroom.jpg", w: 960, h: 1280, alt: "Marks Amosejevs in a meeting room in front of a wall of national flags", caption: "Marks Amosejevs at FIFA headquarters, Zurich.", location: "Zurich", evidence: pending("E10", "Year / context") },
  pressWall: { id: "pressWall", src: B + "fifa/marks-fifa-press-wall.jpg", w: 960, h: 1280, alt: "Marks Amosejevs holding a football in front of a branded backdrop", caption: "Marks Amosejevs at FIFA headquarters, Zurich.", location: "Zurich", evidence: pending("E10") },
  certificate: { id: "certificate", src: B + "fifa/fifa-education-certificate.jpg", w: 1280, h: 854, alt: "Marks Amosejevs receiving a FIFA education certificate", caption: "Marks Amosejevs receiving a certificate for FIFA professional education for football agents. [Programme · year — E3]", location: "Zurich", evidence: pending("E3/E4", "Programme name, edition, year; presenter title and permission") },
  clubChairman: { id: "clubChairman", src: B + "industry/fifa-hq-club-chairman.jpg", w: 960, h: 1280, alt: "Marks Amosejevs and a club executive holding a football", caption: "Marks Amosejevs with [NAME], [VERIFIED TITLE], at [EVENT], [YEAR].", location: "Zurich", evidence: pending("E10") },
  okmk: { id: "okmk", src: B + "industry/okmk-shirt-presentation.jpg", w: 960, h: 1280, alt: "Marks Amosejevs and a club official holding a shirt printed with his name", caption: "Marks Amosejevs with [NAME], [VERIFIED TITLE], at [EVENT], [YEAR].", evidence: pending("E10") },
  coaches: { id: "coaches", src: B + "industry/coaches-target-event.jpg", w: 960, h: 1280, alt: "Marks Amosejevs with two football coaches at an event", caption: "Marks Amosejevs with [NAMES], [VERIFIED TITLES], at [EVENT], [YEAR].", evidence: pending("E10") },
  stadium: { id: "stadium", src: B + "industry/stadium-visit.jpg", w: 960, h: 1280, alt: "Four men standing in an empty stadium stand", caption: "Marks Amosejevs at [STADIUM], [CITY], [YEAR].", evidence: pending("E10") },
  lff: { id: "lff", src: B + "industry/lff-event-group.jpg", w: 856, h: 1280, alt: "Group photograph outside the Latvian Football Federation building", caption: "Marks Amosejevs (left) at [EVENT], Latvian Football Federation, [YEAR].", evidence: pending("E10") },
  wembley: { id: "wembley", src: B + "industry/wembley-england-latvia.jpg", w: 1280, h: 960, alt: "Teams lining up before an international match in a full stadium", caption: "England v Latvia, Wembley Stadium. [DATE]", location: "London", evidence: pending("E10") },
  chairmanShirt: { id: "chairmanShirt", src: B + "industry/club-chairman-shirt.jpg", w: 964, h: 1280, alt: "Marks Amosejevs and a club executive holding a yellow club shirt", caption: "Marks Amosejevs with [NAME], [VERIFIED TITLE], [YEAR].", evidence: pending("E10") },
  office: { id: "office", src: B + "players/office-meeting.jpg", w: 1225, h: 1280, alt: "A meeting at a conference table in an office with framed football shirts", caption: "A working meeting. [CONTEXT — E11]", evidence: hold("E11", "Player relationship and consent") },
  associationFrame: { id: "associationFrame", src: B + "players/shirt-presentation-association-frame.jpg", w: 1004, h: 1280, alt: "Marks Amosejevs and a player holding a national-team shirt beneath a framed shirt", caption: "[CONTEXT — E11]", evidence: hold("E11") },
  captain: { id: "captain", src: B + "players/shirt-presentation-office.jpg", w: 960, h: 1280, alt: "Marks Amosejevs and a player holding a national-team shirt in an office", caption: "[CONTEXT — E11]", evidence: hold("E11") },
  korona: { id: "korona", src: B + "cases/korona-kielce-signing.jpg", w: 1280, h: 1058, alt: "Marks Amosejevs and a player holding a Korona Kielce shirt", caption: "[PLAYER] joins Korona Kielce, [YEAR]. Concordia Sports Agency — representation.", evidence: hold("E11/E14") },
  celebration: { id: "celebration", src: B + "editorial/latvia-celebration.jpg", w: 2000, h: 1333, alt: "Latvia players celebrating during a match", caption: "[PLAYER / MATCH / PHOTOGRAPHER — E2/E11]", evidence: hold("E2/E11") },
};

export const insideFootballStrip = ["wembley", "pitch", "boardroom", "clubChairman", "okmk", "coaches", "stadium", "certificate"];
export const archive = ["lff", "pressWall", "chairmanShirt", "office", "associationFrame", "captain", "korona", "celebration"];
