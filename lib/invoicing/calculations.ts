import type { Invoice, InvoiceLine } from "./types";

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export interface LineInput {
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  vatRate: number;
}

export interface LineTotals {
  grossAmount: number;
  discountAmount: number;
  lineSubtotal: number;
  lineVat: number;
  lineTotal: number;
}

export function computeLineTotals(line: LineInput): LineTotals {
  const grossAmount = round2(line.quantity * line.unitPrice);
  const discountAmount = round2(grossAmount * (line.discountPercent / 100));
  const lineSubtotal = round2(grossAmount - discountAmount);
  const lineVat = round2(lineSubtotal * (line.vatRate / 100));
  const lineTotal = round2(lineSubtotal + lineVat);
  return { grossAmount, discountAmount, lineSubtotal, lineVat, lineTotal };
}

export function recomputeLine(line: InvoiceLine): InvoiceLine {
  const totals = computeLineTotals(line);
  return { ...line, ...totals };
}

export interface InvoiceTotals {
  subtotal: number;
  discountTotal: number;
  vatTotal: number;
  total: number;
}

export function computeInvoiceTotals(lines: InvoiceLine[]): InvoiceTotals {
  const subtotal = round2(lines.reduce((sum, l) => sum + l.lineSubtotal, 0));
  const discountTotal = round2(lines.reduce((sum, l) => sum + l.discountAmount, 0));
  const vatTotal = round2(lines.reduce((sum, l) => sum + l.lineVat, 0));
  const total = round2(subtotal + vatTotal);
  return { subtotal, discountTotal, vatTotal, total };
}

export function recomputeInvoice(invoice: Invoice): Invoice {
  const lines = invoice.lines.map(recomputeLine);
  const totals = computeInvoiceTotals(lines);
  return { ...invoice, lines, ...totals };
}

export function formatMoney(amount: number, currency: string, language: "lv" | "en"): string {
  const locale = language === "lv" ? "lv-LV" : "en-GB";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}
