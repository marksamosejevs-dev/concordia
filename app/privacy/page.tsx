import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy of Concordia Sports Agency SIA.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-line pt-8 first:mt-10 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-bold uppercase tracking-tight text-ink sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-grey-500">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <>
      <Navigation logo={<Logo />} />
      <main className="mx-auto max-w-3xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-grey-500">Legal</p>
        <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
          Privacy Policy
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-grey-400">
          Last updated: August 2026
        </p>

        <Section title="1. Who we are">
          <p>
            Concordia Sports Agency SIA (&ldquo;Concordia&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or
            &ldquo;our&rdquo;) is a football representation agency registered in Latvia, with its
            registered office at Krišjāņa Valdemāra iela 33A&ndash;4A, Rīga, LV-1010, Latvia
            (registration number 40203574668, VAT number LV40203574668).
          </p>
          <p>
            This Privacy Policy explains how we collect, use, share and protect personal data
            in connection with our website, concordia.football, and our activities as a
            football agency, in accordance with the EU General Data Protection Regulation
            (&ldquo;GDPR&rdquo;) and applicable Latvian data protection law.
          </p>
        </Section>

        <Section title="2. Who this policy applies to">
          <p>This policy applies to personal data we process about:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>players we represent or are in discussions to represent, and their families;</li>
            <li>
              clubs, federations, agents, sponsors and other football and commercial contacts;
            </li>
            <li>visitors to our website; and</li>
            <li>
              individuals who contact us, including through email or our social media
              channels.
            </li>
          </ul>
        </Section>

        <Section title="3. Data we collect">
          <p>Depending on our relationship with you, we may collect:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">Identification and contact data</span> — name, date of
              birth, nationality, contact details, identification and immigration documents;
            </li>
            <li>
              <span className="text-ink">Football career data</span> — club history, position,
              contract terms, transfer history, performance and market-value information;
            </li>
            <li>
              <span className="text-ink">Financial data</span> — details required to negotiate,
              draft or perform contracts, and to coordinate with a player&rsquo;s financial and
              legal advisors;
            </li>
            <li>
              <span className="text-ink">Correspondence</span> — emails, messages and records of
              calls or meetings connected to our representation and advisory services;
            </li>
            <li>
              <span className="text-ink">Website and usage data</span> — technical information
              such as IP address, browser type and pages visited, collected via cookies as
              described in our{" "}
              <a href="/cookies" className="text-ink underline underline-offset-4">
                Cookie Policy
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section title="4. How we collect data">
          <p>We collect personal data:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>directly from you or, where applicable, your parent or legal guardian;</li>
            <li>
              from clubs, federations (including FIFA and national associations), co-agents and
              other football industry counterparts in the course of representation and
              transfer activity;
            </li>
            <li>
              from publicly available football sources (such as official club and federation
              announcements and established football databases); and
            </li>
            <li>automatically through your use of our website.</li>
          </ul>
        </Section>

        <Section title="5. Why we process your data">
          <p>We process personal data on the following legal bases:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">Performance of a contract</span> — to provide
              representation, negotiate contracts and transfers, and manage the commercial and
              career matters covered by our mandate;
            </li>
            <li>
              <span className="text-ink">Legitimate interests</span> — to operate and improve
              our business and website, maintain our professional network, and protect our
              legal rights;
            </li>
            <li>
              <span className="text-ink">Legal obligation</span> — to comply with FIFA and
              national federation regulations, immigration and employment law, and other
              applicable legal requirements; and
            </li>
            <li>
              <span className="text-ink">Consent</span> — where we ask for it specifically, for
              example for certain marketing communications, and which you may withdraw at any
              time.
            </li>
          </ul>
        </Section>

        <Section title="6. Minors">
          <p>
            As a FIFA-licensed agency authorized to represent minors, we may process personal
            data belonging to players under the age of 18. In these cases, we act with the
            involvement and consent of the minor&rsquo;s parent or legal guardian, in line with
            FIFA and national federation regulations governing the representation of minors,
            and we apply additional care when handling this data.
          </p>
          <p>
            If you believe we hold personal data about a minor without appropriate parental or
            guardian involvement, please contact us using the details in Section 11 and we will
            address it promptly.
          </p>
        </Section>

        <Section title="7. Who we share data with">
          <p>We may share personal data with:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>clubs, federations and other counterparts involved in a specific transaction;</li>
            <li>
              legal, financial, tax and other professional advisors engaged in connection with
              our representation services;
            </li>
            <li>
              service providers who support our operations (such as IT, hosting and website
              services), under confidentiality and data-processing terms; and
            </li>
            <li>regulators, courts or authorities where required by law.</li>
          </ul>
          <p>We do not sell personal data.</p>
        </Section>

        <Section title="8. International transfers">
          <p>
            Football representation is international by nature. Where personal data is
            transferred outside the European Economic Area, we take steps to ensure it remains
            protected, including through contractual safeguards recognised under GDPR.
          </p>
        </Section>

        <Section title="9. Data retention">
          <p>
            We retain personal data for as long as necessary to fulfil the purposes described
            in this policy, including any period required to satisfy legal, regulatory,
            accounting or reporting requirements, and for as long as needed to establish,
            exercise or defend legal claims.
          </p>
        </Section>

        <Section title="10. Your rights">
          <p>Under GDPR, you have the right to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>request access to the personal data we hold about you;</li>
            <li>request correction of inaccurate or incomplete data;</li>
            <li>request erasure of your data, in certain circumstances;</li>
            <li>request restriction of, or object to, certain processing;</li>
            <li>request portability of data you have provided to us; and</li>
            <li>withdraw consent at any time, where processing is based on consent.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us using the details below. You also have
            the right to lodge a complaint with Latvia&rsquo;s Data State Inspectorate
            (Datu valsts inspekcija) or another competent supervisory authority.
          </p>
        </Section>

        <Section title="11. Contact us">
          <p>
            For any questions about this Privacy Policy or how we handle personal data, please
            contact us at{" "}
            <a href="mailto:mail@concordia.football" className="text-ink underline underline-offset-4">
              mail@concordia.football
            </a>
            {" "}or write to us at Krišjāņa Valdemāra iela 33A&ndash;4A, Rīga, LV-1010, Latvia.
          </p>
        </Section>

        <Section title="12. Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            practices or for other operational, legal or regulatory reasons. The date at the
            top of this page indicates when it was last revised.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
