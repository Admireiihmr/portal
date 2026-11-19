"use client";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef, type ReactNode } from "react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Framer-style scroll-velocity ticker: drifts at a base speed, accelerates with scroll speed
 * and reverses direction when you scroll back up. Pass `items` for text, or `children` for anything else.
 */
export default function Ticker({
  items,
  children,
  speed = -3,
  variant = "indigo",
}: {
  items?: string[];
  children?: ReactNode;
  speed?: number; // % of one copy per second; negative = leftwards
  variant?: "indigo" | "yellow" | "photos";
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const hover = useRef(1);
  const hovered = useRef(false);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    hover.current += ((hovered.current ? 0 : 1) - hover.current) * 0.08; // eases to a stop on hover
    let move = dir.current * speed * (delta / 1000) * hover.current;
    const f = factor.get();
    if (f < -0.05) dir.current = -1;
    else if (f > 0.05) dir.current = 1;
    move += dir.current * move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  const group = (k: number) => (
    <div className="tk-group" key={k} aria-hidden={k > 0}>
      {children ??
        items?.map((t) => (
          <span className="tk-item" key={t}>
            {t}
          </span>
        ))}
    </div>
  );

  return (
    <div
      className={`ticker ${variant}`}
      role={variant === "photos" ? "group" : "presentation"}
      aria-label={variant === "photos" ? "Photos from IIHMR Bangalore events" : undefined}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <motion.div className="tk-track" style={{ x }}>
        {[0, 1, 2, 3].map(group)}
      </motion.div>
    </div>
  );
}
