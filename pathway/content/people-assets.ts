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
 * Hero secondary image — Emīlija Ambaine, U.S. Sassuolo (E12 guardian permission cleared).
 * The founder-supplied original, saved unchanged (1280×960). The frame uses the photo's own 4:3 ratio, so nothing
 * is cropped away. Never substitute the roster photo or any other image. Caption = name + club only, never DOB.
 */
export const HERO_SECONDARY = { src: "/assets/pathway/photos/players/emilija-ambaine-sassuolo.jpg", w: 1280, h: 960, alt: "Emīlija Ambaine holding a U.S. Sassuolo shirt", position: "45% 40%", caption: ["Emīlija Ambaine", "U.S. Sassuolo"] as const, note: "Founder-supplied original" };

/**
 * Hero supporting image — Filipp Sviridenko at MetLife Stadium (founder-identified "Filipp MetLife photo").
 * Editorial context only: NOT Filipp's Team portrait (Team portraits come from the future photoshoot).
 * Shown at the photo's own 3:4 ratio (no crop).
 */
export const HERO_SUPPORTING = { src: photos.cwcStand.src, w: photos.cwcStand.w, h: photos.cwcStand.h, alt: "Filipp Sviridenko in the stand at MetLife Stadium", position: "30% 50%", caption: ["Filipp Sviridenko", "MetLife Stadium"] as const };

/** Credential section — a DIFFERENT Marks photograph from the team portrait. */
export const CREDENTIAL_PHOTO: PortraitAsset = { src: photos.boardroom.src, alt: "Marks Amosejevs at FIFA headquarters, Zurich", focus: "72% 48%", zoom: 1.15, temporary: true, note: "FIFA HQ boardroom photo — founder to confirm or replace" };

export interface CredentialDoc { key: string; title: string; detail?: string; src?: string; w: number; h: number; alt: string; status: "real" | "waiting" }

/** Credential documents. Never fabricated: a document renders only when its real asset is present. */
export const CREDENTIAL_DOCS: CredentialDoc[] = [
  { key: "fifa-licence", title: "FIFA Football Agent Licence", detail: "Licence 202406-7079 · status valid", src: "/assets/pathway/credentials/fifa-licence-card.png", w: 1010, h: 650, alt: "FIFA football agent licence of Marks Amosejevs — licence number 202406-7079, status valid, authorised to represent minors as of 26 August 2024", status: "real" },
  // Founder-supplied certificate scan (PDF, 6 Oct 2026) — wording taken from the document itself.
  { key: "education", title: "FIFA Executive Programme in Football Agency", detail: "2nd edition · graduation 13 June 2025", src: "/assets/pathway/credentials/fifa-executive-programme-certificate.jpg", w: 2464, h: 1711, alt: "FIFA certificate confirming the successful participation of Marks Amosejevs in the Executive Programme in Football Agency, 2nd edition, graduation on 13 June 2025", status: "real" },
];
