import type { Metadata } from "next";
import { PathwayCheckout } from "@/components/checkout/PathwayCheckout";

export const metadata: Metadata = { robots: { index: false, follow: false }, title: "European Pathway — subscribe" };
export default function Page() { return <section className="on-ink min-h-screen pb-24 pt-[calc(var(--header-h)+2.5rem)]"><div className="wrap"><PathwayCheckout /></div></section>; }
