import Awards from "@/components/Awards";
import BigCta from "@/components/BigCta";
import BigWord from "@/components/BigWord";
import CountUp from "@/components/CountUp";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Funnel from "@/components/Funnel";
import Hero from "@/components/Hero";
import HorizontalRules from "@/components/HorizontalRules";
import Magnetic from "@/components/Magnetic";
import Navbar from "@/components/Navbar";
import PhotoTicker from "@/components/PhotoTicker";
import Reveal from "@/components/Reveal";
import SideNav from "@/components/SideNav";
import Spiral from "@/components/Spiral";
import SplitHeading from "@/components/SplitHeading";
import SubmitForm from "@/components/SubmitForm";
import Ticker from "@/components/Ticker";
import ZoomBand from "@/components/ZoomBand";
import { STATS, TICKER_A, TICKER_B } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Navbar />
      <SideNav />
      <main>
        <Hero />

        <div className="tickers">
          <Ticker items={TICKER_A} speed={-3} variant="indigo" />
          <Ticker items={TICKER_B} speed={3} variant="yellow" />
          <PhotoTicker />
        </div>

        <section id="about" className="sec">
          <div className="wrap about">
            <div>
              <Reveal>
                <p className="eyebrow">(01) About the event</p>
              </Reveal>
              <SplitHeading text={"A stage for the ideas\nthat will shape\nhealthcare"} />
              <Reveal delay={0.15}>
                <p className="sub">
                  Foundation Day is IIHMR Bangalore&rsquo;s annual celebration. This year, students take the spotlight. Share an idea in any area of
                  health, hospitals, pharma or digital health, and the best fifteen will present to a panel of experts and win awards.
                </p>
                <Magnetic>
                  <a href="#submit" className="btn btn-indigo big" data-cursor="Go">
                    Submit your abstract <span aria-hidden>→</span>
                  </a>
                </Magnetic>
              </Reveal>
            </div>
            <div className="stats">
              {STATS.map((s, i) => (
                <Reveal key={s.label} from="flip" delay={i * 0.1}>
                  <div className="stat">
                    <div className="n">
                      <CountUp to={s.to} suffix={s.suffix} />
                    </div>
                    <div className="l">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <BigWord dir={-1}>IDEAS · INNOVATE · IMPACT ·</BigWord>

        <HorizontalRules />
        <Spiral />
        <Funnel />
        <ZoomBand />
        <Awards />
        <BigWord dir={1}>YOUR IDEA · YOUR STAGE ·</BigWord>
        <SubmitForm />
        <Faq />
        <BigCta />
      </main>
      <Footer />
    </>
  );
}
