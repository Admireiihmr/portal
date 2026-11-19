"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Ticker from "./Ticker";

/** Closing statement: a giant link whose letters fill with colour on hover. */
export default function BigCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["2.5%", "-2.5%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);
  return (
    <section ref={ref} className="bigcta" aria-label="Submit your idea">
      <a href="#submit">
        <motion.span className="line" style={{ x: x1 }}>
          Have an idea?
        </motion.span>
        <motion.span className="line out" style={{ x: x2 }}>
          Pitch it <em aria-hidden>↗</em>
        </motion.span>
      </a>
      <Ticker items={["Submit your abstract", "Meet the panel", "Win on stage"]} speed={-4} variant="yellow" />
    </section>
  );
}
