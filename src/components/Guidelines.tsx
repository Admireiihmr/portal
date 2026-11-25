"use client";
import { motion, useReducedMotion } from "framer-motion";
import { GUIDELINES } from "@/lib/content";
import { Bulb } from "./Hero";
import Tilt from "./Tilt";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Neon line icons for the guideline cards (stroke follows the card colour). */
function NeonIcon({ name }: { name: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "students":
      return (
        <svg viewBox="0 0 64 48" {...p}>
          <path d="M32 6l14 6-14 6-14-6z" />
          <path d="M24 15v5c0 3 16 3 16 0v-5" />
          <circle cx="32" cy="27" r="5" />
          <path d="M22 44c0-6 4-10 10-10s10 4 10 10" />
          <path d="M12 16l8 3.5-8 3.5-8-3.5z" />
          <circle cx="12" cy="29" r="4" />
          <path d="M4 44c0-5 3-8 8-8 2 0 4 .6 5 1.6" />
          <path d="M52 16l8 3.5-8 3.5-8-3.5z" />
          <circle cx="52" cy="29" r="4" />
          <path d="M60 44c0-5-3-8-8-8-2 0-4 .6-5 1.6" />
        </svg>
      );
    case "person":
      return (
        <svg viewBox="0 0 48 48" {...p}>
          <circle cx="24" cy="16" r="9" />
          <path d="M8 44c0-9 7-15 16-15s16 6 16 15z" />
        </svg>
      );
    case "rocket":
      return (
        <svg viewBox="0 0 48 48" {...p}>
          <path d="M28 8c6-3 11-3 12-2 1 1 1 6-2 12L26 30l-8-8z" />
          <circle cx="31" cy="17" r="3" />
          <path d="M18 22l-7 1-4 5 9 1M26 30l-1 7-5 4-1-9" />
          <path d="M12 36l-5 5M16 39l-3 3M9 32l-3 3" />
        </svg>
      );
    case "write":
      return (
        <svg viewBox="0 0 48 48" {...p}>
          <path d="M30 6H10v36h26V20" />
          <path d="M16 16h12M16 23h10M16 30h8" />
          <path d="M40 8l4 4-14 14-6 2 2-6z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 72 48" {...p}>
          <path d="M4 14h16l4 4v24H4z" />
          <text x="7" y="34" fontSize="8" fontWeight="700" fill="currentColor" stroke="none" fontFamily="sans-serif">PPT</text>
          <path d="M26 6h18l4 4v20H26z" />
          <path d="M30 26l5-6 4 4 3-3 3 5" />
          <circle cx="32" cy="14" r="2" />
          <rect x="44" y="26" width="24" height="18" rx="3" />
          <path d="M53 31l7 4-7 4z" />
        </svg>
      );
  }
}

export default function Guidelines() {
  const reduce = useReducedMotion();
  const inView = { once: true, margin: "-80px" } as const;
  return (
    <section id="guidelines" className="gd" aria-labelledby="gd-title">
      <span className="gd-glow g1" aria-hidden />
      <span className="gd-glow g2" aria-hidden />
      <div className="wrap gd-inner">
        <p className="gd-label">01 — Before you submit</p>

        <div className="gd-head">
          <motion.div className="gd-bulb" initial={{ opacity: 0, y: reduce ? 0 : -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.8, ease }} aria-hidden>
            <Bulb />
            <svg className="gd-bulb-orbit" viewBox="0 0 200 60">
              <ellipse cx="100" cy="30" rx="92" ry="18" fill="none" stroke="url(#gdOrbit)" strokeWidth="2.5" />
              <defs>
                <linearGradient id="gdOrbit" x1="0" x2="1">
                  <stop offset="0" stopColor="#ffd27a" stopOpacity="0" />
                  <stop offset=".3" stopColor="#ffd27a" />
                  <stop offset=".7" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#b79cff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.h2 id="gd-title" className="gd-title" initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={inView} transition={{ duration: 0.8, delay: 0.15, ease }}>
            Guidelines
            <svg className="gd-ring" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="gdRing" x1="0" x2="1">
                  <stop offset="0" stopColor="#ffb547" />
                  <stop offset=".5" stopColor="#ffd27a" stopOpacity=".2" />
                  <stop offset="1" stopColor="#c45bff" />
                </linearGradient>
              </defs>
              <motion.ellipse cx="300" cy="64" rx="290" ry="44" fill="none" stroke="url(#gdRing)" strokeWidth="2.5" initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={inView} transition={{ duration: 1.4, delay: 0.4, ease }} />
            </svg>
            <span className="gd-star" aria-hidden>✦</span>
          </motion.h2>
        </div>

        <div className="gd-stage">
          <ul className="gd-cards">
            {GUIDELINES.map((g, i) => (
              <Tilt
                as="li"
                key={g.title}
                className={`gd-card ${g.glow}`}
                max={8}
                lift={1.05}
                initial={{ opacity: 0, y: reduce ? 0 : 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease }}
              >
                <span className="gd-ic" aria-hidden>
                  <NeonIcon name={g.icon} />
                </span>
                <b>{g.title}</b>
                <small>{g.note}</small>
                <span className="gd-lines" aria-hidden>
                  <i />
                  <i />
                </span>
              </Tilt>
            ))}
          </ul>
          <div className="gd-platform" aria-hidden>
            <span className="p1" />
            <span className="p2" />
            <span className="p3" />
          </div>
        </div>
      </div>
    </section>
  );
}
