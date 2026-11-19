"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Huge outlined banner text that slides sideways with the scroll. */
export default function BigWord({ children, dir = 1 }: { children: string; dir?: 1 | -1 }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : [`${-15 * dir}%`, `${15 * dir}%`]);
  return (
    <div ref={ref} className="bigword-wrap" aria-hidden="true">
      <motion.div className="bigword" style={{ x }}>
        {children}
      </motion.div>
    </div>
  );
}
