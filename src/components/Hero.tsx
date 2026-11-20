"use client";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DEADLINE_TEXT } from "@/lib/config";
import Icon from "./Icon";
import Magnetic from "./Magnetic";

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(true);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const f = () => setDesktop(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  const zoom = desktop && !reduce;

  // Desktop zoom scroll: the photo card's own box grows to full-bleed, so the photo always fits its frame.
  const k = useTransform(p, [0, 0.55], [1, 0]);
  const top = useTransform(k, (v) => `${16 * v}vh`);
  const bottom = useTransform(k, (v) => `${10 * v}vh`);
  const left = useTransform(k, (v) => `${52 * v}vw`);
  const right = useTransform(k, (v) => `${4 * v}vw`);
  const radius = useTransform(k, (v) => `${20 * v}px`);
  const imgScale = useTransform(p, [0, 1], [1, 1.15]);
  const shadeO = useTransform(p, [0.15, 0.55], [0, 1]);
  const contentO = useTransform(p, [0.18, 0.45], [1, 0]);
  const contentY = useTransform(p, [0, 1], [0, -120]);
  const tagO = useTransform(p, [0.6, 0.82], [0, 1]);
  const tagY = useTransform(p, [0.6, 0.85], [24, 0]);
  // Both layers fill the stage; only the visible one may receive clicks, or the invisible one swallows them.
  const tagPE = useTransform(tagO, (v) => (v > 0.5 ? "auto" : "none"));
  const copyPE = useTransform(contentO, (v) => (v > 0.3 ? "auto" : "none"));

  // subtle pointer parallax on the card (desktop only, fades out as it expands)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useTransform([useSpring(mx, { stiffness: 60, damping: 18 }), k], ([a, b]) => (a as number) * (b as number) * 14);
  const py = useTransform([useSpring(my, { stiffness: 60, damping: 18 }), k], ([a, b]) => (a as number) * (b as number) * 10);

  const rise = (d: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.7, ease },
  });

  return (
    <section
      ref={ref}
      id="top"
      className={`hero ${zoom ? "zoom" : "static"}`}
      aria-label="Foundation Day Idea Presentation"
      onPointerMove={(e) => {
        if (!zoom) return;
        mx.set((e.clientX / window.innerWidth - 0.5) * 2);
        my.set((e.clientY / window.innerHeight - 0.5) * 2);
      }}
    >
      <div className="hero-stage">
        <div className="hero-grid" aria-hidden />

        {/* keyed by mode: framer-motion leaves inline styles behind when a style prop is removed,
            so switching desktop ↔ phone must remount these elements */}
        <motion.div
          key={zoom ? "media-zoom" : "media-static"}
          className="hero-media"
          style={zoom ? { top, bottom, left, right, borderRadius: radius, x: px, y: py } : undefined}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
        >
          <motion.div className="hero-img" style={zoom ? { scale: imgScale } : undefined}>
            <Image src="/images/iihmr-campus-facade.jpg" alt="The IIHMR Bangalore campus building" fill priority quality={90} sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: "cover", objectPosition: "38% 60%" }} />
          </motion.div>
          {zoom && <motion.div className="hero-shade" style={{ opacity: shadeO }} />}
          <span className="hero-caption">
            <Icon name="pin" size={14} /> IIHMR Bangalore · Electronic City
          </span>
        </motion.div>

        <motion.div key={zoom ? "copy-zoom" : "copy-static"} className="hero-copy" style={zoom ? { opacity: contentO, y: contentY, pointerEvents: copyPE } : undefined}>
          <motion.p className="hero-pill" {...rise(0.05)}>
            <i className="live" aria-hidden /> Foundation Day 2026 · Submissions open
          </motion.p>
          <h1>
            {["Foundation Day", "Idea Presentation"].map((line, i) => (
              <span className="hl" key={line}>
                <motion.span initial={{ y: reduce ? 0 : "110%" }} animate={{ y: 0 }} transition={{ delay: 0.12 + i * 0.1, duration: 0.9, ease }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero-lead" {...rise(0.35)}>
            Have an idea that could improve healthcare? Submit a short abstract. Fifteen students will present to an expert panel on Foundation Day.
          </motion.p>
          <motion.div className="hero-cta" {...rise(0.45)}>
            <Magnetic>
              <a href="#submit" className="btn btn-primary btn-lg">
                Submit your abstract <Icon name="arrow" size={18} />
              </a>
            </Magnetic>
            <a href="#rules" className="btn btn-ghost btn-lg">
              Read the rules
            </a>
          </motion.div>
          <motion.dl className="hero-facts" {...rise(0.55)}>
            <div>
              <dt>Finalists</dt>
              <dd>15</dd>
            </div>
            <div>
              <dt>Awards</dt>
              <dd>6</dd>
            </div>
            <div>
              <dt>Deadline</dt>
              <dd className="sm">{DEADLINE_TEXT}</dd>
            </div>
          </motion.dl>
        </motion.div>

        {zoom && (
          <motion.div className="hero-tag" style={{ opacity: tagO, y: tagY, pointerEvents: tagPE }}>
            <p className="mono">IIHMR Bangalore × ADMIRE</p>
            <h2>
              Fifteen ideas.
              <br />
              One stage.
            </h2>
            <a href="#submit" className="btn btn-primary btn-lg">
              Be one of them <Icon name="arrow" size={18} />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
