import Link from "next/link";

const NAV = [
  { href: "/invoicing", label: "Dashboard" },
  { href: "/invoicing/new", label: "New Invoice" },
  { href: "/invoicing/customers", label: "Customers" },
  { href: "/invoicing/products", label: "Products" },
  { href: "/invoicing/settings", label: "Settings" },
];

export default function InvoicingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-emerald-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/invoicing" className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-wide">SIA GREEN ENERGY</span>
            <span className="text-[10px] tracking-[0.2em] text-emerald-200">INVOICING</span>
          </Link>
          <nav className="flex gap-1 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-emerald-100 hover:bg-emerald-900 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
