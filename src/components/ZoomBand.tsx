"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

/** Full-screen photo that grows from a small rounded card as it scrolls into view. */
export default function ZoomBand() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(p, [0, 0.5], reduce ? [1, 1] : [0.5, 1]);
  const radius = useTransform(p, [0, 0.5], reduce ? [0, 0] : [48, 0]);
  const textO = useTransform(p, [0.3, 0.55, 0.92, 1], [0, 1, 1, 0]);
  const textY = useTransform(p, [0.3, 0.55], [50, 0]);
  return (
    <section ref={ref} className="zoomband" aria-label="Foundation Day">
      <div className="zb-stick">
        <motion.div className="zb-media" style={{ scale, borderRadius: radius }}>
          <Image src="/images/students-laptop.jpg" alt="IIHMR Bangalore students working together on a laptop" fill quality={85} sizes="100vw" style={{ objectFit: "cover", objectPosition: "50% 35%" }} />
        </motion.div>
        <motion.div className="zb-text" style={{ opacity: textO, y: textY }}>
          <p className="eyebrow yellow">IIHMR Bangalore · ADMIRE</p>
          <h2>
            Where student ideas
            <br />
            meet real impact
          </h2>
          <p>Fifteen students. One Foundation Day stage. Backed by the Center for Advancing Digital Health and live project apps.</p>
        </motion.div>
      </div>
    </section>
  );
}
