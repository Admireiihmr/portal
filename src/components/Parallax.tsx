"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/** Moves (and optionally rotates) its content a little as it scrolls through the viewport. */
export default function Parallax({ children, className, y = 40, rotate = 0 }: { children: ReactNode; className?: string; y?: number; rotate?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ty = useTransform(scrollYProgress, [0, 1], [y, -y]);
  const r = useTransform(scrollYProgress, [0, 1], [-rotate, rotate]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y: ty, rotate: r }}>
      {children}
    </motion.div>
  );
}
