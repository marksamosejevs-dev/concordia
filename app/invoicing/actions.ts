"use server";

import { revalidatePath } from "next/cache";
import { recomputeInvoice } from "@/lib/invoicing/calculations";
import { counterKey, findNextFreeNumber, parseSequence } from "@/lib/invoicing/numbering";
import {
  getCustomers,
  getInvoices,
  getNumberingConfig,
  saveCompany as saveCompanyToStore,
  saveNumberingConfig as saveNumberingConfigToStore,
  saveVatTreatments as saveVatTreatmentsToStore,
  withCounters,
  withCustomers,
  withInvoices,
  withProducts,
} from "@/lib/invoicing/store";
import type {
  CompanySettings,
  Customer,
  Invoice,
  InvoiceStatus,
  NumberingConfig,
  Product,
  VatTreatment,
} from "@/lib/invoicing/types";

function newId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

// --- Company -----------------------------------------------------

export async function saveCompanyAction(company: CompanySettings): Promise<void> {
  await saveCompanyToStore(company);
  revalidatePath("/invoicing", "layout");
}

// --- VAT treatments -----------------------------------------------------

export async function saveVatTreatmentsAction(treatments: VatTreatment[]): Promise<void> {
  await saveVatTreatmentsToStore(treatments);
  revalidatePath("/invoicing", "layout");
}

// --- Numbering -----------------------------------------------------

export async function saveNumberingConfigAction(config: NumberingConfig): Promise<void> {
  await saveNumberingConfigToStore(config);
  revalidatePath("/invoicing", "layout");
}

export async function previewNextInvoiceNumberAction(): Promise<string> {
  const [config, counters, invoices] = await Promise.all([
    getNumberingConfig(),
    getCountersSnapshot(),
    getInvoices(),
  ]);
  const taken = new Set(invoices.map((inv) => inv.number));
  return findNextFreeNumber(config, counters, new Date(), (candidate) => taken.has(candidate)).number;
}

async function getCountersSnapshot(): Promise<Record<string, number>> {
  return withCounters(async (counters) => ({ ...counters }));
}

// --- Products -----------------------------------------------------

export async function saveProductAction(input: Partial<Product> & { id?: string }): Promise<Product> {
  return withProducts(async (products) => {
    if (input.id) {
      const idx = products.findIndex((p) => p.id === input.id);
      if (idx === -1) throw new Error("Product not found");
      const updated: Product = { ...products[idx], ...input, updatedAt: now() };
      products[idx] = updated;
      revalidatePath("/invoicing/products");
      return updated;
    }
    const created: Product = {
      id: newId(),
      descriptionLv: input.descriptionLv ?? "",
      descriptionEn: input.descriptionEn ?? "",
      defaultUnit: input.defaultUnit ?? "gab.",
      defaultUnitPrice: input.defaultUnitPrice ?? 0,
      defaultVatTreatment: input.defaultVatTreatment ?? "lv_standard",
      createdAt: now(),
      updatedAt: now(),
    };
    products.push(created);
    revalidatePath("/invoicing/products");
    return created;
  });
}

export async function deleteProductAction(id: string): Promise<void> {
  await withProducts(async (products) => {
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) products.splice(idx, 1);
  });
  revalidatePath("/invoicing/products");
}

// --- Customers -----------------------------------------------------

export async function saveCustomerAction(input: Partial<Customer> & { id?: string }): Promise<Customer> {
  return withCustomers(async (customers) => {
    if (input.id) {
      const idx = customers.findIndex((c) => c.id === input.id);
      if (idx === -1) throw new Error("Customer not found");
      const updated: Customer = { ...customers[idx], ...input, updatedAt: now() };
      customers[idx] = updated;
      revalidatePath("/invoicing/customers");
      return updated;
    }
    const created: Customer = {
      id: newId(),
      legalName: input.legalName ?? "",
      registrationNumber: input.registrationNumber ?? "",
      vatNumber: input.vatNumber ?? "",
      legalAddress: input.legalAddress ?? "",
      billingAddress: input.billingAddress ?? "",
      country: input.country ?? "",
      email: input.email ?? "",
      contactPerson: input.contactPerson ?? "",
      defaultCurrency: input.defaultCurrency ?? "EUR",
      defaultLanguage: input.defaultLanguage ?? "lv",
      defaultVatTreatment: input.defaultVatTreatment ?? "lv_standard",
      notes: input.notes ?? "",
      createdAt: now(),
      updatedAt: now(),
    };
    customers.push(created);
    revalidatePath("/invoicing/customers");
    return created;
  });
}

export async function deleteCustomerAction(id: string): Promise<void> {
  await withCustomers(async (customers) => {
    const idx = customers.findIndex((c) => c.id === id);
    if (idx !== -1) customers.splice(idx, 1);
  });
  revalidatePath("/invoicing/customers");
}

// --- Invoices -----------------------------------------------------

export interface SaveInvoiceInput {
  id?: string;
  market: Invoice["market"];
  language: Invoice["language"];
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  customerId: string;
  customerReference: string;
  purchaseOrderNumber: string;
  contractNumber: string;
  incoterms: string;
  pickupAddress: string;
  pickupDate: string;
  currency: string;
  vatTreatment: Invoice["vatTreatment"];
  vatNote: string;
  lines: Array<Omit<Invoice["lines"][number], "grossAmount" | "discountAmount" | "lineSubtotal" | "lineVat" | "lineTotal">>;
  notes: string;
  paymentTerms: string;
  /** Manually entered invoice number override. Leave blank to auto-allocate the next number. */
  manualNumber?: string;
}

export async function saveInvoiceAction(input: SaveInvoiceInput): Promise<Invoice> {
  const customers = await getCustomers();
  const customer = customers.find((c) => c.id === input.customerId);
  if (!customer) throw new Error("Select a customer before saving the invoice.");

  return withInvoices(async (invoices) => {
    const existingIdx = input.id ? invoices.findIndex((inv) => inv.id === input.id) : -1;
    const existing = existingIdx !== -1 ? invoices[existingIdx] : undefined;

    const numberTaken = (candidate: string) =>
      invoices.some((inv) => inv.number === candidate && inv.id !== input.id);

    const config = await getNumberingConfig();
    const issueDate = new Date(input.issueDate || now());

    let number: string;
    if (input.manualNumber && input.manualNumber.trim()) {
      number = input.manualNumber.trim();
      if (numberTaken(number)) {
        throw new Error(`Invoice number "${number}" is already used by another invoice.`);
      }
    } else if (existing) {
      number = existing.number;
    } else {
      number = await withCounters(async (counters) => {
        const { number: candidate, seq } = findNextFreeNumber(config, counters, issueDate, numberTaken);
        counters[counterKey(config, issueDate)] = seq;
        return candidate;
      });
    }

    // Whatever path produced `number` (auto, manual override, or an accepted
    // suggestion resubmitted as "manual"), advance the stored counter past it
    // if it matches the configured pattern, so the next preview never
    // suggests a number that's already in use.
    const matchedSeq = parseSequence(config, number, issueDate);
    if (matchedSeq !== null) {
      await withCounters(async (counters) => {
        const key = counterKey(config, issueDate);
        counters[key] = Math.max(counters[key] ?? 0, matchedSeq);
      });
    }

    const lines = input.lines.map((line) => ({
      ...line,
      grossAmount: 0,
      discountAmount: 0,
      lineSubtotal: 0,
      lineVat: 0,
      lineTotal: 0,
    }));

    const base: Invoice = {
      id: existing?.id ?? newId(),
      number,
      market: input.market,
      language: input.language,
      status: input.status,
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      customerId: input.customerId,
      customerSnapshot: customer,
      customerReference: input.customerReference,
      purchaseOrderNumber: input.purchaseOrderNumber,
      contractNumber: input.contractNumber,
      incoterms: input.incoterms,
      pickupAddress: input.pickupAddress,
      pickupDate: input.pickupDate,
      currency: input.currency,
      vatTreatment: input.vatTreatment,
      vatNote: input.vatNote,
      lines,
      subtotal: 0,
      discountTotal: 0,
      vatTotal: 0,
      total: 0,
      notes: input.notes,
      paymentTerms: input.paymentTerms,
      createdAt: existing?.createdAt ?? now(),
      updatedAt: now(),
    };

    const invoice = recomputeInvoice(base);

    if (existingIdx !== -1) {
      invoices[existingIdx] = invoice;
    } else {
      invoices.push(invoice);
    }

    revalidatePath("/invoicing");
    return invoice;
  });
}

export async function deleteInvoiceAction(id: string): Promise<void> {
  await withInvoices(async (invoices) => {
    const idx = invoices.findIndex((inv) => inv.id === id);
    if (idx !== -1) invoices.splice(idx, 1);
  });
  revalidatePath("/invoicing");
}

export async function setInvoiceStatusAction(id: string, status: InvoiceStatus): Promise<void> {
  await withInvoices(async (invoices) => {
    const idx = invoices.findIndex((inv) => inv.id === id);
    if (idx === -1) throw new Error("Invoice not found");
    invoices[idx] = { ...invoices[idx], status, updatedAt: now() };
  });
  revalidatePath("/invoicing");
}

export async function duplicateInvoiceAction(id: string): Promise<Invoice> {
  const invoices = await getInvoices();
  const source = invoices.find((inv) => inv.id === id);
  if (!source) throw new Error("Invoice not found");

  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 7);

  return saveInvoiceAction({
    market: source.market,
    language: source.language,
    status: "draft",
    issueDate: today.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
    customerId: source.customerId,
    customerReference: source.customerReference,
    purchaseOrderNumber: source.purchaseOrderNumber,
    contractNumber: source.contractNumber,
    incoterms: source.incoterms,
    pickupAddress: source.pickupAddress,
    pickupDate: source.pickupDate,
    currency: source.currency,
    vatTreatment: source.vatTreatment,
    vatNote: source.vatNote,
    lines: source.lines.map((l) => ({
      id: newId(),
      descriptionLv: l.descriptionLv,
      descriptionEn: l.descriptionEn,
      unit: l.unit,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      discountPercent: l.discountPercent,
      vatTreatment: l.vatTreatment,
      vatRate: l.vatRate,
    })),
    notes: source.notes,
    paymentTerms: source.paymentTerms,
  });
}
