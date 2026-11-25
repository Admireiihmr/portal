"use client";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Icon from "./Icon";

const LINKS = [
  ["Guidelines", "#guidelines"],
  ["Awards", "#awards"],
  ["FAQ", "#faq"],
] as const;

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 24));

  // lock page scroll while the mobile sheet is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`nav ${solid || open ? "solid" : ""}`}>
      <motion.div className="nav-progress" style={{ scaleX: scrollYProgress }} />
      <div className="nav-in">
        <a href="#top" className="nav-brand" aria-label="IIHMR Bangalore and ADMIRE, back to top">
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
        <a href="#submit" className="btn btn-primary nav-cta">
          Submit abstract
        </a>
        <button className="burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="sheet"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Mobile">
              {LINKS.map(([l, h], i) => (
                <motion.a
                  key={h}
                  href={h}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.05 }}
                >
                  <span className="mono">0{i + 1}</span>
                  {l}
                  <Icon name="arrow" size={18} />
                </motion.a>
              ))}
            </nav>
            <a href="#submit" className="btn btn-primary btn-lg full" onClick={() => setOpen(false)}>
              Submit your abstract
            </a>
            <p className="sheet-note">
              Questions? <a href="mailto:admire@iihmrbangalore.edu.in">admire@iihmrbangalore.edu.in</a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
