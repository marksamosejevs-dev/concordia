import type { Metadata, Viewport } from "next";
import "@fontsource/anton/400.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/600.css";
import "@fontsource/public-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCta } from "@/components/layout/StickyCta";
import { ReviewBar } from "@/components/layout/ReviewBar";
import { AudienceProvider } from "@/components/layout/Audience";
import { AttributionCapture } from "@/components/layout/AttributionCapture";
import { IS_REVIEW } from "@/lib/site-mode";

export const metadata: Metadata = {
  title: { default: "Concordia Soccer · European Pathway — Professional football career assessment", template: "%s · Concordia Soccer · European Pathway" },
  description: "Before you choose Europe, find out where you actually stand. Professional football career assessment and advisory from a team working inside European football, led by FIFA Licensed Football Agent Marks Amosejevs.",
  robots: IS_REVIEW ? { index: false, follow: false } : undefined,
  openGraph: { siteName: "Concordia Soccer · European Pathway", type: "website" },
};

export const viewport: Viewport = { themeColor: "#0D1B36", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:bg-route focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <AudienceProvider>
          <AttributionCapture />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <StickyCta />
          <ReviewBar />
        </AudienceProvider>
      </body>
    </html>
  );
}
