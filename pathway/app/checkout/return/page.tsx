import type { Metadata } from "next";
import { CheckoutReturn } from "@/components/checkout/CheckoutReturn";

export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Confirming your payment" };
export default function Page() { return <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]"><div className="wrap-narrow"><CheckoutReturn /></div></section>; }
