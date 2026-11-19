"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";

/** 3D tilt towards the cursor with a moving spotlight. */
export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 220, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 220, damping: 20 });
  const glow = useTransform([mx, my], ([x, y]) => `radial-gradient(260px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(127,95,192,.28), transparent 65%)`);

  return (
    <motion.div
      className={`tilt ${className}`}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      <motion.span className="tilt-glow" style={{ background: glow }} aria-hidden />
      {children}
    </motion.div>
  );
}
