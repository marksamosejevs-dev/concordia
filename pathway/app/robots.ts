import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/apply/", "/checkout/", "/partners/", "/onboarding/", "/assessment-status/", "/book-call/", "/review/", "/__forms.html"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
