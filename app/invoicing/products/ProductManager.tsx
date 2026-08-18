"use client";

import { useState, useTransition } from "react";
import { deleteProductAction, saveProductAction } from "../actions";
import type { Product, VatTreatment, VatTreatmentKey } from "@/lib/invoicing/types";
import { btnGhost, btnPrimary, btnSecondary, card, input, label, select, tableCell, tableHeadCell } from "@/lib/invoicing/ui";

function emptyProduct(): Omit<Product, "id" | "createdAt" | "updatedAt"> {
  return { descriptionLv: "", descriptionEn: "", defaultUnit: "gab.", defaultUnitPrice: 0, defaultVatTreatment: "lv_standard" };
}

export function ProductManager({
  initialProducts,
  vatTreatments,
}: {
  initialProducts: Product[];
  vatTreatments: VatTreatment[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  function handleSave(data: Omit<Product, "id" | "createdAt" | "updatedAt">, id?: string) {
    startTransition(async () => {
      const saved = await saveProductAction(id ? { ...data, id } : data);
      setProducts((list) => {
        const idx = list.findIndex((p) => p.id === saved.id);
        if (idx === -1) return [...list, saved];
        const next = [...list];
        next[idx] = saved;
        return next;
      });
      closeForm();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    startTransition(async () => {
      await deleteProductAction(id);
      setProducts((list) => list.filter((p) => p.id !== id));
    });
  }

  return (
    <div className="space-y-6">
      {(creating || editing) && (
        <ProductForm
          key={editing?.id ?? "new"}
          initial={editing ?? emptyProduct()}
          id={editing?.id}
          vatTreatments={vatTreatments}
          isPending={isPending}
          onCancel={closeForm}
          onSubmit={handleSave}
        />
      )}

      {!creating && !editing && (
        <button type="button" className={btnPrimary} onClick={() => setCreating(true)}>
          + Add product
        </button>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className={tableHeadCell}>Description (LV)</th>
              <th className={tableHeadCell}>Description (EN)</th>
              <th className={tableHeadCell}>Unit</th>
              <th className={tableHeadCell}>Unit price</th>
              <th className={tableHeadCell}>Default VAT</th>
              <th className={tableHeadCell}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 && (
              <tr>
                <td className={tableCell} colSpan={6}>
                  <span className="text-slate-400">No products yet.</span>
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className={tableCell}>{p.descriptionLv}</td>
                <td className={tableCell}>{p.descriptionEn}</td>
                <td className={tableCell}>{p.defaultUnit}</td>
                <td className={tableCell}>{p.defaultUnitPrice.toFixed(2)}</td>
                <td className={tableCell}>{vatTreatments.find((t) => t.key === p.defaultVatTreatment)?.labelEn ?? p.defaultVatTreatment}</td>
                <td className={tableCell}>
                  <div className="flex justify-end gap-1.5">
                    <button type="button" className={btnGhost} onClick={() => setEditing(p)}>
                      Edit
                    </button>
                    <button type="button" className={`${btnGhost} text-red-600 hover:bg-red-50`} onClick={() => handleDelete(p.id)}>
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

function ProductForm({
  initial,
  id,
  vatTreatments,
  isPending,
  onCancel,
  onSubmit,
}: {
  initial: Omit<Product, "id" | "createdAt" | "updatedAt">;
  id?: string;
  vatTreatments: VatTreatment[];
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (data: Omit<Product, "id" | "createdAt" | "updatedAt">, id?: string) => void;
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
      <h2 className="mb-4 text-sm font-semibold text-slate-900">{id ? "Edit product" : "New product"}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Description (Latvian) *</label>
          <input required className={input} value={form.descriptionLv} onChange={(e) => set("descriptionLv", e.target.value)} />
        </div>
        <div>
          <label className={label}>Description (English) *</label>
          <input required className={input} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} />
        </div>
        <div>
          <label className={label}>Default unit</label>
          <input className={input} value={form.defaultUnit} onChange={(e) => set("defaultUnit", e.target.value)} />
        </div>
        <div>
          <label className={label}>Default unit price</label>
          <input
            type="number"
            step="0.01"
            className={input}
            value={form.defaultUnitPrice}
            onChange={(e) => set("defaultUnitPrice", Number(e.target.value))}
          />
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
      </div>
      <div className="mt-4 flex gap-2">
        <button type="submit" className={btnPrimary} disabled={isPending}>
          {isPending ? "Saving…" : "Save product"}
        </button>
        <button type="button" className={btnSecondary} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
