# Concordia Soccer · European Pathway

Separate Next.js app for the consumer advisory brand. Lives in `pathway/` inside the shared
repository; the Concordia Sports Agency site at the repository root is untouched and builds on its own.

```bash
cd pathway
npm install
npm run dev            # http://localhost:3100
npm run build:export   # static export → out/ (what Netlify deploys)
npm run check:content  # publication guard (runs before every build)
```

## Site modes
- `NEXT_PUBLIC_SITE_MODE=review` (default): pending/hold content renders with a dashed outline and a `PENDING · E#` tag.
- `NEXT_PUBLIC_SITE_MODE=production`: only cleared content renders; the content guard fails the build on HOLD photos, unapproved testimonials or enabled creator pages.

Evidence references (E#) map to `../docs/FACTUAL_EVIDENCE_REGISTER.md`.

## Structure
- `content/` — typed, CMS-ready content (team, products, credentials, FAQ, cases, testimonials, countries, photos, creators, sample report).
- `lib/commerce/` — product/order/subscription model, access rules, payment-provider abstraction (preview provider only; no live payments).
- `lib/applications/` — application schema, rules-based triage, configurable destination (`NEXT_PUBLIC_APPLICATION_ENDPOINT`).
- `lib/attribution.ts` — first/last-touch UTM, referral code and partner capture, carried into application and order payloads.
- `scripts/` — logo system (`build:logo`), Europe map (`build:map`), content guard.

## Netlify (project #2 only)
Base directory `pathway` · build `npm run build:export` · publish `out` · Node 22 — all set in `pathway/netlify.toml`,
which Netlify reads only when the base directory is `pathway`. The Agency project (base directory = repository root) is unaffected.
