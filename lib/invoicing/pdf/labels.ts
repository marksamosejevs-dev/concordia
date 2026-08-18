import type { Language } from "../types";

export interface InvoiceLabels {
  invoiceTitle: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  supplier: string;
  customer: string;
  registrationNo: string;
  vatNo: string;
  registeredAddress: string;
  bankDetails: string;
  bankName: string;
  iban: string;
  swift: string;
  customerReference: string;
  purchaseOrder: string;
  contractNumber: string;
  incoterms: string;
  pickupAddress: string;
  pickupDate: string;
  no: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  discount: string;
  amount: string;
  subtotal: string;
  vat: string;
  total: string;
  amountInWords: string;
  paymentTerms: string;
  notes: string;
  preparedElectronically: string;
}

const LV: InvoiceLabels = {
  invoiceTitle: "RĒĶINS",
  invoiceNo: "Rēķina Nr.",
  invoiceDate: "Rēķina datums",
  dueDate: "Apmaksas termiņš",
  supplier: "Piegādātājs",
  customer: "Saņēmējs",
  registrationNo: "Reģistrācijas Nr.",
  vatNo: "PVN maksātāja Nr.",
  registeredAddress: "Juridiskā adrese",
  bankDetails: "Apmaksas rekvizīti",
  bankName: "Banka",
  iban: "Konta Nr. (IBAN)",
  swift: "SWIFT/BIC",
  customerReference: "Pasūtītāja atsauce",
  purchaseOrder: "Pasūtījuma Nr.",
  contractNumber: "Līguma Nr.",
  incoterms: "Piegādes noteikumi (Incoterms)",
  pickupAddress: "Iekraušanas adrese",
  pickupDate: "Iekraušanas datums",
  no: "Nr.",
  description: "Preces / pakalpojuma apraksts",
  quantity: "Daudzums",
  unit: "Mērvienība",
  unitPrice: "Cena par vienību",
  discount: "Atlaide",
  amount: "Summa",
  subtotal: "Summa bez PVN",
  vat: "PVN",
  total: "Apmaksai kopā",
  amountInWords: "Summa vārdiem",
  paymentTerms: "Apmaksas noteikumi",
  notes: "Piezīmes",
  preparedElectronically: "Rēķins sagatavots elektroniski un ir derīgs bez paraksta.",
};

const EN: InvoiceLabels = {
  invoiceTitle: "INVOICE",
  invoiceNo: "Invoice No.",
  invoiceDate: "Invoice Date",
  dueDate: "Due Date",
  supplier: "Supplier",
  customer: "Customer",
  registrationNo: "Company Registration No.",
  vatNo: "VAT No.",
  registeredAddress: "Registered Address",
  bankDetails: "Payment Details",
  bankName: "Bank",
  iban: "IBAN",
  swift: "SWIFT/BIC",
  customerReference: "Customer Reference",
  purchaseOrder: "Purchase Order No.",
  contractNumber: "Contract No.",
  incoterms: "Incoterms",
  pickupAddress: "Pick-up Address",
  pickupDate: "Pick-up Date",
  no: "No.",
  description: "Description",
  quantity: "Quantity",
  unit: "Unit",
  unitPrice: "Unit Price",
  discount: "Discount",
  amount: "Amount",
  subtotal: "Subtotal",
  vat: "VAT",
  total: "Total Amount Due",
  amountInWords: "Amount in words",
  paymentTerms: "Payment Terms",
  notes: "Notes",
  preparedElectronically: "This invoice is prepared electronically and is valid without a signature.",
};

export function getLabels(language: Language): InvoiceLabels {
  return language === "lv" ? LV : EN;
}
