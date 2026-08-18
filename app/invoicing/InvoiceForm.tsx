"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveInvoiceAction, type SaveInvoiceInput } from "./actions";
import { computeInvoiceTotals, computeLineTotals, formatMoney } from "@/lib/invoicing/calculations";
import { CURRENCIES } from "@/lib/invoicing/currencies";
import { defaultVatNote, findVatTreatment } from "@/lib/invoicing/vat";
import type {
  Currency,
  Customer,
  Invoice,
  InvoiceLine,
  InvoiceStatus,
  Language,
  Market,
  Product,
  VatTreatment,
  VatTreatmentKey,
} from "@/lib/invoicing/types";
import { btnGhost, btnPrimary, btnSecondary, card, input, label, select, tableCell, tableHeadCell, textarea } from "@/lib/invoicing/ui";

type LineState = Omit<InvoiceLine, "grossAmount" | "discountAmount" | "lineSubtotal" | "lineVat" | "lineTotal">;

interface FormState {
  market: Market;
  language: Language;
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
  currency: Currency;
  vatTreatment: VatTreatmentKey;
  vatNote: string;
  lines: LineState[];
  notes: string;
  paymentTerms: string;
  manualNumber: string;
}

function isoToday(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function newLine(vatTreatment: VatTreatmentKey, vatRate: number): LineState {
  return {
    id: crypto.randomUUID(),
    descriptionLv: "",
    descriptionEn: "",
    unit: "gab.",
    quantity: 1,
    unitPrice: 0,
    discountPercent: 0,
    vatTreatment,
    vatRate,
  };
}

function guessMarket(country: string): Market {
  const c = country.trim().toLowerCase();
  return c === "latvia" || c === "lv" || c === "latvija" ? "LV" : "INTL";
}

function buildInitialState(invoice: Invoice | undefined, suggestedNumber: string, defaultVat: VatTreatmentKey): FormState {
  if (invoice) {
    return {
      market: invoice.market,
      language: invoice.language,
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      customerId: invoice.customerId,
      customerReference: invoice.customerReference,
      purchaseOrderNumber: invoice.purchaseOrderNumber,
      contractNumber: invoice.contractNumber,
      incoterms: invoice.incoterms,
      pickupAddress: invoice.pickupAddress,
      pickupDate: invoice.pickupDate,
      currency: invoice.currency,
      vatTreatment: invoice.vatTreatment,
      vatNote: invoice.vatNote,
      lines: invoice.lines.map((l) => ({ ...l })),
      notes: invoice.notes,
      paymentTerms: invoice.paymentTerms,
      manualNumber: invoice.number,
    };
  }
  return {
    market: "LV",
    language: "lv",
    status: "draft",
    issueDate: isoToday(),
    dueDate: isoToday(14),
    customerId: "",
    customerReference: "",
    purchaseOrderNumber: "",
    contractNumber: "",
    incoterms: "",
    pickupAddress: "",
    pickupDate: "",
    currency: "EUR",
    vatTreatment: defaultVat,
    vatNote: "",
    lines: [],
    notes: "",
    paymentTerms: "",
    manualNumber: suggestedNumber,
  };
}

export function InvoiceForm({
  mode,
  invoice,
  customers,
  products,
  vatTreatments,
  suggestedNumber,
}: {
  mode: "create" | "edit";
  invoice?: Invoice;
  customers: Customer[];
  products: Product[];
  vatTreatments: VatTreatment[];
  suggestedNumber: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    buildInitialState(invoice, suggestedNumber, vatTreatments[0]?.key ?? "lv_standard"),
  );
  const [savedInvoice, setSavedInvoice] = useState<Invoice | undefined>(invoice);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewNonce, setPreviewNonce] = useState(0);

  const selectedCustomer = customers.find((c) => c.id === form.customerId);

  const computedLines = useMemo(
    () => form.lines.map((l) => ({ ...l, ...computeLineTotals(l) })),
    [form.lines],
  );
  const totals = useMemo(() => computeInvoiceTotals(computedLines), [computedLines]);

  function patch(fields: Partial<FormState>) {
    setForm((f) => ({ ...f, ...fields }));
  }

  function handleSelectCustomer(customerId: string) {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) {
      patch({ customerId: "" });
      return;
    }
    patch({
      customerId,
      language: customer.defaultLanguage,
      currency: customer.defaultCurrency,
      market: guessMarket(customer.country),
      vatTreatment: customer.defaultVatTreatment,
      vatNote: defaultVatNote(vatTreatments, customer.defaultVatTreatment, customer.defaultLanguage),
    });
  }

  function handleLanguageChange(newLanguage: Language) {
    // If the VAT note still matches the standard note in the old language
    // (i.e. it hasn't been hand-edited), carry the switch over to the note
    // too — otherwise leave whatever the user wrote alone.
    const oldDefault = defaultVatNote(vatTreatments, form.vatTreatment, form.language);
    const isUntouched = form.vatNote === oldDefault;
    patch({
      language: newLanguage,
      vatNote: isUntouched ? defaultVatNote(vatTreatments, form.vatTreatment, newLanguage) : form.vatNote,
    });
  }

  function handleVatTreatmentChange(key: VatTreatmentKey) {
    const treatment = findVatTreatment(vatTreatments, key);
    patch({
      vatTreatment: key,
      vatNote: defaultVatNote(vatTreatments, key, form.language),
      lines: form.lines.map((l) => ({ ...l, vatTreatment: key, vatRate: treatment?.rate ?? l.vatRate })),
    });
  }

  function addLine() {
    const treatment = findVatTreatment(vatTreatments, form.vatTreatment);
    patch({ lines: [...form.lines, newLine(form.vatTreatment, treatment?.rate ?? 0)] });
  }

  function updateLine(id: string, fields: Partial<LineState>) {
    patch({ lines: form.lines.map((l) => (l.id === id ? { ...l, ...fields } : l)) });
  }

  function removeLine(id: string) {
    patch({ lines: form.lines.filter((l) => l.id !== id) });
  }

  function applyProductToLine(lineId: string, productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const treatment = findVatTreatment(vatTreatments, product.defaultVatTreatment);
    updateLine(lineId, {
      descriptionLv: product.descriptionLv,
      descriptionEn: product.descriptionEn,
      unit: product.defaultUnit,
      unitPrice: product.defaultUnitPrice,
      vatTreatment: product.defaultVatTreatment,
      vatRate: treatment?.rate ?? 0,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.customerId) {
      setError("Select a customer before saving.");
      return;
    }
    if (form.lines.length === 0) {
      setError("Add at least one invoice line.");
      return;
    }

    const payload: SaveInvoiceInput = {
      id: savedInvoice?.id,
      market: form.market,
      language: form.language,
      status: form.status,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      customerId: form.customerId,
      customerReference: form.customerReference,
      purchaseOrderNumber: form.purchaseOrderNumber,
      contractNumber: form.contractNumber,
      incoterms: form.incoterms,
      pickupAddress: form.pickupAddress,
      pickupDate: form.pickupDate,
      currency: form.currency,
      vatTreatment: form.vatTreatment,
      vatNote: form.vatNote,
      lines: form.lines,
      notes: form.notes,
      paymentTerms: form.paymentTerms,
      manualNumber: form.manualNumber,
    };

    startTransition(async () => {
      try {
        const result = await saveInvoiceAction(payload);
        setSavedInvoice(result);
        setForm((f) => ({ ...f, manualNumber: result.number }));
        setPreviewNonce((n) => n + 1);
        if (mode === "create") {
          router.push(`/invoicing/${result.id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save invoice");
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={card}>
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Invoice details</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <label className={label}>Market</label>
              <select className={select} value={form.market} onChange={(e) => patch({ market: e.target.value as Market })}>
                <option value="LV">Latvia</option>
                <option value="INTL">International</option>
              </select>
            </div>
            <div>
              <label className={label}>Language</label>
              <select className={select} value={form.language} onChange={(e) => handleLanguageChange(e.target.value as Language)}>
                <option value="lv">Latvian</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className={label}>Status</label>
              <select className={select} value={form.status} onChange={(e) => patch({ status: e.target.value as InvoiceStatus })}>
                {(["draft", "issued", "paid", "overdue", "cancelled"] as InvoiceStatus[]).map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Invoice number</label>
              <input
                className={input}
                placeholder="auto"
                value={form.manualNumber}
                onChange={(e) => patch({ manualNumber: e.target.value })}
              />
            </div>
            <div>
              <label className={label}>Invoice date</label>
              <input type="date" className={input} value={form.issueDate} onChange={(e) => patch({ issueDate: e.target.value })} />
            </div>
            <div>
              <label className={label}>Due date</label>
              <input type="date" className={input} value={form.dueDate} onChange={(e) => patch({ dueDate: e.target.value })} />
            </div>
            <div>
              <label className={label}>Currency</label>
              <select className={select} value={form.currency} onChange={(e) => patch({ currency: e.target.value })}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={card}>
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Customer</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={label}>Select customer</label>
              <select className={select} value={form.customerId} onChange={(e) => handleSelectCustomer(e.target.value)}>
                <option value="">— choose a customer —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.legalName} {c.country ? `(${c.country})` : ""}
                  </option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  No customers yet — add one on the Customers page first.
                </p>
              )}
            </div>
            {selectedCustomer && (
              <div className="col-span-2 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-medium text-slate-800">{selectedCustomer.legalName}</p>
                <p>{selectedCustomer.legalAddress}</p>
                {selectedCustomer.vatNumber && <p>VAT: {selectedCustomer.vatNumber}</p>}
              </div>
            )}
            <div>
              <label className={label}>Customer reference</label>
              <input className={input} value={form.customerReference} onChange={(e) => patch({ customerReference: e.target.value })} />
            </div>
            <div>
              <label className={label}>Purchase order No.</label>
              <input className={input} value={form.purchaseOrderNumber} onChange={(e) => patch({ purchaseOrderNumber: e.target.value })} />
            </div>
            <div>
              <label className={label}>Contract No.</label>
              <input className={input} value={form.contractNumber} onChange={(e) => patch({ contractNumber: e.target.value })} />
            </div>
            <div>
              <label className={label}>Incoterms</label>
              <input className={input} placeholder="e.g. EXW" value={form.incoterms} onChange={(e) => patch({ incoterms: e.target.value })} />
            </div>
            <div>
              <label className={label}>Pick-up address</label>
              <input className={input} value={form.pickupAddress} onChange={(e) => patch({ pickupAddress: e.target.value })} />
            </div>
            <div>
              <label className={label}>Pick-up date</label>
              <input type="date" className={input} value={form.pickupDate} onChange={(e) => patch({ pickupDate: e.target.value })} />
            </div>
          </div>
        </div>

        <div className={card}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Lines</h2>
            <button type="button" className={btnSecondary} onClick={addLine}>
              + Add line
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={tableHeadCell}>Product</th>
                  <th className={tableHeadCell}>Description (LV / EN)</th>
                  <th className={tableHeadCell}>Unit</th>
                  <th className={tableHeadCell}>Qty</th>
                  <th className={tableHeadCell}>Price</th>
                  <th className={tableHeadCell}>Disc. %</th>
                  <th className={tableHeadCell}>VAT</th>
                  <th className={tableHeadCell}>Total</th>
                  <th className={tableHeadCell}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {computedLines.map((line) => (
                  <tr key={line.id}>
                    <td className={`${tableCell} w-32`}>
                      <select
                        className={`${select} text-xs`}
                        defaultValue=""
                        onChange={(e) => e.target.value && applyProductToLine(line.id, e.target.value)}
                      >
                        <option value="">preset…</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.descriptionEn}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={`${tableCell} min-w-56`}>
                      <input
                        className={`${input} mb-1`}
                        placeholder="Latvian description"
                        value={line.descriptionLv}
                        onChange={(e) => updateLine(line.id, { descriptionLv: e.target.value })}
                      />
                      <input
                        className={input}
                        placeholder="English description"
                        value={line.descriptionEn}
                        onChange={(e) => updateLine(line.id, { descriptionEn: e.target.value })}
                      />
                    </td>
                    <td className={`${tableCell} w-20`}>
                      <input className={input} value={line.unit} onChange={(e) => updateLine(line.id, { unit: e.target.value })} />
                    </td>
                    <td className={`${tableCell} w-20`}>
                      <input
                        type="number"
                        step="0.01"
                        className={input}
                        value={line.quantity}
                        onChange={(e) => updateLine(line.id, { quantity: Number(e.target.value) })}
                      />
                    </td>
                    <td className={`${tableCell} w-24`}>
                      <input
                        type="number"
                        step="0.01"
                        className={input}
                        value={line.unitPrice}
                        onChange={(e) => updateLine(line.id, { unitPrice: Number(e.target.value) })}
                      />
                    </td>
                    <td className={`${tableCell} w-20`}>
                      <input
                        type="number"
                        step="1"
                        className={input}
                        value={line.discountPercent}
                        onChange={(e) => updateLine(line.id, { discountPercent: Number(e.target.value) })}
                      />
                    </td>
                    <td className={`${tableCell} w-36`}>
                      <select
                        className={`${select} mb-1 text-xs`}
                        value={line.vatTreatment}
                        onChange={(e) => {
                          const key = e.target.value as VatTreatmentKey;
                          const treatment = findVatTreatment(vatTreatments, key);
                          updateLine(line.id, { vatTreatment: key, vatRate: treatment?.rate ?? line.vatRate });
                        }}
                      >
                        {vatTreatments.map((t) => (
                          <option key={t.key} value={t.key}>
                            {t.labelEn}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.1"
                        className={`${input} text-xs`}
                        value={line.vatRate}
                        onChange={(e) => updateLine(line.id, { vatRate: Number(e.target.value) })}
                      />
                    </td>
                    <td className={`${tableCell} whitespace-nowrap text-right font-medium`}>
                      {formatMoney(line.lineTotal, form.currency, form.language)}
                    </td>
                    <td className={tableCell}>
                      <button type="button" className={`${btnGhost} text-red-600`} onClick={() => removeLine(line.id)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
                {computedLines.length === 0 && (
                  <tr>
                    <td className={tableCell} colSpan={9}>
                      <span className="text-slate-400">No lines yet — add one above.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={card}>
          <h2 className="mb-4 text-sm font-semibold text-slate-900">VAT &amp; notes</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>VAT treatment (default for new lines)</label>
              <select className={select} value={form.vatTreatment} onChange={(e) => handleVatTreatmentChange(e.target.value as VatTreatmentKey)}>
                {vatTreatments.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Payment terms</label>
              <input className={input} value={form.paymentTerms} onChange={(e) => patch({ paymentTerms: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className={label}>VAT / legal note (shown on the invoice, editable)</label>
              <textarea className={textarea} value={form.vatNote} onChange={(e) => patch({ vatNote: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className={label}>Additional notes</label>
              <textarea className={textarea} value={form.notes} onChange={(e) => patch({ notes: e.target.value })} />
            </div>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button type="submit" className={btnPrimary} disabled={isPending}>
            {isPending ? "Saving…" : "Save invoice"}
          </button>
          {savedInvoice && <span className="text-xs text-slate-400">Last saved {new Date(savedInvoice.updatedAt).toLocaleString()}</span>}
        </div>
      </form>

      <div className="space-y-4">
        <div className={card}>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Totals</h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-medium">{formatMoney(totals.subtotal, form.currency, form.language)}</dd>
            </div>
            {totals.discountTotal > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Discount</dt>
                <dd className="font-medium">-{formatMoney(totals.discountTotal, form.currency, form.language)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-500">VAT</dt>
              <dd className="font-medium">{formatMoney(totals.vatTotal, form.currency, form.language)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 text-base">
              <dt className="font-semibold text-emerald-950">Total</dt>
              <dd className="font-semibold text-emerald-950">{formatMoney(totals.total, form.currency, form.language)}</dd>
            </div>
          </dl>
        </div>

        {savedInvoice ? (
          <div className={card}>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">PDF</h2>
            <div className="flex gap-2">
              <a
                className={btnSecondary}
                href={`/invoicing/api/pdf/${savedInvoice.id}?t=${previewNonce}`}
                target="_blank"
                rel="noreferrer"
              >
                Preview
              </a>
              <a className={btnPrimary} href={`/invoicing/api/pdf/${savedInvoice.id}?mode=download&t=${previewNonce}`}>
                Download PDF
              </a>
            </div>
            <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
              <iframe
                key={previewNonce}
                src={`/invoicing/api/pdf/${savedInvoice.id}?t=${previewNonce}`}
                className="h-[520px] w-full"
                title="Invoice preview"
              />
            </div>
          </div>
        ) : (
          <div className={`${card} text-sm text-slate-400`}>Save the invoice to preview and download the PDF.</div>
        )}
      </div>
    </div>
  );
}
