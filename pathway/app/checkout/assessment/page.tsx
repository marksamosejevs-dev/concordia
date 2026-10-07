import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Pathway Assessment — payment" };
export default function CheckoutPage() {
  return <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]"><div className="wrap"><CheckoutForm /></div></section>;
}
