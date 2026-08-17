import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Cookie Policy of Concordia Sports Agency SIA.",
  alternates: {
    canonical: "https://concordia.football/cookies",
  },
};

export default function CookiesPolicy() {
  return (
    <>
      <Navigation logo={<Logo />} />
      <main className="mx-auto max-w-3xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-grey-500">Legal</p>
        <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
          Cookies
        </h1>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-grey-500">
          <p>
            concordia.football uses a minimal set of cookies required for the site to
            function correctly. This page will be updated with a full cookie disclosure as
            additional tools are added to the site.
          </p>
          <p>
            For any questions, please contact us at{" "}
            <a href="mailto:mail@concordia.football" className="text-ink underline underline-offset-4">
              mail@concordia.football
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
