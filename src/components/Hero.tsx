"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useId, type ReactNode } from "react";
import { DEADLINE_TEXT } from "@/lib/config";
import Icon from "./Icon";
import Magnetic from "./Magnetic";
import Parallax from "./Parallax";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Glowing glass bulb with a sprout, on a lit pedestal with an orbit ring. */
export function Bulb() {
  const u = useId().replace(/:/g, "");
  return (
    <svg className="bulb" viewBox="0 0 220 300" aria-hidden="true">
      <defs>
        <radialGradient id={`bGlass${u}`} cx="45%" cy="38%" r="60%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".35" />
          <stop offset=".55" stopColor="#8f78ff" stopOpacity=".18" />
          <stop offset="1" stopColor="#5b3fd9" stopOpacity=".08" />
        </radialGradient>
        <linearGradient id={`bLeaf${u}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#7cf7e1" />
          <stop offset="1" stopColor="#e9fffb" />
        </linearGradient>
        <linearGradient id={`bRing${u}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7b5cff" />
          <stop offset=".5" stopColor="#d7a6ff" />
          <stop offset="1" stopColor="#7b5cff" />
        </linearGradient>
        <filter id={`bGlow${u}`} x="-50%" y="-50%" width="200%" height="200%">
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
      <ellipse cx="110" cy="256" rx="62" ry="12" fill="none" stroke={`url(#bRing${u})`} strokeWidth="3" filter={`url(#bGlow${u})`} />

      <g className="bulb-float">
        {/* orbit ring behind */}
        <ellipse className="bulb-orbit" cx="110" cy="118" rx="104" ry="34" fill="none" stroke={`url(#bRing${u})`} strokeWidth="2.5" strokeDasharray="160 90" transform="rotate(-14 110 118)" filter={`url(#bGlow${u})`} opacity=".9" />
        {/* glass */}
        <path d="M110 30c-36 0-62 27-62 61 0 22 11 37 23 50 8 9 12 18 12 28v9h54v-9c0-10 4-19 12-28 12-13 23-28 23-50 0-34-26-61-62-61z" fill={`url(#bGlass${u})`} stroke="#b9a6ff" strokeWidth="2.5" filter={`url(#bGlow${u})`} />
        <path d="M78 64c8-12 20-18 32-19" stroke="#fff" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* sprout */}
        <path d="M110 172v-60" stroke="#9ff5e6" strokeWidth="3" strokeLinecap="round" filter={`url(#bGlow${u})`} />
        <path d="M110 128c-4-20-22-30-40-26 4 18 20 30 40 26z" fill={`url(#bLeaf${u})`} filter={`url(#bGlow${u})`} />
        <path d="M110 118c4-22 24-32 42-28-4 20-22 32-42 28z" fill={`url(#bLeaf${u})`} filter={`url(#bGlow${u})`} />
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

/** Hexagon tiles with medical icons: heart-pulse, plus, capsule, DNA with people. */
function HexCluster() {
  const hex = "M50 4l40 23v46L50 96 10 73V27z";
  const tiles: { x: number; y: number; icon: ReactNode; d: number }[] = [
    {
      x: 10, y: 0, d: 0,
      icon: <path d="M50 70C34 59 26 50 26 40c0-8 6-13 12-13 5 0 9 3 12 7 3-4 7-7 12-7 6 0 12 5 12 13 0 10-8 19-24 30zM30 47h10l4-7 6 14 4-7h16" />,
    },
    { x: 94, y: 52, d: 0.4, icon: <path d="M44 32h12v12h12v12H56v12H44V56H32V44h12z" fill="#fff" stroke="none" /> },
    {
      x: 10, y: 104, d: 0.8,
      icon: (
        <g transform="rotate(-40 50 50)">
          <rect x="36" y="26" width="28" height="48" rx="14" />
          <path d="M36 50h28" />
        </g>
      ),
    },
    {
      x: 10, y: 208, d: 1.2,
      icon: (
        <g>
          <path d="M40 26c0 10 20 14 20 24S40 64 40 74M60 26c0 10-20 14-20 24s20 14 20 24M42 34h16M42 66h16" />
          <circle cx="28" cy="52" r="5" />
          <path d="M20 72c0-6 4-10 8-10s8 4 8 10" />
          <circle cx="72" cy="52" r="5" />
          <path d="M64 72c0-6 4-10 8-10s8 4 8 10" />
        </g>
      ),
    },
  ];
  return (
    <svg className="hx" viewBox="0 0 200 310" aria-hidden="true">
      <defs>
        <linearGradient id="hxFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f6cff" stopOpacity=".35" />
          <stop offset="1" stopColor="#3a2690" stopOpacity=".55" />
        </linearGradient>
        <filter id="hxGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {tiles.map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y})`}>
          <g className="hx-tile" style={{ animationDelay: `${-t.d}s` }}>
            <path d={hex} fill="url(#hxFill)" stroke="#c9b4ff" strokeWidth="2.5" filter="url(#hxGlow)" />
            <path d="M50 12l33 19v38" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="2" />
            <g fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              {t.icon}
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

/** Soft, out-of-focus doctor in a white coat with a stethoscope, at the left edge. */
export function Doctor() {
  return (
    <svg className="hero-doc" viewBox="0 0 260 620" aria-hidden="true">
      <defs>
        <linearGradient id="docCoat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3efff" />
          <stop offset=".6" stopColor="#cfc2ff" />
          <stop offset="1" stopColor="#8f78e8" />
        </linearGradient>
        <linearGradient id="docShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e56d6" stopOpacity=".55" />
          <stop offset="1" stopColor="#6e56d6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* coat */}
      <path d="M-40 70c40-20 90-30 140-30 30 0 60 14 76 40l40 120 30 420H-40z" fill="url(#docCoat)" />
      <path d="M-40 70c40-20 90-30 140-30l-30 160-40 420H-40z" fill="url(#docShade)" />
      {/* scrubs under the coat */}
      <path d="M100 40c30 0 60 14 76 40l-44 90z" fill="#6a52cf" opacity=".85" />
      {/* lapel */}
      <path d="M100 40l32 130 44-90" fill="none" stroke="#b6a6f2" strokeWidth="4" />
      <path d="M150 210l60 410" stroke="#b6a6f2" strokeWidth="3" />
      {/* stethoscope */}
      <path d="M70 40c-10 70 10 150 50 200 30 36 60 40 70 20" fill="none" stroke="#2a2357" strokeWidth="9" strokeLinecap="round" />
      <path d="M150 50c10 60 10 120 0 170" fill="none" stroke="#2a2357" strokeWidth="9" strokeLinecap="round" />
      <circle cx="196" cy="246" r="26" fill="#cfd3e6" stroke="#2a2357" strokeWidth="8" />
      <circle cx="196" cy="246" r="12" fill="#8f97b8" />
    </svg>
  );
}

/** Glowing ECG trace with medical crosses (top right). */
function PulseCorner() {
  return (
    <svg className="hero-pulse" viewBox="0 0 420 200" aria-hidden="true">
      <g fill="none" stroke="#c9b4ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="glow-stroke">
        <path className="ecg-run" d="M0 90h150l12-22 14 40 16-96 18 130 14-52h196" />
        <path d="M330 60h22V38h24v22h22v24h-22v22h-24V84h-22z" />
        <path d="M262 136h12v-12h14v12h12v14h-12v12h-14v-12h-12z" opacity=".75" />
      </g>
    </svg>
  );
}

/** Stethoscope on the desk and a glass cube with a glowing plus (bottom right). */
function DeskCorner() {
  return (
    <svg className="hero-desk" viewBox="0 0 420 260" aria-hidden="true">
      <defs>
        <linearGradient id="cubeG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".55" />
          <stop offset="1" stopColor="#a78bff" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <path d="M40 190c40-50 140-40 170 0 20 26-10 40-50 40" fill="none" stroke="#d9d0ff" strokeOpacity=".75" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="160" cy="232" rx="34" ry="11" fill="#e8e4ff" stroke="#9a86e8" strokeWidth="5" />
      <g className="cube-float">
        <path d="M260 70l70-28 70 28v86l-70 30-70-30z" fill="url(#cubeG)" stroke="#e6dcff" strokeWidth="2.5" />
        <path d="M260 70l70 30 70-30M330 100v86" fill="none" stroke="#e6dcff" strokeWidth="2" opacity=".7" />
        <path d="M312 118h12v-14h12v14h12v12h-12v14h-12v-14h-12z" fill="#fff" className="glow-fill" />
      </g>
    </svg>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();

  // card tilts towards the pointer (desktop pointers only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-1, 1], [-10, -2]), { stiffness: 90, damping: 18 });
  const rotX = useSpring(useTransform(my, [-1, 1], [4, 0]), { stiffness: 90, damping: 18 });

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
      <Doctor />
      <PulseCorner />
      <DeskCorner />

      <div className="hero-in">
        <motion.div className="hero-hex" initial={{ opacity: 0, x: reduce ? 0 : -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease }}>
          <Parallax y={-30}>
            <HexCluster />
          </Parallax>
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
            <svg className="ecg" viewBox="0 0 420 40" aria-hidden="true">
              <motion.path
                d="M2 26h250l10-14 10 22 12-32 14 40 10-16h110"
                fill="none"
                stroke="url(#ecgGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.75, duration: 1.2, ease }}
              />
              <defs>
                <linearGradient id="ecgGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#8b6cff" stopOpacity="0" />
                  <stop offset=".35" stopColor="#c9b4ff" />
                  <stop offset="1" stopColor="#ffffff" />
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
              <motion.span className="fact-ic" whileHover={reduce ? undefined : { rotate: [0, -12, 12, 0], scale: 1.12 }} transition={{ duration: 0.5 }}>
                <Icon name="users" size={20} />
              </motion.span>
              <span>
                <dt>Finalists</dt>
                <dd>15</dd>
              </span>
            </div>
            <div>
              <motion.span className="fact-ic" whileHover={reduce ? undefined : { rotate: [0, -12, 12, 0], scale: 1.12 }} transition={{ duration: 0.5 }}>
                <Icon name="trophy" size={20} />
              </motion.span>
              <span>
                <dt>Awards</dt>
                <dd>6</dd>
              </span>
            </div>
            <div>
              <motion.span className="fact-ic" whileHover={reduce ? undefined : { rotate: [0, -12, 12, 0], scale: 1.12 }} transition={{ duration: 0.5 }}>
                <Icon name="calendar" size={20} />
              </motion.span>
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
