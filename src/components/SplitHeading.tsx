"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const parent: Variants = { hidden: {}, show: {} };

/**
 * Headline whose words rise out of a mask, one after another, when scrolled into view. Use "\n" for line breaks.
 * The in-view trigger lives on the heading itself: the words start clipped by their mask, and an element that is
 * fully clipped never counts as "in view".
 */
export default function SplitHeading({ text, as = "h2", className = "" }: { text: string; as?: "h1" | "h2" | "h3"; className?: string }) {
  const reduce = useReducedMotion();
  const MTag = motion[as];
  const lines = text.split("\n");
  let k = 0;
  return (
    <MTag
      className={`split ${className}`}
      aria-label={text.replace(/\n/g, " ")}
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {lines.map((ln, li) => (
        <span className="sl" key={li} aria-hidden="true">
          {ln.split(" ").map((w) => {
            const delay = 0.05 * k++;
            return (
              <span className="sw" key={k}>
                <motion.span
                  variants={{
                    hidden: { y: reduce ? "0%" : "118%" },
                    show: { y: "0%", transition: { duration: 0.95, ease: [0.2, 0.8, 0.2, 1], delay } },
                  }}
                >
                  {w}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </MTag>
  );
}
