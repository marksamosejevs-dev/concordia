"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteInvoiceAction, duplicateInvoiceAction, setInvoiceStatusAction } from "./actions";
import type { Invoice, InvoiceStatus } from "@/lib/invoicing/types";
import { btnGhost, select } from "@/lib/invoicing/ui";

const STATUSES: InvoiceStatus[] = ["draft", "issued", "paid", "overdue", "cancelled"];

export function InvoiceRowActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleStatusChange(status: InvoiceStatus) {
    setError(null);
    startTransition(async () => {
      try {
        await setInvoiceStatusAction(invoice.id, status);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update status");
      }
    });
  }

  function handleDuplicate() {
    setError(null);
    startTransition(async () => {
      try {
        const copy = await duplicateInvoiceAction(invoice.id);
        router.push(`/invoicing/${copy.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to duplicate invoice");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete invoice ${invoice.number}? This cannot be undone.`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteInvoiceAction(invoice.id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete invoice");
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <select
        className={`${select} w-auto py-1 text-xs`}
        value={invoice.status}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value as InvoiceStatus)}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button type="button" className={btnGhost} disabled={isPending} onClick={handleDuplicate}>
        Duplicate
      </button>
      <button
        type="button"
        className={`${btnGhost} text-red-600 hover:bg-red-50`}
        disabled={isPending}
        onClick={handleDelete}
      >
        Delete
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
