import { IS_REVIEW } from "./site-mode";

/** Production origin. Set NEXT_PUBLIC_SITE_URL once the domain is decided (founder Q9). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://concordia-soccer.netlify.app").replace(/\/$/, "");
/** Review builds are never indexable (robots meta + robots.txt + X-Robots-Tag header in netlify.toml). */
export const INDEXABLE = !IS_REVIEW;
/** Canonical path in the export's trailing-slash form. */
export const canonical = (path: string) => (path === "/" ? "/" : `${path.replace(/\/$/, "")}/`);

/** Routes listed in the sitemap (indexable, public pages only). */
export const SITEMAP_ROUTES = ["/", "/assessment", "/european-pathway", "/pricing", "/how-it-works", "/for/players", "/for/parents", "/about", "/about/marks-amosejevs", "/about/inside-football", "/verify", "/players", "/agency", "/careers", "/markets", "/find-your-path", "/football-law", "/representation", "/faq", "/legal/terms", "/legal/privacy", "/legal/refunds", "/legal/company"];
