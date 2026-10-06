import { photos } from "./photos";

/**
 * PEOPLE & CREDENTIAL ASSETS — the single place to swap team portraits, the credential photo
 * and credential documents. Components read only from here (no hardcoded image paths).
 * `temporary: true` = an existing approved photo used until the founder supplies the final asset.
 * `focus` = object-position; `zoom` = crop-in factor so all portraits share one consistent framing.
 */
export interface PortraitAsset { src?: string; alt: string; focus: string; zoom: number; temporary: boolean; note: string }

/** Team portraits — one visual system (same ratio, crop, treatment). Final matching portraits to follow (E33). */
export const TEAM_PORTRAITS: Record<string, PortraitAsset> = {
  "marks-amosejevs": { src: photos.pitch.src, alt: "Marks Amosejevs", focus: "47% 46%", zoom: 2.9, temporary: true, note: "FIFA HQ pitch photo, cropped — replace with team portrait" },
  "filipp-sviridenko": { src: photos.cwcStand.src, alt: "Filipp Sviridenko", focus: "26% 26%", zoom: 1.35, temporary: true, note: "MetLife Stadium stand photo (founder to confirm file) — replace with team portrait" },
  "valerija-sevcenko": { alt: "Valerija Sevcenko", focus: "50% 30%", zoom: 1, temporary: true, note: "No photo yet — placeholder until team portrait" },
};

/** Credential section — a DIFFERENT Marks photograph from the team portrait. */
export const CREDENTIAL_PHOTO: PortraitAsset = { src: photos.boardroom.src, alt: "Marks Amosejevs at FIFA headquarters, Zurich", focus: "72% 48%", zoom: 1.15, temporary: true, note: "FIFA HQ boardroom photo — founder to confirm or replace" };

export interface CredentialDoc { key: string; title: string; detail?: string; src?: string; w: number; h: number; alt: string; status: "real" | "waiting" }

/** Credential documents. Never fabricated: a document renders only when its real asset is present. */
export const CREDENTIAL_DOCS: CredentialDoc[] = [
  { key: "fifa-licence", title: "FIFA Football Agent Licence", detail: "Licence 202406-7079 · status valid", src: "/assets/pathway/credentials/fifa-licence-card.png", w: 1010, h: 650, alt: "FIFA football agent licence of Marks Amosejevs — licence number 202406-7079, status valid, authorised to represent minors as of 26 August 2024 (Connect ID redacted)", status: "real" },
  // Title / institution / programme to be taken from the actual document once supplied — not invented.
  { key: "education", title: "Additional professional education", w: 1200, h: 850, alt: "", status: "waiting" },
];
