import Reveal from "./Reveal";
import AnimatedArrow from "./AnimatedArrow";

export default function Contact() {
  return (
    <section id="contact" className="dark-section bg-ink px-5 py-28 text-paper sm:px-8 sm:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <h2 className="text-[clamp(2.8rem,9vw,7.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em]">
            Let&rsquo;s talk
            <br />
            football.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <a
            href="mailto:mail@concordia.football"
            className="group mt-12 inline-flex items-center gap-4 border-b border-paper pb-2 text-2xl font-medium sm:text-3xl"
          >
            Start a Conversation
            <AnimatedArrow className="text-2xl sm:text-3xl" />
          </a>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-line-invert pt-10 font-mono text-sm uppercase tracking-[0.12em] sm:mt-20 sm:grid-cols-3">
            <div>
              <p className="text-paper/60">Email</p>
              <a href="mailto:mail@concordia.football" className="mt-2 block hover:text-paper/70">
                mail@concordia.football
              </a>
            </div>
            <div>
              <p className="text-paper/60">Instagram</p>
              <a
                href="https://instagram.com/concordia.football"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block hover:text-paper/70"
              >
                @concordia.football
              </a>
            </div>
            <div>
              <p className="text-paper/60">Location</p>
              <p className="mt-2">Riga, Latvia</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
