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
        {children}
      </body>
    </html>
  );
}
