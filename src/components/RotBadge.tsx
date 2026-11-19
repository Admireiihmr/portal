"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useId } from "react";

/** Circular text badge that spins as the page scrolls. The centre number stays upright. */
export default function RotBadge({ text, centre, className = "", light = true }: { text: string; centre: string; className?: string; light?: boolean }) {
  const id = useId();
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, (v) => v * 0.3);
  return (
    <div className={`rotbadge ${light ? "light" : "dark"} ${className}`} aria-hidden="true">
      <motion.svg viewBox="0 0 120 120" style={{ rotate }}>
        <defs>
          <path id={id} d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="292" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <div className="ctr">
        <i>{centre}</i>
      </div>
    </div>
  );
}
