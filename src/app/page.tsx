import Awards from "@/components/Awards";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MobileCta from "@/components/MobileCta";
import Navbar from "@/components/Navbar";
import PhotoTicker from "@/components/PhotoTicker";
import SideNav from "@/components/SideNav";
import Steps from "@/components/Steps";
import SubmitForm from "@/components/SubmitForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <SideNav />
      <main>
        <Hero />

        <div className="tickers">
          <PhotoTicker />
        </div>

        <Steps />
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
