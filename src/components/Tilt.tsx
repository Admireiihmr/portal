"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = Omit<HTMLMotionProps<"div">, "ref"> & { as?: "div" | "article" | "li"; max?: number; lift?: number; children?: ReactNode };

/**
 * Card that tilts towards the pointer in 3D, lifts slightly on hover and shows a soft
 * spotlight that follows the cursor (CSS vars --mx/--my, see .tilt-card in globals.css).
 * Accepts the usual motion props, so entrance animations (initial/whileInView) still work.
 */
export default function Tilt({ as = "div", max = 7, lift = 1.025, className = "", style, children, onPointerMove, onPointerLeave, ...rest }: Props) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 18 });
  const M = motion[as] as typeof motion.div;

  return (
    <M
      className={`tilt-card ${className}`}
      style={reduce ? style : { ...style, rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={reduce ? undefined : { scale: lift }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        px.set(x);
        py.set(y);
        e.currentTarget.style.setProperty("--mx", `${x * 100}%`);
        e.currentTarget.style.setProperty("--my", `${y * 100}%`);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        px.set(0.5);
        py.set(0.5);
      }}
      {...rest}
    >
      {children}
    </M>
  );
}
