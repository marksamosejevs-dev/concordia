import { photos } from "./photos";

/**
 * Hero art direction — swap the image here after founder review (any id from content/photos.ts).
 * `position` = object-position of the crop inside the masked frame.
 */
export const HERO = {
  photo: photos.cwcStand,
  position: "30% 28%",
  /** Other plausible hero images, in order of preference. */
  alternates: [photos.cwcPitchBlue, photos.cwcPitchWhite, photos.okmk],
};

/** Illustrative profile shown in the hero UI card; cycles through markets in sync with the map. Fictional. */
export const HERO_PROFILE = {
  title: "Centre midfielder · 20",
  meta: "US college · EU passport",
  markets: [{ iso: "PL", name: "Poland", fit: 82, level: "2nd tier" }, { iso: "CZ", name: "Czechia", fit: 74, level: "2nd tier" }, { iso: "SE", name: "Sweden", fit: 68, level: "3rd tier" }, { iso: "PT", name: "Portugal", fit: 61, level: "3rd tier" }],
};
