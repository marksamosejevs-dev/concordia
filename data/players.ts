export type PositionGroup = "Goalkeeper" | "Defender" | "Midfielder" | "Forward" | "Unlisted";

export interface Player {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  fullName: string;
  /** ISO date, omitted entirely when not verifiable */
  dateOfBirth?: string;
  nationality?: string;
  positionGroup: PositionGroup;
  /** Display label, e.g. "ATTACKING MIDFIELD" */
  positionLabel: string;
  secondaryPosition?: string;
  club?: string;
  height?: string;
  preferredFoot?: "Left" | "Right";
  marketValue?: string;
  nationalTeam?: string;
  /** Path relative to /public, e.g. /players/slug.jpg — placeholder is shown until the real file exists at this path */
  photo: string;
  transfermarktUrl?: string;
  active: boolean;
}

/**
 * Roster supplied directly by Concordia Sports Agency. This list is authoritative
 * regarding representation — do not remove a player because a public database has
 * not yet reflected the relationship. Football facts (club, position, etc.) are
 * independently verified where noted; unverifiable fields are omitted rather than guessed.
 */
export const players: Player[] = [
  {
    id: "renars-varslavans",
    slug: "renars-varslavans",
    firstName: "Renārs",
    lastName: "Varslavāns",
    fullName: "Renārs Varslavāns",
    dateOfBirth: "2001-08-23",
    nationality: "Latvia",
    positionGroup: "Midfielder",
    positionLabel: "Attacking Midfield",
    club: "Riga FC",
    height: "177 cm",
    preferredFoot: "Right",
    nationalTeam: "Latvia National Team",
    photo: "/players/renars-varslavans.jpg",
    transfermarktUrl: "https://www.transfermarkt.com/renars-varslavans/profil/spieler/487756",
    active: true,
  },
  {
    id: "glebs-zaleiko",
    slug: "glebs-zaleiko",
    firstName: "Gļebs",
    lastName: "Žaleiko",
    fullName: "Gļebs Žaleiko",
    dateOfBirth: "2004-06-27",
    nationality: "Latvia",
    positionGroup: "Midfielder",
    positionLabel: "Central Midfield",
    club: "FS Jelgava",
    height: "181 cm",
    preferredFoot: "Right",
    nationalTeam: "Latvia National Team",
    photo: "/players/glebs-zaleiko.jpg",
    transfermarktUrl: "https://www.transfermarkt.com/glebs-zaleiko/profil/spieler/806953",
    active: true,
  },
  {
    id: "maksims-semesko",
    slug: "maksims-semesko",
    firstName: "Maksims",
    lastName: "Semeško",
    fullName: "Maksims Semeško",
    dateOfBirth: "2004-02-19",
    nationality: "Latvia",
    positionGroup: "Defender",
    positionLabel: "Centre-Back",
    club: "FS Jelgava",
    height: "193 cm",
    preferredFoot: "Right",
    nationalTeam: "Latvia U21 National Team",
    photo: "/players/maksims-semesko.jpg",
    transfermarktUrl: "https://www.transfermarkt.com/maksims-semesko/profil/spieler/895683",
    active: true,
  },
  {
    id: "kristofers-rekis",
    slug: "kristofers-rekis",
    firstName: "Kristofers",
    lastName: "Rēķis",
    fullName: "Kristofers Rēķis",
    dateOfBirth: "2003-01-21",
    nationality: "Latvia",
    positionGroup: "Midfielder",
    positionLabel: "Attacking Midfield",
    club: "FS Jelgava",
    height: "180 cm",
    preferredFoot: "Right",
    nationalTeam: "Former Latvia U21 National Team",
    photo: "/players/kristofers-rekis.jpg",
    transfermarktUrl: "https://www.transfermarkt.com/kristofers-rekis/profil/spieler/682317",
    active: true,
  },
  {
    id: "emile-ngai-eba",
    slug: "emile-ngai-eba",
    firstName: "Emile",
    lastName: "Ngai Eba",
    fullName: "Emile Ngai Eba",
    dateOfBirth: "2005-06-13",
    nationality: "Cameroon",
    positionGroup: "Unlisted",
    positionLabel: "Position Pending",
    club: "FK Smiltene",
    height: "165 cm",
    photo: "/players/emile-ngai-eba.jpg",
    transfermarktUrl: "https://www.transfermarkt.world/emile-ngai-eba/profil/spieler/1578312",
    active: true,
  },
  {
    id: "emilija-ambaine",
    slug: "emilija-ambaine",
    firstName: "Emīlija",
    lastName: "Ambaine",
    fullName: "Emīlija Ambaine",
    dateOfBirth: "2010-01-15",
    nationality: "Latvia",
    positionGroup: "Midfielder",
    positionLabel: "Midfielder",
    club: "Sassuolo",
    nationalTeam: "Latvia U17 National Team",
    photo: "/players/emilija-ambaine.jpg",
    active: true,
  },
  {
    id: "algirdas-grazis",
    slug: "algirdas-grazis",
    firstName: "Aļģirdas",
    lastName: "Gražis",
    fullName: "Aļģirdas Gražis",
    nationality: "Latvia",
    positionGroup: "Unlisted",
    positionLabel: "Position Pending",
    club: "Riga Mariners",
    photo: "/players/algirdas-grazis.jpg",
    transfermarktUrl: "https://www.transfermarkt.world/algirdas-grazis/profil/spieler/874306",
    active: true,
  },
];

export function getAge(dateOfBirth?: string): number | undefined {
  if (!dateOfBirth) return undefined;
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

export const positionFilters: { label: string; value: PositionGroup | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Goalkeepers", value: "Goalkeeper" },
  { label: "Defenders", value: "Defender" },
  { label: "Midfielders", value: "Midfielder" },
  { label: "Forwards", value: "Forward" },
];
