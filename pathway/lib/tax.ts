/**
 * VAT / TAX TREATMENT — Concordia Sports Agency SIA (Latvian VAT payer, LV40203574668).
 * Pure module (no "@/" imports) — unit-tested by scripts/test-tax.mts.
 *
 * Classification (both products): personalised, human-delivered football career consultancy/advice.
 *  - NOT an electronically supplied service: substantial human involvement (Implementing Regulation 282/2011,
 *    Art. 7 — services must be "essentially automated and involving minimal human intervention"). Online delivery,
 *    online payment, digital documents, video calls or a dashboard do not change that.
 *  - Treated as "services of consultants … and other similar services" (VAT Directive 2006/112/EC, Art. 59(c)).
 *    The Pathway gives advice; it does not make club introductions (cf. Gray & Farrar: where introductions are the
 *    predominant element, a service is NOT consultancy). If the service ever becomes introduction/agency-led, revisit.
 *
 * Place of supply:
 *  - B2B (any country)  → where the customer is established (Art. 44; Latvian VAT Law Art. 19).
 *      Latvian business  → Latvian VAT 21%.
 *      Other-EU business with a VALID VAT number (VIES) → no Latvian VAT; "Reverse charge" (Art. 196, Art. 226(11a)).
 *      Non-EU business   → outside the scope of EU/Latvian VAT (no VAT charged; it is NOT "0% VAT").
 *  - B2C, customer resides OUTSIDE the EU → place of supply = customer's residence (Art. 59(c); Latvian VAT Law
 *      Art. 20) → outside the scope of Latvian VAT. Not "0%": no Latvian VAT arises at all.
 *  - B2C, customer resides IN the EU (incl. Latvia) → general rule, supplier's establishment (Art. 45) → Latvian VAT 21%.
 *    (Not an OSS case: OSS covers B2C supplies taxable in the customer's Member State; these are taxable in Latvia.)
 *
 * Pricing: public prices ($249, $399/month) are FINAL prices for consumers. Where Latvian VAT applies, it is
 * INCLUDED in that price (EU consumer price rules require tax-inclusive prices); elsewhere no VAT is added.
 * The VAT component is computed for invoices/accounting — the amount charged never changes by location.
 * ACCOUNTANT CONFIRMATION points are marked ⚑ (see docs/PRODUCTION_SETUP.md → "Accountant").
 */
/** Latvian standard VAT rate. Not hardcoded into logic: override with PATHWAY_LV_VAT_RATE (e.g. "0.21") if the rate changes. */
const envRate = typeof process !== "undefined" ? Number(process.env?.PATHWAY_LV_VAT_RATE) : NaN;
export const LV_VAT_RATE = Number.isFinite(envRate) && envRate > 0 && envRate < 1 ? envRate : 0.21;
const PCT = `${Math.round(LV_VAT_RATE * 1000) / 10}%`;

export const EU_COUNTRIES = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE"] as const;
export const isEU = (cc: string) => (EU_COUNTRIES as readonly string[]).includes(cc.toUpperCase());

export type BuyerType = "consumer" | "business";
export type TaxCode = "LV_VAT_B2C" | "LV_VAT_EU_B2C" | "LV_VAT_B2B_DOMESTIC" | "EU_B2B_REVERSE_CHARGE" | "OUTSIDE_SCOPE_NON_EU_B2C" | "OUTSIDE_SCOPE_NON_EU_B2B";

export interface TaxInput { country: string; buyerType: BuyerType; vatId?: string; vatIdValid?: boolean }
export interface TaxResult {
  code: TaxCode;
  chargesLatvianVat: boolean;
  rate: number;              // 0 when no Latvian VAT arises
  label: string;             // short, for admin / receipts
  invoiceNote: string;       // mention on the invoice ⚑ wording to be confirmed by the accountant
  basis: string;             // legal basis (internal)
  vatReturn: string;         // Latvian VAT return treatment ⚑
}

export function taxTreatment(i: TaxInput): TaxResult {
  const cc = i.country.toUpperCase();
  if (i.buyerType === "business") {
    if (cc === "LV") return { code: "LV_VAT_B2B_DOMESTIC", chargesLatvianVat: true, rate: LV_VAT_RATE, label: `Latvian VAT ${PCT} (domestic B2B)`, invoiceNote: `PVN ${PCT} / VAT ${PCT}`, basis: "Art. 44 VAT Directive; Latvian VAT Law Art. 19 — customer established in Latvia", vatReturn: `Domestic taxable supply at ${PCT} ⚑` };
    if (isEU(cc) && i.vatId && i.vatIdValid) return { code: "EU_B2B_REVERSE_CHARGE", chargesLatvianVat: false, rate: 0, label: "Reverse charge (EU B2B)", invoiceNote: "Reverse charge — VAT to be accounted for by the recipient (Art. 196, Directive 2006/112/EC). Customer VAT No.: " + i.vatId, basis: "Art. 44 + Art. 196 VAT Directive; Latvian VAT Law Art. 19", vatReturn: "Services to EU taxable persons — VAT return + EC Sales List (PVN 2) ⚑" };
    if (!isEU(cc)) return { code: "OUTSIDE_SCOPE_NON_EU_B2B", chargesLatvianVat: false, rate: 0, label: "Outside the scope of EU VAT (non-EU business)", invoiceNote: "Not subject to Latvian VAT — place of supply outside the EU (Art. 44, Directive 2006/112/EC)", basis: "Art. 44 VAT Directive; Latvian VAT Law Art. 19", vatReturn: "Supplies with place of supply outside Latvia (VAT return line 48.2) ⚑" };
    // EU business without a valid VAT number → treated as a consumer (Implementing Regulation 282/2011, Art. 18).
  }
  if (cc === "LV") return { code: "LV_VAT_B2C", chargesLatvianVat: true, rate: LV_VAT_RATE, label: `Latvian VAT ${PCT} (included)`, invoiceNote: `Price includes PVN/VAT ${PCT}`, basis: "Art. 45 VAT Directive; Latvian VAT Law Art. 19 (supplier established in Latvia)", vatReturn: `Domestic taxable supply at ${PCT} ⚑` };
  if (isEU(cc)) return { code: "LV_VAT_EU_B2C", chargesLatvianVat: true, rate: LV_VAT_RATE, label: `Latvian VAT ${PCT} (included, EU consumer)`, invoiceNote: `Price includes PVN/VAT ${PCT}`, basis: "Art. 45 VAT Directive — consultancy to EU consumers taxed where the supplier is established", vatReturn: `Taxable supply at ${PCT} (not OSS) ⚑` };
  return { code: "OUTSIDE_SCOPE_NON_EU_B2C", chargesLatvianVat: false, rate: 0, label: "Outside the scope of Latvian VAT (customer outside the EU)", invoiceNote: "Not subject to Latvian VAT — place of supply outside the EU (Art. 59(c), Directive 2006/112/EC)", basis: "Art. 59(c) VAT Directive; Latvian VAT Law Art. 20", vatReturn: "Supplies with place of supply outside Latvia (VAT return line 48.2) ⚑" };
}

/** VAT contained in a tax-inclusive gross amount (in cents). */
export function vatBreakdown(grossCents: number, t: TaxResult): { net: number; vat: number; gross: number } {
  if (!t.chargesLatvianVat) return { net: grossCents, vat: 0, gross: grossCents };
  const net = Math.round(grossCents / (1 + t.rate));
  return { net, vat: grossCents - net, gross: grossCents };
}

/** Normalises "LV 4020-3574668" → "LV40203574668"; returns null if it can't be an EU VAT number. */
export function normaliseVatId(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const pre = s.slice(0, 2) === "EL" ? "GR" : s.slice(0, 2);
  return isEU(pre) && s.length >= 8 && s.length <= 14 ? s : null;
}

/** Customer-facing price note — accurate for every market (no false universal "VAT included/excluded"). */
export const PRICE_TAX_NOTE = "Prices in USD. Where Latvian VAT applies (customers in the EU), it is included in the price. No VAT is added for customers outside the EU.";
