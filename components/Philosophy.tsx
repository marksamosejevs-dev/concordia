import Reveal from "./Reveal";

const PRINCIPLES = [
  { number: "01", title: "Individual Strategy" },
  { number: "02", title: "Long-Term Thinking" },
  { number: "03", title: "Complete Representation" },
];

export default function Philosophy() {
  return (
    <section className="dark-section bg-ink px-5 py-24 text-paper sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <h2 className="max-w-4xl text-[clamp(2.6rem,7vw,6rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
            The player
            <br />
            is the project.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/60">
            Every career is different. Our role is to understand the player, define the
            strategy and manage the decisions that shape both performance and long-term
            success.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-10 border-t border-line-invert pt-12 sm:mt-24 sm:grid-cols-3 sm:gap-8">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.number} delay={0.1 + i * 0.1}>
              <span className="font-mono text-sm text-paper/40">{principle.number}</span>
              <p className="mt-4 text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl">
                {principle.title}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
