"use client";
import { AnimatePresence, animate, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSetIntroReady } from "./Providers";

/** Short branded intro: a counter, then the curtain lifts. Shown once per browser session. */
export default function Preloader() {
  const setReady = useSetIntroReady();
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      if (sessionStorage.getItem("fd-intro")) skip = true;
      sessionStorage.setItem("fd-intro", "1");
    } catch {
      /* storage unavailable: just show it */
    }
    if (skip) {
      setShow(false);
      setReady(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const c = animate(0, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setShow(false);
        setReady(true);
      },
    });
    return () => {
      c.stop();
      document.documentElement.style.overflow = "";
    };
  }, [setReady]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="pl-logos">
            <Image src="/images/iihmr.png" alt="" width={900} height={192} priority />
            <span className="sep" />
            <Image src="/images/admire.png" alt="" width={900} height={507} priority />
          </div>
          <div className="pl-mid">
            <span className="pl-small">Foundation Day</span>
            <span className="pl-count">{String(n).padStart(2, "0")}</span>
          </div>
          <div className="pl-bar">
            <motion.i style={{ scaleX: n / 100 }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
