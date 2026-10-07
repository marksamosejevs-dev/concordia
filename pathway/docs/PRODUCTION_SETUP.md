# Concordia Soccer · European Pathway — owner setup

Short, literal checklist. Secrets go **only** into Netlify environment variables. Never put them in the repo or in chat.
Until a service is configured, the matching feature refuses honestly (for example "Online payment is not available yet").
`/admin` shows a live checklist of what is missing, plus the owner decisions still pending.

---

## 1. Netlify (existing project `concordia-soccer`)

1. Open app.netlify.com and choose the **concordia-soccer** project. Do not create a new project. Do not touch the Agency project.
2. **Project configuration → Build & deploy → Build settings** must show: Base directory `pathway`, Build command `npm run build`, Publish directory `pathway/.next`. All three are already set by `netlify.toml`, so nothing needs changing.
3. **Next.js runtime:** automatic. Netlify detects Next.js and applies its Next.js runtime; no plugin needs installing.
   - The build log should contain a line like `@netlify/plugin-nextjs` and the step `Functions bundling … ___netlify-server-handler`.
   - Verified locally on 7 Oct 2026 with Netlify CLI 27 and `@netlify/plugin-nextjs` 5.16 (offline build plus the generated server function).
4. **Blobs (the application database):** automatic, nothing to enable. Data lives in the site-wide store `pathway` in the EU region (`eu-central-1`).
   - To view it: **Project → Blobs** (or **Storage → Blobs**, depending on the UI version).
5. **Project configuration → Environment variables → Add a variable.** Variables, scope "All scopes" unless noted:

   | Variable | Secret? | Value |
   |---|---|---|
   | `PATHWAY_SECRET` | yes | 48+ random characters from a password manager |
   | `PATHWAY_ADMIN_PASSWORD` | yes | 16+ characters, for `/admin` |
   | `PATHWAY_INTERNAL_EMAIL` | no | the Concordia team inbox for new applications (comma-separated allowed) |
   | `EMAIL_FROM` | no | e.g. `Concordia Soccer <pathway@notify.concordia.football>` |
   | `EMAIL_REPLY_TO` | no | a real, monitored Concordia mailbox |
   | `RESEND_API_KEY` | yes | from Resend (§3) |
   | `STRIPE_SECRET_KEY` | yes | `sk_test_…` first, `sk_live_…` at launch (§2) |
   | `STRIPE_WEBHOOK_SECRET` | yes | `whsec_…` for the matching endpoint (§2) |
   | `NEXT_PUBLIC_BOOKING_URL` | no | your Cal.com or Calendly link (optional; without it the player is told you'll email) |
   | `SITE_URL` | no | the public production domain, e.g. `https://soccer.concordia.football` (production scope only) |

   - Use the "Contains secret values" option for the secrets.
   - Never prefix a secret with `NEXT_PUBLIC_`.
   - Keep test keys on branch deploys and live keys on Production only (set different values per deploy context).
6. **Deploys → Trigger deploy → Clear cache and deploy site.**
7. **Verify after the deploy:**
   - `https://<deploy>/football-law` returns 308 to `/european-pathway`.
   - `https://<deploy>/admin` shows the login screen.
   - `POST https://<deploy>/api/stripe/webhook` returns 503 `not_configured` until the Stripe variables are set, and 400 `invalid_signature` after.
   - Submitting the Apply form returns a CS-#### reference.
8. **Logs:**
   - Function logs: **Logs → Functions → `___netlify-server-handler`** (all API routes run in this one function).
   - Webhook deliveries: Stripe → Developers → Webhooks → your endpoint → event attempts.

## 2. Stripe

1. Log in to (or create) the Stripe account for **CONCORDIA SPORTS AGENCY SIA**, Latvia.
2. **Verification.** Stripe usually asks for:
   - the company registration number (40203574668), registered address and VAT number;
   - the representative's ID document and date of birth;
   - beneficial owners (25%+) and directors;
   - the website URL and a product description ("football career assessment and advisory services, delivered by people");
   - sometimes proof of address or company documents from the Latvian Register of Enterprises.
3. **Bank account:** Settings → Business → Bank accounts → add the SIA's EUR account. Stripe converts USD to EUR.
4. **Branding:** Settings → Business → Branding (logo, colour). Statement descriptor: `CONCORDIA SOCCER`.
5. **Products and prices:** do not create any. The app sends USD 249 and USD 399/month to Checkout itself, so they always match the site. The $150 credit coupon is also created by the app, one per paid assessment.
6. **API keys:** Developers → API keys → "Secret key" (in Test mode first) → put it in Netlify as `STRIPE_SECRET_KEY`.
7. **Webhook:** Developers → Webhooks → Add endpoint → `https://<your-domain>/api/stripe/webhook` (exactly; no trailing slash). Events:
   - `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`;
   - `invoice.paid`, `invoice.payment_failed`;
   - `customer.subscription.updated`, `customer.subscription.deleted`;
   - `charge.refunded`, `charge.dispute.created`.

   Reveal the signing secret and put it in Netlify as `STRIPE_WEBHOOK_SECRET`. Redeploy.
8. **Customer Portal** (Settings → Billing → Customer portal): enable it now, but only for **updating payment methods and viewing invoices**. Turn **cancellation** on only after you choose the cancellation option (owner decision 2), configured to match that option.
9. **Test mode sequence:**
   1. Apply on the site, then accept in `/admin`.
   2. Pay $249 with card `4242 4242 4242 4242`. The status page shows "Payment received" and the onboarding link arrives. Nothing unlocks on the success page alone.
   3. Repeat with `4000 0000 0000 0002` (declined). Nothing unlocks.
   4. Send materials, then click **Confirm materials sufficient** in admin. With early start ticked, the 7-day period starts now; without it, the start is scheduled for the end of the 14 days and the player can press "Ask us to start now".
   5. Mark the assessment ready, then the call completed. The $150 credit is created (no expiry). Click **Offer European Pathway**.
   6. Subscribe from the email link. The first charge is $249 (the $150 credit) and the next invoice is $399.
   7. Failed renewal: Stripe → the subscription → change the card to `4000 0000 0000 0341` → advance the test clock. The status page shows "payment overdue".
   8. Cancellation: only after the cancellation decision. Cancel in the portal and check that the status page shows the end date.
10. **Live mode:**
    - switch Stripe to Live and create a **new** live webhook endpoint (it has a different `whsec_`);
    - put `sk_live_…` and the live `whsec_…` in the Netlify **Production** context;
    - deploy, make one real $249 payment, then refund it.
11. **Stripe Tax:** not needed at launch (see §5).

## 3. Resend (transactional email)

1. Create an account at resend.com with a Concordia team address.
2. **Domains → Add domain:** `notify.concordia.football` (a sending-only subdomain keeps the main domain's reputation separate). Choose the EU region if offered.
3. Add the DNS records Resend shows at the DNS host of `concordia.football`:
   - **SPF:** a TXT record, plus an MX record, on the sending subdomain.
   - **DKIM:** a TXT record at `resend._domainkey.notify…`.
   - **DMARC:** a TXT record at `_dmarc.concordia.football`, only if none exists yet. Start with `p=none` and a reporting address.

   Use exactly the values Resend generates.
4. **FROM:** `Concordia Soccer <pathway@notify.concordia.football>` (no mailbox needed).
5. **REPLY-TO:** a real monitored mailbox. The Agency site already publishes `mail@concordia.football`; use it or a dedicated one.
6. **Internal destination:** the team mailbox that should receive "NEW PATHWAY APPLICATION …" emails.
7. **API Keys → Create API key:** "Sending access", restricted to that domain. Put it in Netlify as `RESEND_API_KEY`.
8. Add `EMAIL_FROM`, `EMAIL_REPLY_TO` and `PATHWAY_INTERNAL_EMAIL` in Netlify.
9. Redeploy.
10. **Test with your own address:**
    - the application reaches Concordia (internal email) and the player (confirmation);
    - acceptance;
    - payment received;
    - materials (internal);
    - materials confirmed or scheduled;
    - assessment ready;
    - Pathway offer;
    - withdrawal acknowledgement.

    Every send result is logged on the application in `/admin`; a failed email never shows as sent.

## 4. Owner decisions (in `content/business-rules.ts`)

A production-mode build refuses to run while any rule is still "proposed". The current proposed defaults work, but they are not approved:

| Rule | Proposed default | Status |
|---|---|---|
| Credit eligibility window | none (no expiry) | **confirmed by owner** |
| Cancellation | end of paid month, online | proposed |
| Minimum age | 16 (guardian contracts under 18) | proposed |
| Price/VAT model | final price everywhere | proposed |

## 5. Tax

`lib/tax.ts` is a **technical model**, not a final VAT position. EUR-Lex, likumi.lv and VID were not reachable from the build environment. The accountant must confirm it (the message is in the final report).

- **Stripe Tax:** not needed for launch. Our rules set the Latvian VAT treatment, Checkout collects the billing address and VAT ID, and Billing issues invoices. Turn on Stripe Tax's free **US monitoring** when US sales grow.
- **US sales tax:** nothing to register before the first sale. Review when sales into any one state approach about $100,000 or 200 transactions a year (thresholds vary by state), or before any US office or staff exists.

## 6. Data (Netlify Blobs)

- **Export:** `/admin` → "Export all (JSON)" downloads every record (backup, migration, data-subject access).
- **Erasure:** on an application → "Erase personal data (GDPR)" removes personal data and files, and keeps only the payment and invoice references accounting law requires.
- **Migration path:** each record is a single JSON document, so moving to Postgres or Supabase later means importing the export.
