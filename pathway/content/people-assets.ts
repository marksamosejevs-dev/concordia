import { photos } from "./photos";

/**
 * PEOPLE & CREDENTIAL ASSETS — the single place to swap team portraits, the credential photo
 * and credential documents. Components read only from here (no hardcoded image paths).
 * `temporary: true` = an existing approved photo used until the founder supplies the final asset.
 * `focus` = object-position; `zoom` = crop-in factor so all portraits share one consistent framing.
 */
export interface PortraitAsset { src?: string; alt: string; focus: string; zoom: number; temporary: boolean; note: string }

/**
 * Team portraits — ONE upcoming professional photoshoot (same style for all three).
 * None supplied yet: every member uses the same reserved portrait slot. Add `src` per person when the shoot arrives.
 * Never substitute event/lifestyle photos here.
 */
export const TEAM_PORTRAITS: Record<string, PortraitAsset> = {
  "marks-amosejevs": { alt: "Marks Amosejevs", focus: "50% 30%", zoom: 1, temporary: true, note: "WAITING FOR PHOTOSHOOT PORTRAIT" },
  "filipp-sviridenko": { alt: "Filipp Sviridenko", focus: "50% 30%", zoom: 1, temporary: true, note: "WAITING FOR PHOTOSHOOT PORTRAIT" },
  "valerija-sevcenko": { alt: "Valerija Sevcenko", focus: "50% 30%", zoom: 1, temporary: true, note: "WAITING FOR PHOTOSHOOT PORTRAIT" },
};

/**
 * Hero secondary image — Emīlija Ambaine at U.S. Sassuolo (E12 guardian permission cleared).
 * The founder's Sassuolo photograph was shared in chat but has not been received as a file, so the slot is
 * PREPARED BUT EMPTY: commit the real file at `src` (then set w/h to its real size) and it renders automatically.
 * Never substitute the roster photo or any other image here. Caption = roster facts (name, club), never DOB.
 */
export const HERO_SECONDARY = { src: "/assets/pathway/photos/players/emilija-ambaine-sassuolo.jpg", w: 4, h: 3, alt: "Emīlija Ambaine, U.S. Sassuolo", position: "50% 35%", caption: ["Emīlija Ambaine", "U.S. Sassuolo"] as const, note: "WAITING FOR ORIGINAL SASSUOLO PHOTO FILE" };

/** Credential section — a DIFFERENT Marks photograph from the team portrait. */
export const CREDENTIAL_PHOTO: PortraitAsset = { src: photos.boardroom.src, alt: "Marks Amosejevs at FIFA headquarters, Zurich", focus: "72% 48%", zoom: 1.15, temporary: true, note: "FIFA HQ boardroom photo — founder to confirm or replace" };

export interface CredentialDoc { key: string; title: string; detail?: string; src?: string; w: number; h: number; alt: string; status: "real" | "waiting" }

/** Credential documents. Never fabricated: a document renders only when its real asset is present. */
export const CREDENTIAL_DOCS: CredentialDoc[] = [
  { key: "fifa-licence", title: "FIFA Football Agent Licence", detail: "Licence 202406-7079 · status valid", src: "/assets/pathway/credentials/fifa-licence-card.png", w: 1010, h: 650, alt: "FIFA football agent licence of Marks Amosejevs — licence number 202406-7079, status valid, authorised to represent minors as of 26 August 2024 (Connect ID redacted)", status: "real" },
  // Title / institution / programme to be taken from the actual document once supplied — not invented.
  { key: "education", title: "Additional professional education", w: 1200, h: 850, alt: "", status: "waiting" },
];
