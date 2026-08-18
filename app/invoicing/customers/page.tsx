import { getCustomers, getVatTreatments } from "@/lib/invoicing/store";
import { CustomerManager } from "./CustomerManager";

export default async function CustomersPage() {
  const [customers, vatTreatments] = await Promise.all([getCustomers(), getVatTreatments()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Customers</h1>
        <p className="text-sm text-slate-500">
          Reusable customer records. Pick one from the dropdown when creating an invoice to auto-fill
          everything.
        </p>
      </div>
      <CustomerManager initialCustomers={customers} vatTreatments={vatTreatments} />
    </div>
  );
}
