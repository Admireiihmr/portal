"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import Icon from "./Icon";
import Parallax from "./Parallax";
import Tilt from "./Tilt";

const ease = [0.2, 0.8, 0.2, 1] as const;

const TONES = {
  gold: ["#fff1b8", "#f7c948", "#d99a12", "#9c6406"],
  silver: ["#ffffff", "#dfe3ec", "#aab1c0", "#737b8c"],
  bronze: ["#ffd9bf", "#e6a072", "#bd6f3d", "#7f3f1c"],
} as const;

/** Glossy cup with a star, in gold / silver / bronze. */
export function Trophy({ tone }: { tone: keyof typeof TONES }) {
  const id = useId().replace(/:/g, "");
  const [hi, mid, low, dark] = TONES[tone];
  return (
    <svg viewBox="0 0 120 120" className="trophy" aria-hidden="true">
      <defs>
        <linearGradient id={`m${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={low} />
          <stop offset=".35" stopColor={hi} />
          <stop offset=".6" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`v${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hi} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
      </defs>
      {/* handles */}
      <path d="M30 26H14v10c0 14 10 24 24 26" fill="none" stroke={`url(#m${id})`} strokeWidth="7" strokeLinecap="round" />
      <path d="M90 26h16v10c0 14-10 24-24 26" fill="none" stroke={`url(#m${id})`} strokeWidth="7" strokeLinecap="round" />
      {/* cup */}
      <path d="M28 16h64v22c0 20-14 36-32 36S28 58 28 38V16z" fill={`url(#m${id})`} />
      <path d="M28 16h64v6H28z" fill={hi} opacity=".8" />
      <path d="M38 24c0 18 4 32 12 40" stroke="#fff" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* star */}
      <path d="M60 30l4.4 9 9.9 1.4-7.2 7 1.7 9.8L60 52.6l-8.8 4.6 1.7-9.8-7.2-7 9.9-1.4z" fill={dark} opacity=".55" />
      {/* stem + base */}
      <path d="M54 74h12l3 14H51z" fill={`url(#v${id})`} />
      <rect x="40" y="88" width="40" height="8" rx="3" fill={`url(#m${id})`} />
      <rect x="34" y="96" width="52" height="12" rx="4" fill="#3a2a8a" />
      <rect x="34" y="96" width="52" height="3" rx="1.5" fill="#6d55d6" />
    </svg>
  );
}

/** Number inside a laurel wreath: leaves laid along an arc on each side. */
export function Laurel({ n, color }: { n: number; color: string }) {
  const cx = 60;
  const cy = 50;
  const r = 34;
  const leaves = Array.from({ length: 7 }, (_, i) => 108 + i * 19); // degrees, bottom → top on the left
  const branch = (side: 1 | -1) => (
    <g key={side} transform={side === -1 ? `translate(${2 * cx} 0) scale(-1 1)` : undefined}>
      <path d={`M ${cx - 6} ${cy + r + 4} A ${r} ${r} 0 0 1 ${cx - r * 0.62} ${cy - r * 0.78}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {leaves.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const out = i % 2 ? -5 : 5;
        const x = cx + (r + out) * Math.cos(rad);
        const y = cy + (r + out) * Math.sin(rad);
        const rot = deg + 90 + (i % 2 ? 28 : -28);
        return <ellipse key={deg} cx={x} cy={y} rx="7.5" ry="3.2" transform={`rotate(${rot} ${x} ${y})`} fill={color} />;
      })}
    </g>
  );
  return (
    <svg viewBox="0 0 120 100" className="laurel" aria-hidden="true">
      {branch(1)}
      {branch(-1)}
      <text x={cx} y={cy + 15} textAnchor="middle" className="laurel-n" fill={color}>
        {n}
      </text>
    </svg>
  );
}

const CARDS = [
  { icon: "trophy", title: "3 Consolation Awards", text: "Three more ideas are recognised on the day." },
  { icon: "users", title: "Four Minutes on Stage", text: "Every finalist pitches to the expert panel." },
  { icon: "cert", title: "Certificate", text: "For every presenter, printed and digital." },
];

const PODS = [
  { n: 2, tone: "silver" as const, cls: "p2", d: 0.15 },
  { n: 1, tone: "gold" as const, cls: "p1", d: 0 },
  { n: 3, tone: "bronze" as const, cls: "p3", d: 0.3 },
];

export default function Awards() {
  const reduce = useReducedMotion();
  const inView = { once: true, margin: "-80px" } as const;
  return (
    <section id="awards" className="aw">
      <span className="aw-ribbon r1" aria-hidden />
      <span className="aw-ribbon r2" aria-hidden />
      <span className="aw-ribbon r3" aria-hidden />

      <div className="wrap aw-grid">
        <div className="aw-copy">
          <motion.p className="aw-label" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.6, ease }}>
            <i /> <Icon name="trophy" size={16} /> Awards <i />
          </motion.p>
          {/* the trigger sits on the heading: the words start clipped, and clipped elements never count as in view */}
          <motion.h2 className="aw-title" initial="hidden" whileInView="show" viewport={inView}>
            <span className="hl">
              <motion.span variants={{ hidden: { y: reduce ? "0%" : "110%" }, show: { y: "0%", transition: { duration: 0.9, ease } } }}>Six Awards</motion.span>
            </span>
            <span className="hl">
              <motion.span variants={{ hidden: { y: reduce ? "0%" : "110%" }, show: { y: "0%", transition: { delay: 0.1, duration: 0.9, ease } } }}>
                on <em>the Day</em>
              </motion.span>
            </span>
            <svg className="aw-swoosh" viewBox="0 0 300 24" aria-hidden="true">
              <motion.path d="M4 16 C 90 4, 190 4, 296 10" fill="none" stroke="#6b4de6" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={inView} transition={{ delay: 0.6, duration: 0.8, ease }} />
            </svg>
            <svg className="aw-spark" viewBox="0 0 40 40" aria-hidden="true">
              <path d="M10 26L18 6M22 30l14-6" stroke="#6b4de6" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.h2>
          <motion.p className="aw-intro" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ delay: 0.2, duration: 0.7, ease }}>
            The top three ideas win, three more receive consolation awards, and every presenter gets a certificate. Award details will be announced by the organisers.
          </motion.p>
          <ul className="aw-cards">
            {CARDS.map((c, i) => (
              <Tilt as="li" max={5} lift={1.02} key={c.title} initial={{ opacity: 0, x: reduce ? 0 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={inView} transition={{ delay: 0.25 + i * 0.1, duration: 0.7, ease }}>
                <span className="aw-ic">
                  <Icon name={c.icon} size={24} />
                </span>
                <span className="aw-ct">
                  <b>{c.title}</b>
                  <span>{c.text}</span>
                </span>
                <Icon name="chevron" size={18} className="aw-chev" />
              </Tilt>
            ))}
          </ul>
        </div>

        <Parallax y={30} className="aw-stage-wrap">
        <div className="aw-stage" aria-label="Podium: first, second and third place">
          <span className="aw-dome" aria-hidden />
          <svg className="aw-orbit back" viewBox="0 0 600 300" aria-hidden="true">
            <ellipse cx="300" cy="150" rx="290" ry="70" fill="none" stroke="url(#awOrb)" strokeWidth="3" />
            <defs>
              <linearGradient id="awOrb" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#c9b6ff" stopOpacity="0" />
                <stop offset=".3" stopColor="#ffffff" />
                <stop offset=".7" stopColor="#b79cff" />
                <stop offset="1" stopColor="#c9b6ff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div className="aw-platform" aria-hidden>
            <span className="pl-top" />
            <span className="pl-side" />
          </div>

          <div className="aw-pods">
            {PODS.map((p) => (
              <div className={`aw-pod ${p.cls}`} key={p.n}>
                <motion.div className="aw-trophy" initial={{ opacity: 0, y: reduce ? 0 : -40 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.5 + p.d }}
                  whileHover={reduce ? undefined : { y: -12, rotate: [0, -8, 8, -4, 0], transition: { duration: 0.6 } }}>
                  <Trophy tone={p.tone} />
                </motion.div>
                <motion.div className="aw-block" initial={{ scaleY: reduce ? 1 : 0.2, opacity: 0 }} whileInView={{ scaleY: 1, opacity: 1 }} viewport={inView} transition={{ duration: 0.9, delay: p.d, ease }}>
                  <Laurel n={p.n} color={p.n === 1 ? "#f6d77a" : p.n === 3 ? "#fbe3cf" : "#ffffff"} />
                </motion.div>
              </div>
            ))}
          </div>

          <svg className="aw-orbit front" viewBox="0 0 600 300" aria-hidden="true">
            <path d="M10 150 A 290 70 0 0 0 590 150" fill="none" stroke="url(#awOrb)" strokeWidth="3" strokeDasharray="420 900" className="aw-orbit-run" />
          </svg>
        </div>
        </Parallax>
      </div>
    </section>
  );
}
