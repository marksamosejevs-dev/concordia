/**
 * Commercial data model (front-end contract). Backend persistence is chosen later;
 * these shapes are what the UI produces and consumes so nothing needs redesigning.
 */
import type { Attribution } from "../attribution";

export type BillingType = "one_time" | "fixed_term" | "recurring";
export type AccessRule = "public" | "application_required" | "assessment_required" | "invitation_only";
export type BillingInterval = "month" | "year";

export interface Product {
  id: string;
  slug: string;
  name: string;
  term: string;                 // display, e.g. "6 months"
  billingType: BillingType;
  price: number;                // USD, current price (configurable)
  termMonths?: number;
  billingInterval?: BillingInterval;
  minimumTermMonths?: number;
  instalmentOptions?: { count: number; amount: number }[]; // not public until E21
  assessmentCreditEligible: boolean;
  renewalBehaviour?: "none" | "auto_renew" | "manual";
  cancellationPolicyRef?: string; // legal doc key (E24)
  affiliateEligible: boolean;     // policy E28
  access: AccessRule;
  label?: "Most popular" | "Best value" | "Limited capacity";
}

export interface Customer { id?: string; name: string; email: string; country: string; providerCustomerId?: string }
export interface Payer extends Customer { isGuardian: boolean; billingAddress: { line1: string; line2?: string; city: string; postcode: string; country: string } }

export interface Consent { key: "terms" | "privacy" | "refund" | "not_representation" | "assessment_data" | "agency_view" | "marketing"; accepted: boolean; wordingVersion: string; at: string }

export type OrderStatus = "draft" | "awaiting_payment" | "paid" | "failed" | "refunded" | "cancelled";
export interface Order {
  id: string;
  productId: string;
  applicationId?: string;
  payer: Payer;
  playerName: string;
  amount: number;
  currency: "USD";
  promoOrReferralCode?: string;
  attribution: Attribution;
  consents: Consent[];
  status: OrderStatus;
  createdAt: string;
}

export interface Payment { id: string; orderId: string; provider: string; providerPaymentId?: string; status: "pending" | "succeeded" | "failed"; amount: number }
export interface Subscription {
  id: string; productId: string; customerId: string;
  providerCustomerId?: string; providerSubscriptionId?: string;
  status: "active" | "past_due" | "cancelled" | "incomplete";
  interval: BillingInterval; startedAt: string; renewsAt?: string; cancelledAt?: string;
  attribution: Attribution;
}
export interface Invoice { id: string; orderId: string; number?: string; issuer: string; url?: string } // issuer = legal entity
export interface ReferralSource { code: string; partnerSlug?: string }
export interface CreatorPartner { slug: string; displayName: string; enabled: boolean; policyRef: "E28" }
