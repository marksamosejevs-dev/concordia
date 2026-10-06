/**
 * Payment provider abstraction. Business logic talks to PaymentProvider only;
 * a Stripe (or other) adapter is added later without touching pages or products.
 * Merchant of record: Concordia Sports Agency SIA (see content/site.ts).
 */
import type { Order } from "./types";
import { FEATURES } from "../site-mode";

/** "paid" is set only by a confirmed payment (Stripe webhook / return verification when live). "preview" never counts as payment. */
export interface CheckoutSession { redirectUrl?: string; status: "redirect" | "preview" | "paid" | "error"; message?: string }

export interface PaymentProvider {
  readonly name: string;
  createCheckout(order: Order, opts?: { simulate?: "success" | "failure" }): Promise<CheckoutSession>;
}

/** Used until live payments are approved: never charges, returns a preview result. */
export const previewProvider: PaymentProvider = {
  name: "preview",
  async createCheckout(_order, opts) {
    void _order;
    if (opts?.simulate === "failure") return { status: "error", message: "Your card was declined (simulated). No money was taken — please try again or use another card." };
    return { status: "preview", message: "Payments are not active in this build. No card has been charged." };
  },
};

export function getPaymentProvider(): PaymentProvider {
  // if (FEATURES.paymentsLive) return stripeProvider;  ← wired in once approved
  void FEATURES;
  return previewProvider;
}
