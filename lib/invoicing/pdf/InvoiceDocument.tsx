import path from "node:path";
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { amountToWords } from "../numberToWords";
import type { CompanySettings, Invoice } from "../types";
import { getLabels } from "./labels";

const FONT_DIR = path.join(process.cwd(), "public", "fonts", "invoicing");

let fontsRegistered = false;
function ensureFontsRegistered() {
  if (fontsRegistered) return;
  Font.register({
    family: "Noto Sans",
    fonts: [
      { src: path.join(FONT_DIR, "NotoSans-Regular.ttf"), fontWeight: 400 },
      { src: path.join(FONT_DIR, "NotoSans-Bold.ttf"), fontWeight: 700 },
      { src: path.join(FONT_DIR, "NotoSans-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
    ],
  });
  // react-pdf's default word-wrapping can split words at hyphenation points
  // that don't apply outside English; disable to keep Latvian words intact.
  Font.registerHyphenationCallback((word) => [word]);
  fontsRegistered = true;
}

const DARK_GREEN = "#0B2620";
const CREAM = "#F3EEE3";
const TEXT = "#242424";
const MUTED = "#5B5F5C";
const BORDER = "#C9CCC7";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Sans",
    fontSize: 9.5,
    color: TEXT,
    paddingBottom: 70,
  },
  headerBand: {
    backgroundColor: DARK_GREEN,
    paddingHorizontal: 36,
    paddingVertical: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoImage: { width: 150, maxHeight: 48, objectFit: "contain" },
  wordmark: { color: CREAM, fontSize: 20, fontWeight: 700, letterSpacing: 1 },
  wordmarkSub: { color: CREAM, fontSize: 7, letterSpacing: 2, marginTop: 2, opacity: 0.85 },
  headerRight: { alignItems: "flex-end" },
  invoiceTitle: { color: CREAM, fontSize: 18, fontWeight: 700, letterSpacing: 1, marginBottom: 6 },
  headerRow: { flexDirection: "row", marginTop: 2 },
  headerLabel: { color: CREAM, fontSize: 8, opacity: 0.8, width: 90, textAlign: "right", marginRight: 8 },
  headerValue: { color: CREAM, fontSize: 9, fontWeight: 700, textAlign: "right" },
  body: { paddingHorizontal: 36, paddingTop: 20 },
  partiesRow: { flexDirection: "row", marginBottom: 14 },
  partyBlock: { flex: 1, paddingRight: 12 },
  partyLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: DARK_GREEN,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 3,
  },
  partyName: { fontSize: 10.5, fontWeight: 700, marginBottom: 2 },
  partyLine: { fontSize: 8.7, color: TEXT, marginBottom: 1.5, lineHeight: 1.3 },
  partyLineLabel: { color: MUTED },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  metaItem: { width: "50%", flexDirection: "row", marginBottom: 3, paddingRight: 10 },
  metaLabel: { fontSize: 8.5, color: MUTED, width: 110 },
  metaValue: { fontSize: 8.7, fontWeight: 700, flex: 1 },
  table: { marginTop: 6, marginBottom: 4 },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: DARK_GREEN,
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.75,
    borderBottomColor: BORDER,
    paddingVertical: 5,
  },
  th: { color: CREAM, fontSize: 8, fontWeight: 700, paddingHorizontal: 4 },
  td: { fontSize: 8.7, paddingHorizontal: 4 },
  colNo: { width: "5%" },
  colDesc: { width: "37%" },
  colUnit: { width: "10%" },
  colQty: { width: "10%", textAlign: "right" },
  colPrice: { width: "13%", textAlign: "right" },
  colDiscount: { width: "10%", textAlign: "right" },
  colAmount: { width: "15%", textAlign: "right" },
  totalsWrap: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  totalsBox: { width: "55%" },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5 },
  totalsLabel: { fontSize: 9, color: MUTED },
  totalsValue: { fontSize: 9, fontWeight: 700 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1.25,
    borderTopColor: DARK_GREEN,
  },
  grandTotalLabel: { fontSize: 11, fontWeight: 700, color: DARK_GREEN },
  grandTotalValue: { fontSize: 12, fontWeight: 700, color: DARK_GREEN },
  vatNote: { fontSize: 7.8, color: MUTED, marginTop: 6, lineHeight: 1.4 },
  amountWords: { fontSize: 8.5, fontStyle: "italic", marginTop: 8, color: TEXT },
  sectionBlock: { marginTop: 14 },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: DARK_GREEN,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  sectionText: { fontSize: 8.7, lineHeight: 1.4 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: DARK_GREEN,
    paddingHorizontal: 36,
    paddingVertical: 10,
  },
  footerText: { color: CREAM, fontSize: 7.5, textAlign: "center", lineHeight: 1.5 },
});

function resolveLogoSrc(logoUrl: string): string | undefined {
  if (!logoUrl) return undefined;
  if (/^https?:\/\//i.test(logoUrl)) return logoUrl;
  if (logoUrl.startsWith("/")) return path.join(process.cwd(), "public", logoUrl);
  return logoUrl;
}

interface Props {
  invoice: Invoice;
  company: CompanySettings;
}

export function InvoiceDocument({ invoice, company }: Props) {
  ensureFontsRegistered();
  const t = getLabels(invoice.language);
  const locale = invoice.language === "lv" ? "lv-LV" : "en-GB";
  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: invoice.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  const dateFmt = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  };

  const hasDiscount = invoice.lines.some((l) => l.discountPercent > 0);
  const vatBreakdown = Object.values(
    invoice.lines.reduce<Record<string, { rate: number; base: number; vat: number }>>((acc, l) => {
      const key = String(l.vatRate);
      acc[key] = acc[key] ?? { rate: l.vatRate, base: 0, vat: 0 };
      acc[key].base += l.lineSubtotal;
      acc[key].vat += l.lineVat;
      return acc;
    }, {}),
  ).sort((a, b) => b.rate - a.rate);

  const logoSrc = resolveLogoSrc(company.logoUrl);
  const customer = invoice.customerSnapshot;

  const shipmentFields: Array<[string, string]> = (
    [
      [t.customerReference, invoice.customerReference],
      [t.purchaseOrder, invoice.purchaseOrderNumber],
      [t.contractNumber, invoice.contractNumber],
      [t.incoterms, invoice.incoterms],
      [t.pickupAddress, invoice.pickupAddress],
      [t.pickupDate, invoice.pickupDate ? dateFmt(invoice.pickupDate) : ""],
    ] satisfies Array<[string, string]>
  ).filter(([, v]) => v);

  return (
    <Document
      title={`${invoice.number} — ${customer.legalName}`}
      author={company.legalName}
      language={invoice.language}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerBand}>
          <View>
            {logoSrc ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={logoSrc} style={styles.logoImage} />
            ) : (
              <>
                <Text style={styles.wordmark}>{company.brandName || company.legalName}</Text>
                {company.brandName ? <Text style={styles.wordmarkSub}>{company.legalName}</Text> : null}
              </>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>{t.invoiceTitle}</Text>
            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>{t.invoiceNo}</Text>
              <Text style={styles.headerValue}>{invoice.number}</Text>
            </View>
            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>{t.invoiceDate}</Text>
              <Text style={styles.headerValue}>{dateFmt(invoice.issueDate)}</Text>
            </View>
            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>{t.dueDate}</Text>
              <Text style={styles.headerValue}>{dateFmt(invoice.dueDate)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.partiesRow}>
            <View style={styles.partyBlock}>
              <Text style={styles.partyLabel}>{t.supplier}</Text>
              <Text style={styles.partyName}>{company.legalName}</Text>
              <Text style={styles.partyLine}>
                <Text style={styles.partyLineLabel}>{t.registrationNo}: </Text>
                {company.registrationNumber}
              </Text>
              <Text style={styles.partyLine}>
                <Text style={styles.partyLineLabel}>{t.vatNo}: </Text>
                {company.vatNumber}
              </Text>
              <Text style={styles.partyLine}>
                <Text style={styles.partyLineLabel}>{t.registeredAddress}: </Text>
                {company.legalAddress}
              </Text>
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.partyLine, { fontWeight: 700, color: DARK_GREEN }]}>{t.bankDetails}</Text>
                <Text style={styles.partyLine}>
                  <Text style={styles.partyLineLabel}>{t.bankName}: </Text>
                  {company.bankName}
                </Text>
                <Text style={styles.partyLine}>
                  <Text style={styles.partyLineLabel}>{t.iban}: </Text>
                  {company.iban}
                </Text>
                <Text style={styles.partyLine}>
                  <Text style={styles.partyLineLabel}>{t.swift}: </Text>
                  {company.swift}
                </Text>
              </View>
            </View>

            <View style={styles.partyBlock}>
              <Text style={styles.partyLabel}>{t.customer}</Text>
              <Text style={styles.partyName}>{customer.legalName}</Text>
              {customer.registrationNumber ? (
                <Text style={styles.partyLine}>
                  <Text style={styles.partyLineLabel}>{t.registrationNo}: </Text>
                  {customer.registrationNumber}
                </Text>
              ) : null}
              {customer.vatNumber ? (
                <Text style={styles.partyLine}>
                  <Text style={styles.partyLineLabel}>{t.vatNo}: </Text>
                  {customer.vatNumber}
                </Text>
              ) : null}
              <Text style={styles.partyLine}>
                <Text style={styles.partyLineLabel}>{t.registeredAddress}: </Text>
                {customer.legalAddress}
              </Text>
              {customer.contactPerson ? (
                <Text style={styles.partyLine}>{customer.contactPerson}</Text>
              ) : null}
              {customer.email ? <Text style={styles.partyLine}>{customer.email}</Text> : null}
            </View>
          </View>

          {shipmentFields.length > 0 && (
            <View style={styles.metaGrid}>
              {shipmentFields.map(([label, value]) => (
                <View style={styles.metaItem} key={label}>
                  <Text style={styles.metaLabel}>{label}</Text>
                  <Text style={styles.metaValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, styles.colNo]}>{t.no}</Text>
              <Text style={[styles.th, styles.colDesc]}>{t.description}</Text>
              <Text style={[styles.th, styles.colUnit]}>{t.unit}</Text>
              <Text style={[styles.th, styles.colQty]}>{t.quantity}</Text>
              <Text style={[styles.th, styles.colPrice]}>{t.unitPrice}</Text>
              {hasDiscount && <Text style={[styles.th, styles.colDiscount]}>{t.discount}</Text>}
              <Text style={[styles.th, styles.colAmount]}>{t.amount}</Text>
            </View>
            {invoice.lines.map((line, idx) => (
              <View style={styles.tableRow} key={line.id} wrap={false}>
                <Text style={[styles.td, styles.colNo]}>{idx + 1}</Text>
                <Text style={[styles.td, styles.colDesc]}>
                  {invoice.language === "lv" ? line.descriptionLv : line.descriptionEn}
                </Text>
                <Text style={[styles.td, styles.colUnit]}>{line.unit}</Text>
                <Text style={[styles.td, styles.colQty]}>{line.quantity}</Text>
                <Text style={[styles.td, styles.colPrice]}>{money(line.unitPrice)}</Text>
                {hasDiscount && (
                  <Text style={[styles.td, styles.colDiscount]}>
                    {line.discountPercent > 0 ? `${line.discountPercent}%` : "—"}
                  </Text>
                )}
                <Text style={[styles.td, styles.colAmount]}>{money(line.lineSubtotal)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsWrap}>
            <View style={styles.totalsBox}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>{t.subtotal}</Text>
                <Text style={styles.totalsValue}>{money(invoice.subtotal)}</Text>
              </View>
              {invoice.discountTotal > 0 && (
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>{t.discount}</Text>
                  <Text style={styles.totalsValue}>-{money(invoice.discountTotal)}</Text>
                </View>
              )}
              {vatBreakdown.map((row) => (
                <View style={styles.totalsRow} key={row.rate}>
                  <Text style={styles.totalsLabel}>
                    {t.vat} {row.rate}%
                  </Text>
                  <Text style={styles.totalsValue}>{money(row.vat)}</Text>
                </View>
              ))}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>{t.total}</Text>
                <Text style={styles.grandTotalValue}>{money(invoice.total)}</Text>
              </View>
              {invoice.vatNote ? <Text style={styles.vatNote}>{invoice.vatNote}</Text> : null}
              <Text style={styles.amountWords}>
                {t.amountInWords}: {amountToWords(invoice.total, invoice.currency, invoice.language)}
              </Text>
            </View>
          </View>

          {invoice.paymentTerms ? (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>{t.paymentTerms}</Text>
              <Text style={styles.sectionText}>{invoice.paymentTerms}</Text>
            </View>
          ) : null}

          {invoice.notes ? (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>{t.notes}</Text>
              <Text style={styles.sectionText}>{invoice.notes}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {t.preparedElectronically}
            {"\n"}
            {[company.legalAddress, company.phone, company.email, company.website].filter(Boolean).join("   |   ")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
