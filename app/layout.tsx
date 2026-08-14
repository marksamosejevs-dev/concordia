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
    default: "Concordia Sports Agency | Football Representation & Career Management",
    template: "%s | Concordia Sports Agency",
  },
  description:
    "Concordia Sports Agency provides professional football representation, transfer management, legal expertise, career strategy and commercial support for professional players across Europe and international markets.",
  keywords: [
    "Concordia Sports Agency",
    "football agent",
    "player representation",
    "football transfers",
    "FIFA agent",
    "football contracts",
    "career management",
    "Latvia football agency",
  ],
  authors: [{ name: "Concordia Sports Agency" }],
  openGraph: {
    title: "Concordia Sports Agency | Football Representation & Career Management",
    description:
      "Strategic representation and career management for professional footballers. Transfers, contracts, legal expertise, commercial strategy and personal support — under one coordinated strategy.",
    url: siteUrl,
    siteName: "Concordia Sports Agency",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concordia Sports Agency",
    description:
      "Strategic representation and career management for professional footballers.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
