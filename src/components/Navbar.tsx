"use client";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const LINKS = [
  ["About", "#about"],
  ["Rules", "#rules"],
  ["Journey", "#journey"],
  ["Awards", "#awards"],
  ["FAQ", "#faq"],
] as const;

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  return (
    <header className={`nav ${solid ? "solid" : ""}`}>
      <motion.div className="nav-progress" style={{ scaleX: scrollYProgress }} />
      <div className="nav-in">
        <a href="#top" className="logos" aria-label="IIHMR Bangalore and ADMIRE">
          <Image src="/images/iihmr.png" alt="IIHMR Bangalore" width={900} height={192} priority />
          <span className="sep" />
          <Image src="/images/admire.png" alt="ADMIRE – Center for Advancing Digital Health" width={900} height={507} priority />
        </a>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h}>
              {l}
            </a>
          ))}
        </nav>
        <a href="#submit" className="btn btn-yellow nav-cta">
          Submit<span className="xs-hide"> your idea</span>
        </a>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {LINKS.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)}>
                {l}
              </a>
            ))}
            <a href="#submit" className="btn btn-yellow" onClick={() => setOpen(false)}>
              Submit your idea
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
