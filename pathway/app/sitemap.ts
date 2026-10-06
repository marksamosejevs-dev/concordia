import type { MetadataRoute } from "next";
import { SITE_URL, SITEMAP_ROUTES, canonical } from "@/lib/seo";
import { countries } from "@/content/countries";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...SITEMAP_ROUTES, ...countries.filter((c) => c.marketStatus === "live").map((c) => `/markets/${c.iso.toLowerCase()}`)];
  return routes.map((r) => ({ url: `${SITE_URL}${canonical(r)}`, changeFrequency: "monthly", priority: r === "/" ? 1 : r === "/assessment" || r === "/european-pathway" ? 0.9 : 0.6 }));
}
