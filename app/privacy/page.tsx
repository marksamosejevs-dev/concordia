import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy of Concordia Sports Agency SIA.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navigation logo={<Logo />} />
      <main className="mx-auto max-w-3xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-grey-500">Legal</p>
        <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
          Privacy Policy
        </h1>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-grey-500">
          <p>
            Concordia Sports Agency SIA (&ldquo;Concordia&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your
            privacy. This page will be updated with our full Privacy Policy, describing what
            personal data we collect, how it is used, and the rights available to you under
            applicable data protection law, including the EU General Data Protection
            Regulation.
          </p>
          <p>
            For any questions regarding data protection, please contact us at{" "}
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
