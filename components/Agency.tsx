import Image from "next/image";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import PersonPhoto from "./PersonPhoto";
import { publicAssetExists } from "@/lib/server-assets";
import { team } from "@/data/team";

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

        <div className="mt-20 border-t border-line pt-12 sm:mt-24">
          <Reveal>
            <SectionLabel label="Founding Team" className="text-grey-500" />
          </Reveal>
          <div className="mt-8 space-y-14">
            {team.map((member, i) => {
              const hasLicenseImage = member.licenseImage && publicAssetExists(member.licenseImage);
              return (
                <Reveal key={member.id} delay={0.06 * i}>
                  <div className="flex flex-wrap items-center gap-8">
                    <PersonPhoto
                      photo={member.photo}
                      name={member.name}
                      className="h-40 w-40 shrink-0 sm:h-48 sm:w-48"
                    />
                    <div>
                      <p className="text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl">
                        {member.name}
                      </p>
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-grey-500">
                        {member.title}
                      </p>
                      {member.credential && (
                        <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-grey-400">
                          {member.credential}
                        </p>
                      )}
                    </div>
                    {hasLicenseImage && (
                      <div className="relative aspect-[1010/650] w-full max-w-xs shrink-0 overflow-hidden border border-line sm:ml-auto sm:w-80">
                        <Image
                          src={member.licenseImage!}
                          alt={`${member.name} — FIFA Football Agent license`}
                          fill
                          sizes="(min-width: 640px) 320px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
