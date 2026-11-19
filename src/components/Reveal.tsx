"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  from?: "up" | "left" | "right" | "flip";
  className?: string;
};

/** Scroll-triggered entrance: slide, or 3D flip. Falls back to no motion when the visitor prefers that. */
export default function Reveal({ children, delay = 0, from = "up", className }: Props) {
  const reduce = useReducedMotion();
  const initial = reduce
    ? { opacity: 1 }
    : from === "left"
      ? { opacity: 0, x: -60 }
      : from === "right"
        ? { opacity: 0, x: 60 }
        : from === "flip"
          ? { opacity: 0, y: 50, rotateX: 40, transformPerspective: 900 }
          : { opacity: 0, y: 40 };
  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
