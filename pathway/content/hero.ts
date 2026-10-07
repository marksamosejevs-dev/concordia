import { photos } from "./photos";
import { HERO_SECONDARY, HERO_SUPPORTING } from "./people-assets";

/**
 * Hero art direction — swap the image here after founder review (any id from content/photos.ts).
 * `position` = object-position of the crop inside the masked frame.
 */
export const HERO = {
  photo: photos.korona,
  position: "62% 30%",
  /** Minimal caption under the frame (founder-supplied facts only). */
  caption: "Marks Amosejevs with Viktors Ohvovoriole · transfer to Korona Kielce",
  /** Secondary opening image (lower in the hierarchy): Emīlija Ambaine, U.S. Sassuolo. Slot prepared; renders the photo only when the real file exists (see people-assets.ts). */
  secondary: HERO_SECONDARY,
  /** Supporting opening image (smallest): Filipp Sviridenko at MetLife Stadium, left of Emīlija on desktop. */
  supporting: HERO_SUPPORTING,
  /** Other plausible hero images, in order of preference. */
  alternates: [photos.cwcStand, photos.okmk, photos.chairmanShirt],
};

