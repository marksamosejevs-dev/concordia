import type { Metadata } from "next";
import { Confirmation } from "@/components/checkout/Confirmation";

export const metadata: Metadata = { title: "Confirmation" };
export default function ConfirmationPage() {
  return <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]"><div className="wrap-narrow"><Confirmation /></div></section>;
}
