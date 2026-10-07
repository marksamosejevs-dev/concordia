/** Unit tests for the VAT / tax treatment matrix. Run: npm run test:tax */
import { creditUsable, creditExpiry } from "../lib/credit.ts";
import { ASSESSMENT_CREDIT } from "../content/products.ts";
import { taxTreatment, vatBreakdown, normaliseVatId, chargeAmount, LV_VAT_RATE, PRICE_TAX_NOTE } from "../lib/tax.ts";

let fail = 0;
const t = (name: string, ok: boolean, info = "") => { console.log(`${ok ? "PASS" : "FAIL"} — ${name}${info ? `  (${info})` : ""}`); if (!ok) fail++; };

const us = taxTreatment({ country: "US", buyerType: "consumer" });
t("US individual → outside the scope of Latvian VAT (Art. 59(c))", us.code === "OUTSIDE_SCOPE_NON_EU_B2C" && !us.chargesLatvianVat && us.rate === 0, us.code);
t("US individual → never described as \"0% VAT\"", !/0\s*%/.test(us.label + us.invoiceNote), us.invoiceNote);

const lv = taxTreatment({ country: "lv", buyerType: "consumer" });
t("Latvian individual → Latvian VAT at the configured rate", lv.code === "LV_VAT_B2C" && lv.chargesLatvianVat && lv.rate === LV_VAT_RATE);

const de = taxTreatment({ country: "DE", buyerType: "consumer" });
t("German individual → Latvian VAT (Art. 45, not OSS)", de.code === "LV_VAT_EU_B2C" && de.chargesLatvianVat);

const deB2B = taxTreatment({ country: "DE", buyerType: "business", vatId: "DE123456789", vatIdValid: true });
t("German business, valid VAT No. → reverse charge, no Latvian VAT", deB2B.code === "EU_B2B_REVERSE_CHARGE" && !deB2B.chargesLatvianVat && deB2B.invoiceNote.includes("DE123456789"));

const deBad = taxTreatment({ country: "DE", buyerType: "business", vatId: "DE000", vatIdValid: false });
t("German business, invalid VAT No. → treated as consumer (Latvian VAT)", deBad.code === "LV_VAT_EU_B2C" && deBad.chargesLatvianVat);

const deNoId = taxTreatment({ country: "DE", buyerType: "business" });
t("German business, no VAT No. → treated as consumer (Latvian VAT)", deNoId.code === "LV_VAT_EU_B2C");

const lvB2B = taxTreatment({ country: "LV", buyerType: "business", vatId: "LV40203574668", vatIdValid: true });
t("Latvian business → domestic Latvian VAT (no reverse charge)", lvB2B.code === "LV_VAT_B2B_DOMESTIC" && lvB2B.chargesLatvianVat);

const usB2B = taxTreatment({ country: "US", buyerType: "business" });
t("US business → outside the scope (Art. 44)", usB2B.code === "OUTSIDE_SCOPE_NON_EU_B2B" && !usB2B.chargesLatvianVat);

const ch = taxTreatment({ country: "CH", buyerType: "consumer" });
t("Swiss individual (non-EU Europe) → outside the scope", ch.code === "OUTSIDE_SCOPE_NON_EU_B2C");

const gb = taxTreatment({ country: "GB", buyerType: "consumer" });
t("UK individual (non-EU since 2021) → outside the scope", gb.code === "OUTSIDE_SCOPE_NON_EU_B2C");

const b1 = vatBreakdown(24900, lv);
t("$249 inclusive of Latvian VAT → net + VAT = gross", b1.net + b1.vat === 24900 && b1.vat > 0, `net ${b1.net} vat ${b1.vat}`);
t("$249 at 21% → VAT 43.21", LV_VAT_RATE !== 0.21 || (b1.net === 20579 && b1.vat === 4321), `${b1.vat}`);
const b2 = vatBreakdown(24900, us);
t("$249 outside scope → no VAT component, amount unchanged", b2.vat === 0 && b2.net === 24900 && b2.gross === 24900);
const b3 = vatBreakdown(39900, de);
t("$399 EU consumer → amount charged unchanged (tax-inclusive)", b3.gross === 39900 && b3.net + b3.vat === 39900);

t("normaliseVatId strips spaces/dashes", normaliseVatId("lv 4020-3574668") === "LV40203574668");
t("normaliseVatId maps Greek EL prefix", normaliseVatId("EL123456789") === "EL123456789");
t("normaliseVatId rejects non-EU numbers", normaliseVatId("US123456789") === null);
t("normaliseVatId rejects too-short numbers", normaliseVatId("DE12") === null);
t("normaliseVatId empty → null", normaliseVatId("") === null && normaliseVatId(undefined) === null);

t("Public tax note never claims \"0% VAT\"", !/0\s*%/.test(PRICE_TAX_NOTE));

// Price model (owner decision) — both supported
t("Final-price model: EU consumer charged $249", chargeAmount(24900, lv, "final_price_everywhere") === 24900);
t("Base+VAT model: EU consumer charged $249 + 21% = $301.29", LV_VAT_RATE !== 0.21 || chargeAmount(24900, lv, "base_price_plus_vat") === 30129);
t("Base+VAT model: US consumer still $249 (no Latvian VAT)", chargeAmount(24900, us, "base_price_plus_vat") === 24900);
t("Base+VAT model: $399 EU consumer → $482.79", LV_VAT_RATE !== 0.21 || chargeAmount(39900, de, "base_price_plus_vat") === 48279);
// $150 credit — no expiry (owner), single use, voided by refund/dispute
t("Credit has no expiry by default", ASSESSMENT_CREDIT.expiryDays === null && creditExpiry("2026-10-01T00:00:00Z") === undefined);
t("Credit usable years later when no window is configured", creditUsable({}, "2030-01-01T00:00:00Z"));
t("Credit not usable once used", !creditUsable({ usedAt: "2026-10-10" }, "2026-10-11"));
t("Credit not usable once voided (refund/dispute)", !creditUsable({ voidedAt: "2026-10-10" }, "2026-10-11"));
t("Configurable window still works if set later (30 days)", creditExpiry("2026-10-01T00:00:00.000Z", 30) === "2026-10-31T00:00:00.000Z" && !creditUsable({ expiresAt: "2026-10-31T00:00:00.000Z" }, "2026-11-01T00:00:00.000Z"));

console.log(fail ? `\n${fail} FAILED` : "\nAll tax tests passed.");
process.exit(fail ? 1 : 0);
