import { SITE_URL } from "@/lib/seo";
import { LEGAL_ENTITY, LICENCE, BRAND } from "@/content/site";
import { product } from "@/content/products";
import { PATHWAY_TERMS } from "@/content/pathway";

/** Basic schema.org graph for the homepage: Organization, Person (credential holder), and the two offers. */
export function StructuredData() {
  const a = product("assessment"); const p = product("pathway");
  const org = `${SITE_URL}/#organization`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": org, name: BRAND.full, legalName: LEGAL_ENTITY.name, url: SITE_URL, vatID: LEGAL_ENTITY.vatNo, address: { "@type": "PostalAddress", streetAddress: LEGAL_ENTITY.address[0], addressLocality: "Rīga", postalCode: "LV-1010", addressCountry: "LV" }, founder: { "@id": `${SITE_URL}/#marks-amosejevs` } },
      { "@type": "Person", "@id": `${SITE_URL}/#marks-amosejevs`, name: LICENCE.holder, jobTitle: "Co-Founder · FIFA Licensed Football Agent", description: "FIFA Licensed Football Agent", worksFor: { "@id": org }, url: `${SITE_URL}/about/#team` },
      { "@type": "Service", name: a.name, provider: { "@id": org }, serviceType: "Football career assessment", areaServed: "US", offers: { "@type": "Offer", price: a.price, priceCurrency: "USD", url: `${SITE_URL}/assessment/` } },
      { "@type": "Service", name: p.name, provider: { "@id": org }, serviceType: "Football career management", description: PATHWAY_TERMS.horizon, areaServed: "US", offers: { "@type": "Offer", priceCurrency: "USD", url: `${SITE_URL}/european-pathway/`, priceSpecification: { "@type": "UnitPriceSpecification", price: p.price, priceCurrency: "USD", unitCode: "MON", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } } } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
