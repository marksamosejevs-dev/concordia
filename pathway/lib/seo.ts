import { IS_REVIEW } from "./site-mode";

/** Production origin. Set NEXT_PUBLIC_SITE_URL once the domain is decided (founder Q9). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://concordia-soccer.netlify.app").replace(/\/$/, "");
/** Review builds are never indexable (robots meta + robots.txt + X-Robots-Tag header in netlify.toml). */
export const INDEXABLE = !IS_REVIEW;
/** Canonical path (no trailing slash — the server deployment's URL form). */
export const canonical = (path: string) => (path === "/" ? "/" : path.replace(/\/$/, ""));

/** Routes listed in the sitemap (indexable, public pages only). */
export const SITEMAP_ROUTES = ["/", "/assessment", "/european-pathway", "/pricing", "/how-it-works", "/for/players", "/for/parents", "/about", "/about/inside-football", "/players", "/agency", "/careers", "/markets", "/find-your-path", "/representation", "/faq", "/legal/terms", "/legal/assessment-terms", "/legal/pathway-terms", "/legal/refunds", "/legal/privacy", "/legal/cookies", "/legal/minors", "/legal/complaints", "/legal/company"];
