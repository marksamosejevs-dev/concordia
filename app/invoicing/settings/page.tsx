import { getCompany, getNumberingConfig, getVatTreatments } from "@/lib/invoicing/store";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const [company, numbering, vatTreatments] = await Promise.all([
    getCompany(),
    getNumberingConfig(),
    getVatTreatments(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">
          Company details, invoice numbering, and VAT treatments used across every invoice.
        </p>
      </div>
      <SettingsForm company={company} numbering={numbering} vatTreatments={vatTreatments} />
    </div>
  );
}
