import { previewNextInvoiceNumberAction } from "../actions";
import { InvoiceForm } from "../InvoiceForm";
import { getCustomers, getProducts, getVatTreatments } from "@/lib/invoicing/store";

export default async function NewInvoicePage() {
  const [customers, products, vatTreatments, suggestedNumber] = await Promise.all([
    getCustomers(),
    getProducts(),
    getVatTreatments(),
    previewNextInvoiceNumberAction(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">New invoice</h1>
        <p className="text-sm text-slate-500">Suggested number: {suggestedNumber}</p>
      </div>
      <InvoiceForm
        mode="create"
        customers={customers}
        products={products}
        vatTreatments={vatTreatments}
        suggestedNumber={suggestedNumber}
      />
    </div>
  );
}
