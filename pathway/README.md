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

Review deployments: branch `claude/dreamy-meitner-xavjbk` → https://claude-dreamy-meitner-xavjbk--concordia-soccer.netlify.app (noindex).

## Round 1 revision (founder feedback)

- Homepage rebuilt in `components/home/` — 11 sections: hero → proof → decision → $249 assessment → $399/month European Pathway → career team → real football → parents/players → video testimonials → how it works → final offer.
- Core offer: `content/products.ts` (`catalogue: "core"`) and `content/pathway.ts`. All subscription/cancellation wording is in `PATHWAY_TERMS` — change it there once terms are final.
- Product page: `/european-pathway`. Former programmes stay in the data model as `catalogue: "legacy"` (noindex, not linked).
- Images: `npm run build:images` writes responsive WebP variants to `public/_img` (git-ignored); `lib/image-loader.ts` serves them. Runs automatically in `dev`, `build` and `build:export`.
- OG image: `node scripts/build-og.mjs` → `app/opengraph-image.png`.
- SEO: `app/robots.ts` (disallows everything in review mode), `app/sitemap.ts`, canonicals, homepage JSON-LD. Set `NEXT_PUBLIC_SITE_URL` once the production domain is decided.
