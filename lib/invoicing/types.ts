// Shared types for the SIA Green Energy invoicing system.

export type Language = "lv" | "en";

export type Market = "LV" | "INTL";

export type Currency = "EUR" | "GBP" | "USD" | (string & {});

export interface CompanySettings {
  legalName: string;
  registrationNumber: string;
  vatNumber: string;
  legalAddress: string;
  bankName: string;
  iban: string;
  swift: string;
  email: string;
  phone: string;
  website: string;
  /** Any other legally required information (e.g. registered capital, board members). */
  additionalInfo: string;
  /** Optional path/URL to a real logo image. Falls back to a text wordmark when empty. */
  logoUrl: string;
}

export type VatTreatmentKey =
  | "lv_standard"
  | "lv_reduced"
  | "zero_rate"
  | "reverse_charge"
  | "intra_eu"
  | "export_non_eu"
  | "custom";

export interface VatTreatment {
  key: VatTreatmentKey;
  labelLv: string;
  labelEn: string;
  /** Default VAT rate in percent, or null when the rate must be entered per invoice (custom). */
  rate: number | null;
  noteLv: string;
  noteEn: string;
}

export interface NumberingConfig {
  prefix: string;
  /** Tokens: {PREFIX} {YEAR} {YY} {MONTH} {SEQ} */
  pattern: string;
  sequenceDigits: number;
  resetPerYear: boolean;
}

export interface Customer {
  id: string;
  legalName: string;
  registrationNumber: string;
  vatNumber: string;
  legalAddress: string;
  billingAddress: string;
  country: string;
  email: string;
  contactPerson: string;
  defaultCurrency: Currency;
  defaultLanguage: Language;
  defaultVatTreatment: VatTreatmentKey;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  descriptionLv: string;
  descriptionEn: string;
  defaultUnit: string;
  defaultUnitPrice: number;
  defaultVatTreatment: VatTreatmentKey;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLine {
  id: string;
  descriptionLv: string;
  descriptionEn: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  vatTreatment: VatTreatmentKey;
  vatRate: number;
  /** Computed: qty * unitPrice, before discount. */
  grossAmount: number;
  /** Computed: discount amount subtracted from grossAmount. */
  discountAmount: number;
  /** Computed: grossAmount - discountAmount. */
  lineSubtotal: number;
  /** Computed: lineSubtotal * vatRate / 100. */
  lineVat: number;
  /** Computed: lineSubtotal + lineVat. */
  lineTotal: number;
}

export type InvoiceStatus = "draft" | "issued" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  number: string;
  market: Market;
  language: Language;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  customerId: string;
  /** Frozen copy of the customer at the time the invoice was created/last saved, so history stays accurate if the customer record later changes. */
  customerSnapshot: Customer;
  customerReference: string;
  purchaseOrderNumber: string;
  contractNumber: string;
  incoterms: string;
  pickupAddress: string;
  pickupDate: string;
  currency: Currency;
  vatTreatment: VatTreatmentKey;
  vatNote: string;
  lines: InvoiceLine[];
  subtotal: number;
  discountTotal: number;
  vatTotal: number;
  total: number;
  notes: string;
  paymentTerms: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoicingData {
  company: CompanySettings;
  vatTreatments: VatTreatment[];
  numbering: NumberingConfig;
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  counters: Record<string, number>;
}
