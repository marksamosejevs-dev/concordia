"use client";

import { useState, useTransition } from "react";
import { deleteCustomerAction, saveCustomerAction } from "../actions";
import { CURRENCIES } from "@/lib/invoicing/currencies";
import type { Customer, VatTreatmentKey, VatTreatment } from "@/lib/invoicing/types";
import { btnGhost, btnPrimary, btnSecondary, card, input, label, select, tableCell, tableHeadCell, textarea } from "@/lib/invoicing/ui";

function emptyCustomer(): Omit<Customer, "id" | "createdAt" | "updatedAt"> {
  return {
    legalName: "",
    registrationNumber: "",
    vatNumber: "",
    legalAddress: "",
    billingAddress: "",
    country: "",
    email: "",
    contactPerson: "",
    defaultCurrency: "EUR",
    defaultLanguage: "lv",
    defaultVatTreatment: "lv_standard",
    notes: "",
  };
}

export function CustomerManager({
  initialCustomers,
  vatTreatments,
}: {
  initialCustomers: Customer[];
  vatTreatments: VatTreatment[];
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  function startCreate() {
    setEditing(null);
    setCreating(true);
  }

  function startEdit(customer: Customer) {
    setCreating(false);
    setEditing(customer);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  function handleSave(data: Omit<Customer, "id" | "createdAt" | "updatedAt">, id?: string) {
    startTransition(async () => {
      const saved = await saveCustomerAction(id ? { ...data, id } : data);
      setCustomers((list) => {
        const idx = list.findIndex((c) => c.id === saved.id);
        if (idx === -1) return [...list, saved];
        const next = [...list];
        next[idx] = saved;
        return next;
      });
      closeForm();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this customer?")) return;
    startTransition(async () => {
      await deleteCustomerAction(id);
      setCustomers((list) => list.filter((c) => c.id !== id));
    });
  }

  return (
    <div className="space-y-6">
      {(creating || editing) && (
        <CustomerForm
          key={editing?.id ?? "new"}
          initial={editing ?? emptyCustomer()}
          id={editing?.id}
          vatTreatments={vatTreatments}
          isPending={isPending}
          onCancel={closeForm}
          onSubmit={handleSave}
        />
      )}

      {!creating && !editing && (
        <button type="button" className={btnPrimary} onClick={startCreate}>
          + Add customer
        </button>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className={tableHeadCell}>Legal name</th>
              <th className={tableHeadCell}>Country</th>
              <th className={tableHeadCell}>VAT number</th>
              <th className={tableHeadCell}>Contact</th>
              <th className={tableHeadCell}>Currency</th>
              <th className={tableHeadCell}>Language</th>
              <th className={tableHeadCell}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 && (
              <tr>
                <td className={tableCell} colSpan={7}>
                  <span className="text-slate-400">No customers yet.</span>
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className={tableCell}>{c.legalName}</td>
                <td className={tableCell}>{c.country}</td>
                <td className={tableCell}>{c.vatNumber}</td>
                <td className={tableCell}>
                  {c.contactPerson}
                  {c.email ? ` · ${c.email}` : ""}
                </td>
                <td className={tableCell}>{c.defaultCurrency}</td>
                <td className={tableCell}>{c.defaultLanguage.toUpperCase()}</td>
                <td className={tableCell}>
                  <div className="flex justify-end gap-1.5">
                    <button type="button" className={btnGhost} onClick={() => startEdit(c)}>
                      Edit
                    </button>
                    <button type="button" className={`${btnGhost} text-red-600 hover:bg-red-50`} onClick={() => handleDelete(c.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerForm({
  initial,
  id,
  vatTreatments,
  isPending,
  onCancel,
  onSubmit,
}: {
  initial: Omit<Customer, "id" | "createdAt" | "updatedAt">;
  id?: string;
  vatTreatments: VatTreatment[];
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (data: Omit<Customer, "id" | "createdAt" | "updatedAt">, id?: string) => void;
}) {
  const [form, setForm] = useState(initial);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form, id);
  }

  return (
    <form onSubmit={handleSubmit} className={card}>
      <h2 className="mb-4 text-sm font-semibold text-slate-900">{id ? "Edit customer" : "New customer"}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Legal company name *</label>
          <input required className={input} value={form.legalName} onChange={(e) => set("legalName", e.target.value)} />
        </div>
        <div>
          <label className={label}>Country</label>
          <input className={input} value={form.country} onChange={(e) => set("country", e.target.value)} />
        </div>
        <div>
          <label className={label}>Registration number</label>
          <input className={input} value={form.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} />
        </div>
        <div>
          <label className={label}>VAT number</label>
          <input className={input} value={form.vatNumber} onChange={(e) => set("vatNumber", e.target.value)} />
        </div>
        <div>
          <label className={label}>Legal address</label>
          <input className={input} value={form.legalAddress} onChange={(e) => set("legalAddress", e.target.value)} />
        </div>
        <div>
          <label className={label}>Billing address (if different)</label>
          <input className={input} value={form.billingAddress} onChange={(e) => set("billingAddress", e.target.value)} />
        </div>
        <div>
          <label className={label}>Contact person</label>
          <input className={input} value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input type="email" className={input} value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className={label}>Default currency</label>
          <select className={select} value={form.defaultCurrency} onChange={(e) => set("defaultCurrency", e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Default language</label>
          <select className={select} value={form.defaultLanguage} onChange={(e) => set("defaultLanguage", e.target.value as Customer["defaultLanguage"])}>
            <option value="lv">Latvian</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className={label}>Default VAT treatment</label>
          <select
            className={select}
            value={form.defaultVatTreatment}
            onChange={(e) => set("defaultVatTreatment", e.target.value as VatTreatmentKey)}
          >
            {vatTreatments.map((t) => (
              <option key={t.key} value={t.key}>
                {t.labelEn}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className={label}>Notes</label>
          <textarea className={textarea} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="submit" className={btnPrimary} disabled={isPending}>
          {isPending ? "Saving…" : "Save customer"}
        </button>
        <button type="button" className={btnSecondary} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
