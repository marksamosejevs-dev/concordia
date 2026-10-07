import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { DocFigure } from "@/components/cards/DocFigure";
import { photos, insideFootballStrip, archive } from "@/content/photos";
import { FinalCta } from "@/components/sections/HomeSections";

export const metadata: Metadata = { alternates: { canonical: "/about/inside-football" }, description: "Documentary photographs from inside European football — the federations, clubs, stadiums and professional education behind Concordia Soccer.", title: "Inside European football — archive" };

export default function InsideFootball() {
  return (
    <>
      <PageHero eyebrow="Archive" title="Moments from a career spent inside the game." lede="Documentary photographs. Captions state facts only once they are confirmed; no photograph implies partnership, endorsement or a client relationship." />
      <Section tone="ink" label="Archive" className="!pt-6">
        <div className="wrap columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-8 [&>*]:break-inside-avoid">
          {[...insideFootballStrip, ...archive].map((id) => <DocFigure key={id} photo={photos[id]} className="relative" />)}
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
