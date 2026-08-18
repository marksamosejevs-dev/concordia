import { getProducts, getVatTreatments } from "@/lib/invoicing/store";
import { ProductManager } from "./ProductManager";

export default async function ProductsPage() {
  const [products, vatTreatments] = await Promise.all([getProducts(), getVatTreatments()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Products &amp; services</h1>
        <p className="text-sm text-slate-500">
          Reusable line-item presets. Pick one on an invoice and the description switches automatically
          between Latvian and English with the invoice language.
        </p>
      </div>
      <ProductManager initialProducts={products} vatTreatments={vatTreatments} />
    </div>
  );
}
