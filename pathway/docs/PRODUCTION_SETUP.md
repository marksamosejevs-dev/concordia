# Concordia Soccer · European Pathway — production setup

Owner guide for turning on the live systems. Nothing secret belongs in this file or in the repository. Every key
below is entered **only** in Netlify → *Site configuration → Environment variables* for the existing
**concordia-soccer** project (base directory `pathway`). After changing variables, trigger a new deploy.

Until a variable is set, the matching feature **refuses honestly**. For example, checkout returns "Online payment is not
available yet" and an email that can't be sent is logged as failed. The admin dashboard (`/admin`) shows a live
configuration checklist.

---

## 1. Environment variables (exact list)

| Variable | Required | Secret? | What it is | Where it comes from |
|---|---|---|---|---|
| `PATHWAY_SECRET` | **Yes** | Yes | At least 32 random characters. Signs player links and the admin session. Changing it invalidates every emailed link. | Generate it yourself, e.g. a password manager's 48-character random password. |
| `PATHWAY_ADMIN_PASSWORD` | **Yes** | Yes | Password for `/admin`. Use 16+ characters. | You choose it. |
| `PATHWAY_INTERNAL_EMAIL` | **Yes** | No | Concordia inbox(es) for internal notifications, comma-separated, e.g. `mail@concordia.football`. | You choose it. |
| `RESEND_API_KEY` | **Yes** | Yes | Sends all transactional email. | Resend dashboard → API Keys (see §3). |
| `EMAIL_FROM` | **Yes** | No | Sender, e.g. `Concordia Soccer <pathway@mail.concordia.football>`. The domain must be verified in Resend. | You choose it (see §3). |
| `EMAIL_REPLY_TO` | Optional | No | Where applicant replies go. Defaults to `mail@concordia.football`. | You choose it. |
| `STRIPE_SECRET_KEY` | **Yes** for payments | **Yes, server only** | `sk_live_…` (or `sk_test_…` while testing). | Stripe → Developers → API keys. A restricted key is fine (§2.4). |
| `STRIPE_WEBHOOK_SECRET` | **Yes** for payments | **Yes, server only** | `whsec_…` for the endpoint below. | Stripe → Developers → Webhooks → your endpoint → Signing secret. |
| `STRIPE_INVOICE_CREATION` | Optional | No | `true` by default: Stripe issues an invoice PDF for the $249 payment. Set `false` to send receipts only. | Accountant decision (§4). |
| `NEXT_PUBLIC_BOOKING_URL` | Optional | No | Default call-booking link (Calendly, Cal.com…). It can also be set per player in the admin. | Your booking tool. |
| `SITE_URL` | Optional | No | Public origin used in emailed links, e.g. `https://pathway.concordia.football`. Netlify's `URL` is used if unset. | Your domain. |
| `NEXT_PUBLIC_SITE_MODE` | Already set (`review`) | No | `review` = noindex plus pending-content outlines. Switch to `production` **only** at launch (§7). | `netlify.toml`. |
| `PATHWAY_LV_VAT_RATE` | Optional | No | Overrides the Latvian VAT rate (default `0.21`) if the law changes. | Accountant. |

Never add `NEXT_PUBLIC_` to a Stripe or Resend key: that prefix would ship the value to the browser.
`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are read only in server route handlers.

Storage needs no variable. Netlify Blobs is provisioned automatically for the site, in the EU region (Frankfurt,
`eu-central-1`), store `pathway`.

---

## 2. Stripe

### 2.1 What the code does

- **$249 Pathway Assessment:** Stripe-hosted Checkout, one-time payment in USD. Billing address and tax-ID collection are on, and an invoice is created (unless `STRIPE_INVOICE_CREATION=false`) carrying the seller block and the correct VAT note for the buyer.
- **$399/month European Pathway:** Stripe-hosted Checkout in subscription mode. The $150 credit is a single-use coupon (`ASSESSMENT-CREDIT-<id>`, $150 off, once, max 1 redemption), applied automatically only while the credit is valid.
- **Cancellation:** Stripe Billing customer portal, linked from the player's status page.
- **Payment state:** only `POST /api/stripe/webhook` can mark a payment as received. Each event's signature is verified against the raw body, each event ID is processed once, the amount and currency are checked (24900 USD), and the IDs, amount, currency and timestamp are recorded. The success redirect is never trusted, and no card data ever touches our servers.

### 2.2 Dashboard steps

1. Activate the account for **Concordia Sports Agency SIA** (Latvia) with company registration and bank details. Payout currency is an owner choice (§2.5 Q3).
2. Settings → Business → Public details: statement descriptor (e.g. `CONCORDIA SOCCER`), support email and URL.
3. Settings → Billing → Customer portal: allow **cancel subscription**, mode **at end of billing period**, and allow payment-method updates. Turn off plan switching. Set the return URL to the site's `/status` page.
4. Settings → Billing → Subscriptions and emails: turn on Smart Retries and failed-payment emails, and choose what happens after all retries fail (recommended: *cancel the subscription*).
5. Settings → Customer emails: turn on **successful payments** (receipts) and **refunds**.
6. Settings → Invoices: invoice-number prefix (e.g. `CSP-`), default footer optional (the code sets a per-invoice footer), company address, and the VAT number LV40203574668.
7. Developers → Webhooks → **Add endpoint**: `https://<your-domain>/api/stripe/webhook` (no trailing slash). Subscribe to:
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`, `charge.dispute.created`.
   Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
8. Developers → API keys: put the secret key in `STRIPE_SECRET_KEY`. You may instead create a restricted key with write access to Checkout Sessions, Customers, Coupons, Billing Portal, Invoices and Subscriptions, and read access to PaymentIntents and Charges.
9. **Stripe Tax:** not required for the current model, because tax is computed by our own rules (§4). Recommended later for US sales-tax monitoring (§4.4).
10. Test first with `sk_test_` keys and a test webhook endpoint on the branch deploy, then switch to live keys.

No products or prices need creating in Stripe: prices are passed inline (USD 249 and USD 399/month) from `content/products.ts`, which a build check locks.

### 2.3 Test plan (test mode)

Apply → accept in `/admin` → open the emailed checkout link → pay with `4242 4242 4242 4242`. Check that the status page shows **Payment received** and that the onboarding email arrives. Repeat with `4000 0000 0000 0341` (declined): no unlock.
Let a Checkout session expire (2 h): the admin shows "expired" and the applicant can pay again.
Subscribe with the offer link: the first charge is $249 (credit applied) and later charges are $399. Cancel in the portal: the status page shows it ending at period end.

### 2.4 Security notes

- Rotate a key immediately if it is ever pasted anywhere other than Netlify.
- The admin password and `PATHWAY_SECRET` protect personal data. Keep them in a password manager.

### 2.5 Owner Stripe questions (18)

| # | Question | Recommended option | Why |
|---|---|---|---|
| 1 | Who owns the Stripe account? | Concordia Sports Agency SIA (the contracting entity in every policy) | The seller on invoices must match the Terms. |
| 2 | Is there an existing Stripe account? | Use it if it belongs to the SIA; otherwise create one | Avoids a second KYC process. |
| 3 | Payout currency and bank? | EUR to the SIA's Latvian bank account; Stripe converts USD | Simplest accounting in Latvia. Confirm with the accountant. |
| 4 | Charge in USD? | Yes: USD 249 and USD 399/month, as published | The site's prices are in USD. |
| 5 | Payment methods? | Cards, Apple Pay and Google Pay (Stripe defaults). No delayed methods at first | Immediate confirmation keeps the funnel simple. |
| 6 | Statement descriptor? | `CONCORDIA SOCCER` | Recognisable, which lowers disputes. |
| 7 | Invoices or receipts only for $249? | Invoices on (default) | A VAT invoice is needed for EU B2C/B2B buyers. |
| 8 | Invoice numbering prefix? | `CSP-` | Separates Pathway invoices from agency invoices. |
| 9 | Who handles refunds? | Owner, from the Stripe dashboard; the webhook records them | Refunds are rare, under the policy. |
| 10 | Failed renewal: retries and then? | Smart Retries, then cancel the subscription | Matches Pathway Terms §7. |
| 11 | Cancellation mode in the portal? | At period end | Matches Pathway Terms §5 (end of the paid month). |
| 12 | Allow pausing? | No | Not described in the Terms. |
| 13 | Customer emails from Stripe? | Receipts and refunds on; our system sends the rest | Avoids duplicate messages. |
| 14 | Stripe Tax now? | No (our rules); turn on monitoring later | See §4. |
| 15 | Radar rules? | Defaults, plus block when CVC fails | Fraud baseline. |
| 16 | Dispute contact? | mail@concordia.football | — |
| 17 | Test or live at launch? | Test on the branch deploy first, then live | A clean go-live. |
| 18 | Who has dashboard access? | Owner (admin), plus accountant (read-only/analyst) | Least privilege. |

---

## 3. Email (Resend)

1. Create a Resend account (team owner: a Concordia address). The EU region is recommended if offered at signup.
2. **Domains → Add domain:** use a sending subdomain such as `mail.concordia.football`, which keeps the main domain's reputation separate.
3. Add the DNS records Resend shows at the DNS host of `concordia.football`:
   - **SPF:** a TXT record (and an MX record for bounces) on the sending subdomain, values as shown by Resend.
   - **DKIM:** a TXT record (`resend._domainkey…`) with the public key shown by Resend.
   - **DMARC:** on `_dmarc.concordia.football`, if there isn't one already: `v=DMARC1; p=none; rua=mailto:mail@concordia.football`. Move to `p=quarantine` after two clean weeks.
4. Wait until Resend shows the domain as **Verified**.
5. **API Keys → Create:** "Sending access" for that domain only. Put it in `RESEND_API_KEY`.
6. Set `EMAIL_FROM` (e.g. `Concordia Soccer <pathway@mail.concordia.football>`), `EMAIL_REPLY_TO` (`mail@concordia.football`) and `PATHWAY_INTERNAL_EMAIL`.
7. Redeploy. Submit a test application with your own email. You should receive the confirmation ("We received your European Pathway application") and the internal email ("NEW PATHWAY APPLICATION — …").
8. **Bounces and complaints:** visible in Resend → Emails. Every send result is also stored on the application (admin → Emails). A failed send never blocks the funnel, and the admin can resend from the record.
9. Transactional emails carry no marketing. Marketing consent is recorded separately at application and no marketing emails are sent by this system.

Postmark can replace Resend later: only `lib/server/email.ts` changes.

---

## 4. Tax: model and accountant confirmation

`lib/tax.ts` implements the rules below, and `npm run test:tax` covers them. The amount charged never changes by location: published prices are final prices.

| Customer | Latvian VAT treatment | Checkout data | Invoice treatment |
|---|---|---|---|
| US individual | Outside the scope of Latvian VAT: place of supply is the customer's residence (VAT Directive Art. 59(c); Latvian VAT Law Art. 20). Not "0% VAT". | Country of residence (declared), billing address (Stripe), card country (Stripe) | "Not subject to Latvian VAT — place of supply outside the EU (Art. 59(c))". VAT return line for supplies outside Latvia ⚑ |
| Latvian individual | Latvian VAT at 21%, included in the price | Country, billing address | VAT invoice showing the 21% included |
| Other EU individual | Latvian VAT at 21%, included (Art. 45; not OSS) | Country, billing address | VAT invoice showing the 21% included |
| EU business with a valid VAT No. (not LV) | Reverse charge: no Latvian VAT (Art. 44, Art. 196) | Business name, VAT number (checked live in VIES), country | "Reverse charge" with the customer's VAT number. EC Sales List ⚑ |
| EU business without a valid VAT No. | Treated as a consumer: Latvian VAT 21% included | As above | VAT invoice |
| Latvian business | Domestic Latvian VAT 21% | Business name, VAT number | VAT invoice |
| Non-EU individual | Outside the scope (Art. 59(c)) | Country, billing address, card country | "Not subject to Latvian VAT" |
| Non-EU business | Outside the scope (Art. 44) | Business name, country | "Not subject to Latvian VAT — place of supply outside the EU (Art. 44)" |

**Classification:** personalised, human-delivered football career consultancy. It is **not** an electronically supplied service (Implementing Regulation 282/2011, Art. 7: services must be essentially automated with minimal human intervention). Treated as consultancy under Art. 59(c). If the service ever becomes predominantly club introductions, revisit this (cf. *Gray & Farrar*, EWCA 2023).

**Evidence and minimisation:** the declared country, the Stripe billing country, the card country and the request country (Netlify geo) are stored on the payment. A mismatch is flagged in the admin and in the internal email for manual review. Nothing beyond what the invoice needs is collected.

### 4.1 Accountant confirmation required (⚑)

1. The consultancy classification under Art. 59(c) and Latvian VAT Law Art. 20 for non-EU consumers.
2. VAT-return lines for outside-scope supplies (we assumed line 48.2) and for reverse-charge B2B (plus EC Sales List PVN 2).
3. Invoice wording in Latvian and English for each case, and whether Stripe-generated invoices meet Latvian invoice requirements (Latvian VAT Law Art. 125). Otherwise, use invoices from your accounting system.
4. USD invoicing: show the EUR equivalent of VAT at the ECB rate (or another permitted rate) on EU invoices.
5. Evidence rule: is the declared country plus one Stripe signal (billing or card country) enough, and what to do on a mismatch.
6. Treatment of the $150 credit (a discount on the first subscription invoice; no VAT adjustment to the assessment invoice).
7. Refund and credit-note process.
8. Retention period for invoices and payment records under Latvian accounting law.

### 4.2 Six specific answers

1. **Is a US customer charged Latvian VAT?** No. It is outside the scope of Latvian VAT, not "0%".
2. **Is it an electronically supplied service?** No: there is substantial human involvement.
3. **Does VAT change the price?** No. Prices are final. For EU consumers the 21% is included; elsewhere nothing is added.
4. **Is OSS needed?** No. EU B2C supplies are taxed in Latvia under Art. 45.
5. **Is 21% hardcoded?** No. It is a single constant (`PATHWAY_LV_VAT_RATE` can override it) and all labels derive from it.
6. **Is a VIES check needed?** Yes, for EU (non-LV) businesses claiming the reverse charge. It runs live at checkout and the result is recorded.

### 4.3 Receipts and invoices

Every invoice carries: Concordia Sports Agency SIA · Reg. No. 40203574668 · VAT No. LV40203574668 · Krišjāņa Valdemāra iela 33A–4A, Rīga, LV-1010, Latvia. It also carries the buyer's details and the tax note above.

### 4.4 US sales tax (high level)

Remote sellers must collect state sales tax only after passing a state's economic-nexus threshold (commonly $100,000 in sales or 200 transactions a year; it varies by state). Services are often not taxable, but some states tax services broadly (e.g. Hawaii, New Mexico, South Dakota, West Virginia). Recommendation: monitor sales by state (Stripe Tax's monitoring report does this without collecting) and review with a US adviser before any state's threshold is approached.

---

## 5. Owner information required before launch

Each group says why it matters and what breaks without it. Recommended defaults are already implemented unless marked.

**A. Business and contact.** Why: the seller identity on invoices and policies. Breaks: invoices and legal pages.
- A dedicated Pathway inbox? *Recommended:* keep `mail@concordia.football` (implemented).
- Customer-support phone? *Recommended:* none, email only (implemented).

**B. Payments.** Why: nothing can be sold without them. Breaks: the $249 and $399 checkouts. See §2.5.

**C. Email.** Why: confirmations, acceptances and onboarding links. Breaks: the applicant never hears back. See §3.

**D. Credit.** Why: offer clarity. Breaks: the credit window copy.
- Window to use the $150 credit? *Recommended:* 14 days after the call (implemented and flagged).
- Credit if the customer withdraws or a chargeback happens? *Recommended:* void (implemented).

**E. Subscription.** Why: ROSCA, the California ARL and EU consumer law require clear terms. Breaks: subscription checkout.
- Minimum term? *Recommended:* none (implemented; "designed as 6 months" is guidance only).
- Cancellation effect? *Recommended:* end of the paid month, online via the portal (implemented).
- Notice before a price change? *Recommended:* 30 days (implemented in Terms §9).
- Renewal reminder? *Recommended:* the monthly Stripe receipt is enough; no annual plan exists.

**F. Withdrawal and early start.** Why: EU consumer law (CRD Art. 14 and 16). Breaks: refund disputes.
- *Recommended:* an optional, unticked early-start box. Without it, the assessment begins after 14 days and the admin is blocked from starting earlier (implemented).

**G. Data and retention.** Why: GDPR Art. 5 and Art. 13. Breaks: Privacy Policy accuracy.
- Rejected applications: 12 months; customers: 3 years after the service plus accounting periods; injury data: deleted after completion (implemented, flagged).
- DPO? *Recommended:* not required at this scale. Contact: mail@concordia.football.

**H. Minors.** Why: GDPR Art. 8, FIFA rules and contract capacity. Breaks: the minors flow.
- Minimum age? *Recommended:* 16 to apply, with a guardian applying and paying under 18 (implemented).

**I. Booking.** Why: delivery of the call. Breaks: the "assessment ready" email has no booking link.
- *Recommended:* Calendly or Cal.com with an EU data location. Set `NEXT_PUBLIC_BOOKING_URL`.

**J. Content and launch.** Why: honesty rules. Breaks: production mode.
- E15: permission for Victor's testimonial (transcript, consent, date).
- HOLD photos (see `scripts/check-content.mts` output), final portraits, and register URL E19.

---

## 6. Admin operations

`/admin` (password) lists applications with filters. Each record shows the timeline, emails, payment and tax evidence, materials and files. Actions:
start review → accept / not accept → (webhook: payment) → start materials review → request info / **confirm sufficient** (the only start of the 7-day period) → assessment ready (report and booking link) → call completed (creates the $150 credit) → offer European Pathway.

Applicants are never accepted automatically.

---

## 7. Launch checklist

1. Set all **required** variables (§1) with test Stripe keys and deploy the branch.
2. Run the test plan in §2.3 end to end with a real inbox.
3. Accountant signs off §4.1. Owner answers §5.
4. Resolve E15 and the HOLD photos, so that `npm run check:content` passes in production mode.
5. Switch to live Stripe keys and a live webhook endpoint. Set `NEXT_PUBLIC_SITE_MODE=production` and remove the `X-Robots-Tag: noindex` header from `netlify.toml`. Point the domain.
6. Make a $249 live payment with your own card, then refund it from Stripe. The admin should show it paid, then refunded.

## 8. Local testing

```
npm run build
PATHWAY_ALLOW_TEST_TRANSPORTS=1 PATHWAY_SECRET=<32+ chars> PATHWAY_ADMIN_PASSWORD=<pw> PATHWAY_INTERNAL_EMAIL=ops@example.com npx next start
```

Test transports (a local `.data/` file store and an email "outbox") work only off Netlify and only with that flag.
