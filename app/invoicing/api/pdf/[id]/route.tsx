import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { InvoiceDocument } from "@/lib/invoicing/pdf/InvoiceDocument";
import { getCompany, getInvoices } from "@/lib/invoicing/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest, ctx: RouteContext<"/invoicing/api/pdf/[id]">) {
  const { id } = await ctx.params;
  const [invoices, company] = await Promise.all([getInvoices(), getCompany()]);
  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(<InvoiceDocument invoice={invoice} company={company} />);

  const mode = request.nextUrl.searchParams.get("mode") === "download" ? "attachment" : "inline";
  const safeCustomer = invoice.customerSnapshot.legalName.replace(/[^\p{L}\p{N}]+/gu, "_");
  const fileName = `${invoice.number}_${safeCustomer}.pdf`.replace(/_+/g, "_");
  const asciiFallback = fileName.replace(/[^\x20-\x7E]/g, "_");

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${mode}; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "no-store",
    },
  });
}
