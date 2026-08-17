import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://concordia.football";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Concordia Sports Agency | FIFA Licensed Football Agency",
    template: "%s | Concordia Sports Agency",
  },
  description:
    "Concordia Sports Agency is a FIFA-licensed football agency representing professional players and connecting talent, clubs and football markets across Europe.",
  keywords: [
    "Concordia Sports Agency",
    "Concordia Sports Agency football",
    "Concordia football agency",
    "Concordia Sports Agency Latvia",
    "Concordia Sports Agency Riga",
    "football agent",
    "player representation",
    "football transfers",
    "FIFA agent",
    "football contracts",
    "career management",
    "Latvia football agency",
    "Riga football agency",
  ],
  authors: [{ name: "Concordia Sports Agency" }],
  openGraph: {
    title: "Concordia Sports Agency | Football Representation",
    description:
      "FIFA-licensed football representation connecting players, clubs and football professionals across European and international markets.",
    url: siteUrl,
    siteName: "Concordia Sports Agency",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Concordia Sports Agency — FIFA Licensed Football Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Concordia Sports Agency | Football Representation",
    description:
      "FIFA-licensed football representation connecting players, clubs and football professionals across European and international markets.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "Concordia Sports Agency",
  legalName: "Concordia Sports Agency SIA",
  alternateName: "Concordia Football",
  url: siteUrl,
  logo: `${siteUrl}/brand/concordia-logo.jpg`,
  image: `${siteUrl}/og-image.jpg`,
  description:
    "Concordia Sports Agency is a FIFA-licensed football representation agency built in Europe and connected globally, representing professional and emerging players and connecting talent, clubs and football markets across Europe.",
  email: "mail@concordia.football",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Krišjāņa Valdemāra iela 33A-4A",
    addressLocality: "Rīga",
    postalCode: "LV-1010",
    addressCountry: "LV",
  },
  sameAs: ["https://instagram.com/concordia.football"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
          <defs>
            <filter
              id="illustrated-photo"
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feColorMatrix type="saturate" values="0" result="gray" />
              <feComponentTransfer in="gray" result="contrasted">
                <feFuncR type="linear" slope="1.35" intercept="-0.16" />
                <feFuncG type="linear" slope="1.35" intercept="-0.16" />
                <feFuncB type="linear" slope="1.35" intercept="-0.16" />
              </feComponentTransfer>
              <feComponentTransfer in="contrasted" result="posterized">
                <feFuncR type="discrete" tableValues="0 0.12 0.28 0.46 0.64 0.8 0.92 1" />
                <feFuncG type="discrete" tableValues="0 0.12 0.28 0.46 0.64 0.8 0.92 1" />
                <feFuncB type="discrete" tableValues="0 0.12 0.28 0.46 0.64 0.8 0.92 1" />
              </feComponentTransfer>
              <feConvolveMatrix
                order="3"
                kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
                divisor="1"
                bias="0"
                edgeMode="duplicate"
                preserveAlpha="true"
                in="posterized"
                result="sharpened"
              />
              <feComponentTransfer in="sharpened">
                <feFuncR type="linear" slope="1.05" intercept="-0.02" />
                <feFuncG type="linear" slope="1.05" intercept="-0.02" />
                <feFuncB type="linear" slope="1.05" intercept="-0.02" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
