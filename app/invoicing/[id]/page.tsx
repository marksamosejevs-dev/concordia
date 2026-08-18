import { notFound } from "next/navigation";
import Link from "next/link";
import { InvoiceForm } from "../InvoiceForm";
import { getCustomers, getInvoices, getProducts, getVatTreatments } from "@/lib/invoicing/store";
import { btnGhost } from "@/lib/invoicing/ui";

export default async function InvoiceDetailPage(props: PageProps<"/invoicing/[id]">) {
  const { id } = await props.params;
  const [invoices, customers, products, vatTreatments] = await Promise.all([
    getInvoices(),
    getCustomers(),
    getProducts(),
    getVatTreatments(),
  ]);
  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{invoice.number}</h1>
          <p className="text-sm text-slate-500">{invoice.customerSnapshot.legalName}</p>
        </div>
        <Link href="/invoicing" className={btnGhost}>
          ← Back to history
        </Link>
      </div>
      <InvoiceForm
        mode="edit"
        invoice={invoice}
        customers={customers}
        products={products}
        vatTreatments={vatTreatments}
        suggestedNumber={invoice.number}
      />
    </div>
  );
}
