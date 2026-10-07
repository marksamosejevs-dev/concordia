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
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { MagneticLayer } from "@/components/ui/MagneticLayer";
import { SITE_URL, INDEXABLE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Concordia Soccer · European Pathway — Play football in Europe", template: "%s · Concordia Soccer" },
  description: "Player assessment ($249) and monthly European football career management ($399/month) for US players — led by FIFA Licensed Football Agent Marks Amosejevs.",
  robots: INDEXABLE ? undefined : { index: false, follow: false },
  openGraph: { siteName: "Concordia Soccer · European Pathway", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0D1B36", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:bg-route focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <AudienceProvider>
          <AttributionCapture />
          <MagneticLayer />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <StickyCta />
          <ReviewBar />
          <ConsentBanner />
        </AudienceProvider>
      </body>
    </html>
  );
}
