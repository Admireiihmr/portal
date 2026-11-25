import Image from "next/image";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="footer">
      <svg className="ft-waves" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M-100 ${140 + i * 7} C 300 ${60 + i * 9}, 700 ${200 - i * 5}, 1000 ${120 + i * 6} S 1400 ${60 + i * 8}, 1600 ${130 + i * 4}`} fill="none" stroke="#8f6cff" strokeWidth={i === 2 ? 2 : 1} opacity={0.15 + (i === 2 ? 0.45 : (i % 3) * 0.1)} />
        ))}
      </svg>
      {/* the campus building, tinted into the footer colour */}
      <div className="ft-building" aria-hidden>
        <Image src="/images/iihmr-campus-facade.jpg" alt="" fill sizes="420px" style={{ objectFit: "cover", objectPosition: "40% 50%" }} />
      </div>

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
          <p className="ft-h">Explore</p>
          <a href="#guidelines">Guidelines</a>
          <a href="#awards">Awards</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div>
          <p className="ft-h">Get in touch</p>
          <p className="contact">
            <Icon name="mail" size={20} />
            <span>
              Any queries or issues? Contact
              <br />
              <a href="mailto:admire@iihmrbangalore.edu.in">admire@iihmrbangalore.edu.in</a>
            </span>
          </p>
          <a href="#submit" className="btn btn-primary footer-cta">
            <Icon name="send" size={16} /> Submit Your Abstract <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>© {new Date().getFullYear()} IIHMR Bangalore. All rights reserved.</span>
        <span className="ft-tag">
          <Icon name="heartPulse" size={22} /> Advancing Digital Health Together
        </span>
      </div>
      <p className="wrap ft-credit">
        Some photographs from{" "}
        <a href="https://www.pexels.com" target="_blank" rel="noreferrer">
          Pexels
        </a>
      </p>
    </footer>
  );
}
