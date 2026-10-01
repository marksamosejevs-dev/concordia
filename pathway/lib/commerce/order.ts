import type { Consent, Order } from "./types";
import type { Attribution } from "../attribution";

export interface PayerForm { playerName: string; payerName: string; email: string; country: string; line1: string; city: string; postcode: string; isGuardian: boolean; code: string }

/** Builds an Order from checkout input. Kept outside components so it never runs during render. */
export function buildOrder(input: { productId: string; amount: number; form: PayerForm; consentKeys: Consent["key"][]; applicationId?: string; attribution: Attribution }): Order {
  const now = new Date().toISOString();
  const f = input.form;
  return {
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    productId: input.productId,
    applicationId: input.applicationId,
    payer: { name: f.payerName, email: f.email, country: f.country, isGuardian: f.isGuardian, billingAddress: { line1: f.line1, city: f.city, postcode: f.postcode, country: f.country } },
    playerName: f.playerName,
    amount: input.amount,
    currency: "USD",
    promoOrReferralCode: f.code || undefined,
    attribution: input.attribution,
    consents: input.consentKeys.map((key) => ({ key, accepted: true, wordingVersion: "draft-pending-legal-review", at: now })),
    status: "awaiting_payment",
    createdAt: now,
  };
}

export function redirectTo(url: string) { window.location.assign(url); }
