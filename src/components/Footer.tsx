import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="logos big">
          <Image src="/images/iihmr.png" alt="IIHMR Bangalore" width={900} height={192} />
          <span className="sep" />
          <Image src="/images/admire.png" alt="ADMIRE – Center for Advancing Digital Health" width={900} height={507} />
        </div>
        <p>Foundation Day Idea Presentation · IIHMR Bangalore</p>
        <p className="dim">ADMIRE – Center for Advancing Digital Health</p>
        <p className="dim credit">Some photographs from <a href="https://www.pexels.com" target="_blank" rel="noreferrer">Pexels</a>.</p>
      </div>
    </footer>
  );
}
