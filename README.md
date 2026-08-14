# Concordia Sports Agency — concordia.football

Official website for Concordia Sports Agency, built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
```

## Adding real assets

The site ships with elegant on-brand placeholders wherever a real asset hasn't
been supplied yet. Drop the real file at the exact path below and the site
will automatically use it — no code changes required.

- **Logo** — `public/brand/concordia-logo.svg` (or `.png`). Until present, the
  navigation and footer render a text wordmark fallback.
- **Player photographs** — `public/players/<slug>.jpg`, matching each
  player's `photo` path in `data/players.ts` (e.g. `renars-varslavans.jpg`).
  Until present, an on-brand monochrome placeholder with the player's
  initials is shown instead.

Asset presence is checked on the server via `lib/server-assets.ts`
(`fs.existsSync`), so a rebuild/redeploy picks up newly added files.

## Editing content

- **Roster & player data** — `data/players.ts`. Add a new player object to
  extend the roster; the grid, filters, featured player and profile modal
  all render dynamically from this file. Only verified facts should be
  filled in — omit any field that can't be confirmed rather than guessing.
- **Expertise / services copy** — `data/services.ts`.

## Structure

```
app/            routes, layout, metadata, sitemap/robots
components/     UI components (one per section, plus shared primitives)
data/           players.ts, services.ts — the site's editable content
lib/            small helpers (cn, server-only asset existence check)
public/brand/   logo (add real file here)
public/players/ player photographs (add real files here)
```
