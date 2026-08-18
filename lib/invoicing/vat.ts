import type { Language, VatTreatment, VatTreatmentKey } from "./types";

export function findVatTreatment(
  treatments: VatTreatment[],
  key: VatTreatmentKey,
): VatTreatment | undefined {
  return treatments.find((t) => t.key === key);
}

export function defaultVatNote(
  treatments: VatTreatment[],
  key: VatTreatmentKey,
  language: Language,
): string {
  const t = findVatTreatment(treatments, key);
  if (!t) return "";
  return language === "lv" ? t.noteLv : t.noteEn;
}

export function vatTreatmentLabel(t: VatTreatment, language: Language): string {
  return language === "lv" ? t.labelLv : t.labelEn;
}
