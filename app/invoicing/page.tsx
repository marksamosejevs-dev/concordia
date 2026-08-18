import Link from "next/link";
import { getInvoices } from "@/lib/invoicing/store";
import { formatMoney } from "@/lib/invoicing/calculations";
import type { InvoiceStatus } from "@/lib/invoicing/types";
import { btnPrimary, card, tableCell, tableHeadCell } from "@/lib/invoicing/ui";
import { InvoiceRowActions } from "./InvoiceRowActions";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  issued: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-400 line-through",
};

export default async function InvoicingDashboardPage(props: PageProps<"/invoicing">) {
  const searchParams = await props.searchParams;
  const statusFilter = typeof searchParams.status === "string" ? searchParams.status : "";

  const invoices = await getInvoices();
  const sorted = [...invoices].sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  const filtered = statusFilter ? sorted.filter((inv) => inv.status === statusFilter) : sorted;

  const outstanding = invoices
    .filter((inv) => inv.status === "issued" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Invoice history</h1>
          <p className="text-sm text-slate-500">All invoices issued for SIA Green Energy.</p>
        </div>
        <Link href="/invoicing/new" className={btnPrimary}>
          + New Invoice
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className={card}>
          <p className="text-xs font-medium uppercase text-slate-500">Total invoices</p>
          <p className="mt-1 text-2xl font-semibold">{invoices.length}</p>
        </div>
        <div className={card}>
          <p className="text-xs font-medium uppercase text-slate-500">Outstanding (issued + overdue)</p>
          <p className="mt-1 text-2xl font-semibold">{formatMoney(outstanding, "EUR", "en")}</p>
        </div>
        <div className={card}>
          <p className="text-xs font-medium uppercase text-slate-500">Overdue</p>
          <p className="mt-1 text-2xl font-semibold text-red-600">{overdueCount}</p>
        </div>
      </div>

      <div className="flex gap-1.5">
        <Link
          href="/invoicing"
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${!statusFilter ? "bg-emerald-950 text-white" : "bg-white text-slate-600 border border-slate-300"}`}
        >
          All
        </Link>
        {(["draft", "issued", "paid", "overdue", "cancelled"] as InvoiceStatus[]).map((s) => (
          <Link
            key={s}
            href={`/invoicing?status=${s}`}
            className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize ${statusFilter === s ? "bg-emerald-950 text-white" : "bg-white text-slate-600 border border-slate-300"}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className={tableHeadCell}>Number</th>
              <th className={tableHeadCell}>Customer</th>
              <th className={tableHeadCell}>Issue date</th>
              <th className={tableHeadCell}>Due date</th>
              <th className={tableHeadCell}>Amount</th>
              <th className={tableHeadCell}>VAT</th>
              <th className={tableHeadCell}>Lang</th>
              <th className={tableHeadCell}>Status</th>
              <th className={tableHeadCell}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td className={tableCell} colSpan={9}>
                  <span className="text-slate-400">No invoices yet.</span>
                </td>
              </tr>
            )}
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className={tableCell}>
                  <Link href={`/invoicing/${inv.id}`} className="font-medium text-emerald-900 hover:underline">
                    {inv.number}
                  </Link>
                </td>
                <td className={tableCell}>{inv.customerSnapshot.legalName}</td>
                <td className={tableCell}>{inv.issueDate}</td>
                <td className={tableCell}>{inv.dueDate}</td>
                <td className={tableCell}>{formatMoney(inv.total, inv.currency, inv.language)}</td>
                <td className={tableCell}>{formatMoney(inv.vatTotal, inv.currency, inv.language)}</td>
                <td className={tableCell}>{inv.language.toUpperCase()}</td>
                <td className={tableCell}>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className={tableCell}>
                  <InvoiceRowActions invoice={inv} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
