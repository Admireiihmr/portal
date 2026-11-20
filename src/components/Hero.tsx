"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { DEADLINE_TEXT } from "@/lib/config";
import Icon from "./Icon";
import Magnetic from "./Magnetic";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Glowing glass bulb with a sprout, on a lit pedestal with an orbit ring. */
function Bulb() {
  return (
    <svg className="bulb" viewBox="0 0 220 300" aria-hidden="true">
      <defs>
        <radialGradient id="bGlass" cx="45%" cy="38%" r="60%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".35" />
          <stop offset=".55" stopColor="#8f78ff" stopOpacity=".18" />
          <stop offset="1" stopColor="#5b3fd9" stopOpacity=".08" />
        </radialGradient>
        <linearGradient id="bLeaf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#7cf7e1" />
          <stop offset="1" stopColor="#e9fffb" />
        </linearGradient>
        <linearGradient id="bRing" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7b5cff" />
          <stop offset=".5" stopColor="#d7a6ff" />
          <stop offset="1" stopColor="#7b5cff" />
        </linearGradient>
        <filter id="bGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* pedestal */}
      <ellipse cx="110" cy="268" rx="80" ry="18" fill="#1d1640" />
      <ellipse cx="110" cy="258" rx="80" ry="18" fill="#2a2160" />
      <ellipse cx="110" cy="256" rx="62" ry="12" fill="none" stroke="url(#bRing)" strokeWidth="3" filter="url(#bGlow)" />

      <g className="bulb-float">
        {/* orbit ring behind */}
        <ellipse className="bulb-orbit" cx="110" cy="118" rx="104" ry="34" fill="none" stroke="url(#bRing)" strokeWidth="2.5" strokeDasharray="160 90" transform="rotate(-14 110 118)" filter="url(#bGlow)" opacity=".9" />
        {/* glass */}
        <path d="M110 30c-36 0-62 27-62 61 0 22 11 37 23 50 8 9 12 18 12 28v9h54v-9c0-10 4-19 12-28 12-13 23-28 23-50 0-34-26-61-62-61z" fill="url(#bGlass)" stroke="#b9a6ff" strokeWidth="2.5" filter="url(#bGlow)" />
        <path d="M78 64c8-12 20-18 32-19" stroke="#fff" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* sprout */}
        <path d="M110 172v-60" stroke="#9ff5e6" strokeWidth="3" strokeLinecap="round" filter="url(#bGlow)" />
        <path d="M110 128c-4-20-22-30-40-26 4 18 20 30 40 26z" fill="url(#bLeaf)" filter="url(#bGlow)" />
        <path d="M110 118c4-22 24-32 42-28-4 20-22 32-42 28z" fill="url(#bLeaf)" filter="url(#bGlow)" />
        {/* base */}
        <rect x="84" y="178" width="52" height="11" rx="5" fill="#c4b6ff" />
        <rect x="87" y="192" width="46" height="10" rx="5" fill="#9e8cf0" />
        <rect x="91" y="205" width="38" height="10" rx="5" fill="#7d6ad8" />
        <path d="M98 218h24l-5 10h-14z" fill="#5d4cb8" />
      </g>
    </svg>
  );
}

/** Flowing violet light-lines along the bottom of the hero. */
function Waves() {
  const lines = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg className="hero-waves" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="wGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b3fd9" stopOpacity="0" />
          <stop offset=".25" stopColor="#7b5cff" />
          <stop offset=".6" stopColor="#c58cff" />
          <stop offset="1" stopColor="#6f4dff" stopOpacity=".2" />
        </linearGradient>
        <filter id="wGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g className="waves-drift" filter="url(#wGlow)">
        {lines.map((i) => (
          <path
            key={i}
            d={`M-200 ${170 + i * 7} C 180 ${70 + i * 9}, 520 ${250 - i * 4}, 860 ${150 + i * 6} S 1380 ${60 + i * 10}, 1700 ${150 + i * 5}`}
            fill="none"
            stroke="url(#wGrad)"
            strokeWidth={i === 4 ? 2.2 : 1.1}
            opacity={0.4 + (i === 4 ? 0.55 : (i % 3) * 0.15)}
          />
        ))}
      </g>
    </svg>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();

  // card tilts towards the pointer (desktop pointers only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-1, 1], [-20, -8]), { stiffness: 90, damping: 18 });
  const rotX = useSpring(useTransform(my, [-1, 1], [7, 1]), { stiffness: 90, damping: 18 });

  const rise = (d: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.7, ease },
  });

  return (
    <section
      id="top"
      className="hero"
      aria-label="Foundation Day Idea Presentation"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        mx.set((e.clientX / window.innerWidth - 0.5) * 2);
        my.set((e.clientY / window.innerHeight - 0.5) * 2);
      }}
    >
      <div className="hero-glow g1" aria-hidden />
      <div className="hero-glow g2" aria-hidden />
      <Waves />

      <div className="hero-in">
        <motion.div className="hero-bulb" initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }}>
          <Bulb />
        </motion.div>

        <div className="hero-copy">
          <motion.p className="hero-pill" {...rise(0.05)}>
            <i className="live" aria-hidden /> Foundation Day 2026 • Submissions Open
          </motion.p>
          <h1>
            <span className="hl">
              <motion.span initial={{ y: reduce ? 0 : "110%" }} animate={{ y: 0 }} transition={{ delay: 0.12, duration: 0.9, ease }}>
                Foundation Day
              </motion.span>
            </span>
            <span className="hl grad">
              <motion.span initial={{ y: reduce ? 0 : "110%" }} animate={{ y: 0 }} transition={{ delay: 0.22, duration: 0.9, ease }}>
                Idea Presentation
              </motion.span>
            </span>
            <svg className="swoosh" viewBox="0 0 300 24" aria-hidden="true">
              <motion.path
                d="M4 16 C 80 4, 180 4, 296 12"
                fill="none"
                stroke="url(#swGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.75, duration: 0.9, ease }}
              />
              <defs>
                <linearGradient id="swGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#8b6cff" />
                  <stop offset="1" stopColor="#e3a8ff" />
                </linearGradient>
              </defs>
            </svg>
          </h1>
          <motion.p className="hero-lead" {...rise(0.35)}>
            Have an idea that could improve healthcare? Submit a short abstract. Fifteen students will present to an expert panel on Foundation Day.
          </motion.p>
          <motion.div className="hero-cta" {...rise(0.45)}>
            <Magnetic>
              <a href="#submit" className="btn btn-primary btn-lg">
                <Icon name="send" size={17} /> Submit Your Abstract <Icon name="arrow" size={17} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#rules" className="btn btn-glow btn-lg">
                <Icon name="book" size={18} /> Read the Rules
              </a>
            </Magnetic>
          </motion.div>
          <motion.dl className="hero-facts" {...rise(0.55)}>
            <div>
              <span className="fact-ic">
                <Icon name="users" size={20} />
              </span>
              <span>
                <dt>Finalists</dt>
                <dd>15</dd>
              </span>
            </div>
            <div>
              <span className="fact-ic">
                <Icon name="trophy" size={20} />
              </span>
              <span>
                <dt>Awards</dt>
                <dd>6</dd>
              </span>
            </div>
            <div>
              <span className="fact-ic">
                <Icon name="calendar" size={20} />
              </span>
              <span>
                <dt>Deadline</dt>
                <dd className="sm">{DEADLINE_TEXT}</dd>
              </span>
            </div>
          </motion.dl>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: reduce ? 0 : 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 1, ease }}
        >
          <motion.div className="hv-3d" style={reduce ? undefined : { rotateY: rotY, rotateX: rotX }}>
            <span className="hv-frame f1" aria-hidden />
            <span className="hv-frame f2" aria-hidden />
            <div className="hv-card">
              <Image
                src="/images/iihmr-campus-facade.jpg"
                alt="The IIHMR Bangalore campus building"
                fill
                priority
                quality={90}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "45% 55%" }}
              />
              <span className="hero-caption">
                <Icon name="pin" size={15} /> IIHMR Bangalore – Electronic City
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
