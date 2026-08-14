import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Manifesto from "@/components/Manifesto";
import PlayerRoster from "@/components/PlayerRoster";
import Expertise from "@/components/Expertise";
import FootballLegal from "@/components/FootballLegal";
import GlobalNetwork from "@/components/GlobalNetwork";
import Philosophy from "@/components/Philosophy";
import Agency from "@/components/Agency";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import PlayerPhoto from "@/components/PlayerPhoto";
import { players } from "@/data/players";

export default function Home() {
  const playerPhotos = Object.fromEntries(
    players.map((player) => [
      player.slug,
      <PlayerPhoto
        key={player.slug}
        player={player}
        className="absolute inset-0"
        sizes="(min-width: 1024px) 45vw, 100vw"
      />,
    ]),
  );

  return (
    <>
      <Navigation logo={<Logo />} />
      <main>
        <Hero />
        <Ticker />
        <Manifesto />
        <PlayerRoster playerPhotos={playerPhotos} />
        <Ticker />
        <Expertise />
        <FootballLegal />
        <GlobalNetwork />
        <Philosophy />
        <Agency />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
