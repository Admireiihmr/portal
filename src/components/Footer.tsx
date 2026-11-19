import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <div className="footer-logos">
            <Image src="/images/iihmr.png" alt="IIHMR Bangalore" width={900} height={192} />
            <span className="sep" />
            <Image src="/images/admire.png" alt="ADMIRE – Center for Advancing Digital Health" width={900} height={507} />
          </div>
          <p className="footer-about">Foundation Day Idea Presentation, organised by IIHMR Bangalore with ADMIRE, the Center for Advancing Digital Health.</p>
        </div>
        <nav aria-label="Footer">
          <p className="mono">Event</p>
          <a href="#about">About</a>
          <a href="#rules">Rules</a>
          <a href="#journey">How it works</a>
          <a href="#awards">Awards</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div>
          <p className="mono">Contact</p>
          <p className="contact">
            Any queries or issues? Contact <a href="mailto:admire@iihmrbangalore.edu.in">admire@iihmrbangalore.edu.in</a>
          </p>
          <a href="#submit" className="footer-cta">
            Submit your abstract →
          </a>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>© {new Date().getFullYear()} IIHMR Bangalore</span>
        <span>
          Some photographs from{" "}
          <a href="https://www.pexels.com" target="_blank" rel="noreferrer">
            Pexels
          </a>
        </span>
      </div>
    </footer>
  );
}
