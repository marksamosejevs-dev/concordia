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
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
              colorInterpolationFilters="sRGB"
            >
              <feComponentTransfer result="gammaAdj">
                <feFuncR type="gamma" amplitude="1" exponent="1.15" offset="0" />
                <feFuncG type="gamma" amplitude="1" exponent="1.15" offset="0" />
                <feFuncB type="gamma" amplitude="1" exponent="1.15" offset="0" />
              </feComponentTransfer>
              <feComponentTransfer in="gammaAdj" result="contrasted">
                <feFuncR type="linear" slope="1.22" intercept="-0.09" />
                <feFuncG type="linear" slope="1.22" intercept="-0.09" />
                <feFuncB type="linear" slope="1.22" intercept="-0.09" />
              </feComponentTransfer>
              <feConvolveMatrix
                order="3"
                kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
                divisor="1"
                bias="0"
                edgeMode="duplicate"
                preserveAlpha="true"
                in="contrasted"
                result="sharpened"
              />
              <feGaussianBlur in="sharpened" stdDeviation="0.3" result="soft" />
              <feColorMatrix
                in="soft"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="rOnly"
              />
              <feOffset in="rOnly" dx="0.45" dy="0" result="rShift" />
              <feColorMatrix
                in="soft"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="gOnly"
              />
              <feColorMatrix
                in="soft"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="bOnly"
              />
              <feOffset in="bOnly" dx="-0.45" dy="0" result="bShift" />
              <feBlend in="rShift" in2="gOnly" mode="screen" result="rg" />
              <feBlend in="rg" in2="bShift" mode="screen" result="chroma" />
              <feComponentTransfer in="chroma" result="brightMask">
                <feFuncR type="linear" slope="2.5" intercept="-1.85" />
                <feFuncG type="linear" slope="2.5" intercept="-1.85" />
                <feFuncB type="linear" slope="2.5" intercept="-1.85" />
              </feComponentTransfer>
              <feGaussianBlur in="brightMask" stdDeviation="1.8" result="bloom" />
              <feBlend in="chroma" in2="bloom" mode="screen" />
            </filter>
            <filter
              id="illustrated-photo-hero"
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
              colorInterpolationFilters="sRGB"
            >
              <feComponentTransfer result="gammaAdj">
                <feFuncR type="gamma" amplitude="1" exponent="1.08" offset="0" />
                <feFuncG type="gamma" amplitude="1" exponent="1.08" offset="0" />
                <feFuncB type="gamma" amplitude="1" exponent="1.08" offset="0" />
              </feComponentTransfer>
              <feComponentTransfer in="gammaAdj" result="contrasted">
                <feFuncR type="linear" slope="1.15" intercept="-0.06" />
                <feFuncG type="linear" slope="1.15" intercept="-0.06" />
                <feFuncB type="linear" slope="1.15" intercept="-0.06" />
              </feComponentTransfer>
              <feConvolveMatrix
                order="3"
                kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
                divisor="1"
                bias="0"
                edgeMode="duplicate"
                preserveAlpha="true"
                in="contrasted"
                result="sharpened"
              />
              <feGaussianBlur in="sharpened" stdDeviation="0.25" result="soft" />
              <feComponentTransfer in="soft" result="brightMask">
                <feFuncR type="linear" slope="2.2" intercept="-1.8" />
                <feFuncG type="linear" slope="2.2" intercept="-1.8" />
                <feFuncB type="linear" slope="2.2" intercept="-1.8" />
              </feComponentTransfer>
              <feGaussianBlur in="brightMask" stdDeviation="1.2" result="bloom" />
              <feBlend in="soft" in2="bloom" mode="screen" />
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
