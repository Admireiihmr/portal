import Awards from "@/components/Awards";
import CountUp from "@/components/CountUp";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import Funnel from "@/components/Funnel";
import Hero from "@/components/Hero";
import Guidelines from "@/components/Guidelines";
import MobileCta from "@/components/MobileCta";
import Navbar from "@/components/Navbar";
import PhotoTicker from "@/components/PhotoTicker";
import Reveal from "@/components/Reveal";
import SideNav from "@/components/SideNav";
import Steps from "@/components/Steps";
import SplitHeading from "@/components/SplitHeading";
import SubmitForm from "@/components/SubmitForm";
import Ticker from "@/components/Ticker";
import Tilt from "@/components/Tilt";
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
                <p className="label">01 — About</p>
              </Reveal>
              <SplitHeading text="A stage for student ideas that could change healthcare" className="measure" />
              <Reveal delay={0.1}>
                <p className="intro">
                  Foundation Day is IIHMR Bangalore&rsquo;s annual celebration. This year students take the spotlight: share an idea from any area of health,
                  hospitals, pharma or digital health, and fifteen of you will present to an expert panel.
                </p>
              </Reveal>
            </div>
            <dl className="stats">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.06}>
                  <Tilt className="stat" max={6} lift={1.03}>
                    <dd>
                      <CountUp to={s.to} suffix={s.suffix} />
                    </dd>
                    <dt>{s.label}</dt>
                  </Tilt>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        <Guidelines />
        <Steps />
        <Funnel />
        <Awards />
        <SubmitForm />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
