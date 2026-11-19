"use client";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type TargetAndTransition } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Magnetic from "./Magnetic";
import { useIntroReady } from "./Providers";
import RotBadge from "./RotBadge";

const WORDS: [string, boolean][] = [
  ["Foundation", false],
  ["Day", false],
  ["Idea", true],
  ["Presentation", true],
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const ready = useIntroReady();
  const [mobile, setMobile] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const f = () => setMobile(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  // Zoom scroll: the building starts as a clear photo card beside the text and grows to full-bleed.
  // The card's own box is animated (not a clip over a full-screen image), so the photo always fits its frame.
  const t = useTransform(p, [0, 0.55], [0, 1]);
  const k = useTransform(t, (v) => (reduce ? 0 : 1 - v));
  const top = useTransform(k, (v) => `${(mobile ? 56 : 15) * v}vh`);
  const bottom = useTransform(k, (v) => `${(mobile ? 5 : 11) * v}vh`);
  const left = useTransform(k, (v) => `${(mobile ? 6 : 51) * v}vw`);
  const right = useTransform(k, (v) => `${5 * v}vw`);
  const radius = useTransform(k, (v) => `${32 * v}px`);
  const imgScale = useTransform(p, [0, 1], reduce ? [1, 1] : [1, 1.18]);
  const shadeO = useTransform(p, [0.12, 0.55], [0, 1]);
  const contentO = useTransform(p, [0.2, 0.5], [1, 0]);
  const contentY = useTransform(p, [0, 1], [0, -140]);
  const tagO = useTransform(p, [0.58, 0.8], [0, 1]);
  const tagS = useTransform(p, [0.58, 0.85], [0.85, 1]);
  const floatO = useTransform(p, [0.1, 0.3], [1, 0]);
  const hintO = useTransform(p, [0, 0.1], [0.9, 0]);

  // Mouse parallax on the photo card (fades out as the card expands)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });
  const px = useTransform([sx, k], ([a, b]) => (a as number) * (b as number) * 22);
  const py = useTransform([sy, k], ([a, b]) => (a as number) * (b as number) * 16);
  const fx = useTransform(px, (v) => v * -0.9);
  const fy = useTransform(py, (v) => v * -0.9);

  const go = (to: TargetAndTransition) => (ready ? to : undefined);

  return (
    <section
      ref={ref}
      id="top"
      className="hero"
      aria-label="Foundation Day Idea Presentation"
      onPointerMove={(e) => {
        mx.set((e.clientX / window.innerWidth - 0.5) * 2);
        my.set((e.clientY / window.innerHeight - 0.5) * 2);
      }}
    >
      <div className="hero-sticky">
        <div className="hero-dots" />
        <div className="blob b1" />
        <div className="blob b2" />

        <motion.div className="hero-media" style={{ top, bottom, left, right, borderRadius: radius, x: px, y: py }}>
          <motion.div className="hero-img" style={{ scale: imgScale }}>
            <Image
              src="/images/iihmr-building.jpg"
              alt="The IIHMR Bangalore building"
              fill
              priority
              quality={90}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "42% 55%" }}
            />
          </motion.div>
          <motion.div className="hero-shade" style={{ opacity: shadeO }} />
        </motion.div>

        <motion.div className="hero-float" style={{ opacity: floatO, x: fx, y: fy }} aria-hidden="true">
          <div className="hf-badge">
            <RotBadge text="Foundation Day • Idea Presentation •" centre="15" />
          </div>
          <div className="hf-chip">
            <i />
            IIHMR Bangalore, Electronic City
          </div>
        </motion.div>

        <motion.div className="hero-content" style={{ opacity: contentO, y: contentY }}>
          <motion.p className="eyebrow yellow" initial={{ opacity: 0, y: 14 }} animate={go({ opacity: 1, y: 0 })} transition={{ delay: 0.1 }}>
            IIHMR Bangalore · ADMIRE presents
          </motion.p>
          <h1>
            {WORDS.map(([w, em], i) => (
              <span className="hw" key={w}>
                <motion.span
                  className={`w ${em ? "em" : ""}`}
                  initial={{ y: "115%" }}
                  animate={go({ y: 0 })}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.95, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={go({ opacity: 1, y: 0 })} transition={{ delay: 0.8 }}>
            Got an idea that could improve healthcare? Submit your abstract and pitch it on stage at Foundation Day.
          </motion.p>
          <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={go({ opacity: 1, y: 0 })} transition={{ delay: 0.95 }}>
            <Magnetic>
              <a href="#submit" className="btn btn-yellow big">
                Submit your abstract <span aria-hidden>→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#rules" className="btn btn-ghost big">
                Read the rules
              </a>
            </Magnetic>
          </motion.div>
          <motion.ul className="hero-chips" initial={{ opacity: 0 }} animate={go({ opacity: 1 })} transition={{ delay: 1.15 }}>
            <li>
              <b>15</b> finalists
            </li>
            <li>
              <b>6</b> awards
            </li>
            <li>
              Open to <b>IIHMR students</b>
            </li>
          </motion.ul>
        </motion.div>

        <motion.div className="hero-tag" style={{ opacity: tagO, scale: tagS }}>
          <h2>
            15 ideas.
            <br />
            <span>One stage.</span>
          </h2>
          <a href="#submit" className="btn btn-yellow big">
            Be one of them <span aria-hidden>→</span>
          </a>
        </motion.div>

        <motion.div className="scrollhint" style={{ opacity: hintO }} aria-hidden="true">
          <i />
          Scroll
        </motion.div>
      </div>
    </section>
  );
}
