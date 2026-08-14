import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

export default function Agency() {
  return (
    <section id="agency" className="bg-paper px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="08" label="Agency" className="text-grey-500" />
              <h2 className="mt-4 text-[clamp(2.4rem,6vw,4.75rem)] font-bold uppercase leading-[0.94] tracking-[-0.02em]">
                More than
                <br />
                representation.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1} className="space-y-6 text-lg leading-relaxed text-grey-500">
              <p>
                Concordia Sports Agency supports professional footballers across the
                decisions that shape their careers.
              </p>
              <p>
                Our multidisciplinary approach combines football representation, legal
                expertise, commercial strategy and personal support under one coordinated
                structure.
              </p>
              <p className="text-ink">
                The player focuses on performance. Concordia manages the complexity around
                the career.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
