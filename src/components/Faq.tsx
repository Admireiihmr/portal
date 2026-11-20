"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { FAQ } from "@/lib/content";
import Icon from "./Icon";
import Parallax from "./Parallax";

const ease = [0.2, 0.8, 0.2, 1] as const;
// icon for each question, in the same order as FAQ in content.ts
const FAQ_ICONS = ["user", "users", "file", "cloudUpload", "layers", "trophy", "refresh"];

/** Glass sphere with a big question mark on a lit pedestal, chat and idea bubbles, and a checklist card. */
function QuestionArt() {
  return (
    <svg viewBox="0 0 360 340" aria-hidden="true" className="fq-svg">
      <defs>
        <linearGradient id="qV" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a68cff" />
          <stop offset=".55" stopColor="#6f4fe4" />
          <stop offset="1" stopColor="#4a2fb5" />
        </linearGradient>
        <radialGradient id="qGlass" cx="40%" cy="35%" r="65%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".85" />
          <stop offset=".7" stopColor="#e5dcff" stopOpacity=".35" />
          <stop offset="1" stopColor="#c9b8ff" stopOpacity=".2" />
        </radialGradient>
        <radialGradient id="qGold" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset=".55" stopColor="#f9c63a" />
          <stop offset="1" stopColor="#d99410" />
        </radialGradient>
        <filter id="qGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* pedestal */}
      <ellipse cx="180" cy="312" rx="120" ry="22" fill="#4a2fb5" />
      <ellipse cx="180" cy="300" rx="120" ry="22" fill="#7a5df0" />
      <ellipse cx="180" cy="294" rx="104" ry="16" fill="#e9e2ff" />
      <ellipse cx="180" cy="294" rx="84" ry="11" fill="none" stroke="#ff9ad5" strokeWidth="3" filter="url(#qGlow)" opacity=".9" />
      {/* glass sphere */}
      <circle cx="180" cy="160" r="120" fill="url(#qGlass)" stroke="#ffffff" strokeOpacity=".8" strokeWidth="2" />
      <path d="M100 90c18-26 46-40 76-42" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".7" fill="none" />
      {/* question mark */}
      <g className="fq-q" filter="url(#qGlow)">
        <path d="M140 118c0-30 22-50 52-50 29 0 50 18 50 44 0 22-14 32-28 42-10 7-14 12-14 24v10h-34v-12c0-20 9-30 22-39 10-7 16-12 16-22 0-9-7-16-18-16-12 0-19 8-19 19z" fill="url(#qV)" />
        <circle cx="185" cy="248" r="20" fill="url(#qV)" />
      </g>
      {/* chat bubble */}
      <g className="fq-b1">
        <rect x="8" y="138" width="80" height="56" rx="18" fill="#ffffff" />
        <path d="M30 192l-6 18 22-14z" fill="#ffffff" />
        <circle cx="30" cy="166" r="6" fill="#7a5df0" />
        <circle cx="48" cy="166" r="6" fill="#7a5df0" />
        <circle cx="66" cy="166" r="6" fill="#7a5df0" />
      </g>
      {/* idea bubble */}
      <g className="fq-b2">
        <circle cx="300" cy="80" r="36" fill="#ffffff" />
        <circle cx="300" cy="74" r="16" fill="url(#qGold)" filter="url(#qGlow)" />
        <rect x="293" y="90" width="14" height="10" rx="3" fill="#c9bbff" />
      </g>
      {/* checklist card */}
      <g className="fq-b3" transform="rotate(8 280 230)">
        <rect x="236" y="190" width="88" height="84" rx="12" fill="#ffffff" />
        {[210, 232, 254].map((y) => (
          <g key={y}>
            <rect x="248" y={y - 7} width="14" height="14" rx="3" fill="#7a5df0" />
            <path d={`M251 ${y}l3 3 5-6`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
            <rect x="268" y={y - 3} width="44" height="6" rx="3" fill="#c9bbff" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Faq() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const inView = { once: true, margin: "-80px" } as const;
  return (
    <section id="faq" className="fq">
      <span className="fq-ribbon r1" aria-hidden />
      <span className="fq-ribbon r2" aria-hidden />
      <svg className="fq-spark" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 6l4 14M20 4l2 14M30 12l-8 10" stroke="#6b4de6" strokeWidth="4" strokeLinecap="round" />
      </svg>

      <div className="wrap fq-grid">
        <div className="fq-left">
          <motion.p className="fq-label" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.6, ease }}>
            07 — FAQ <i />
          </motion.p>
          {/* the trigger sits on the heading: the words start clipped, and clipped elements never count as in view */}
          <motion.h2 className="fq-title" initial="hidden" whileInView="show" viewport={inView}>
            <span className="hl">
              <motion.span variants={{ hidden: { y: reduce ? "0%" : "110%" }, show: { y: "0%", transition: { duration: 0.9, ease } } }}>Frequently Asked</motion.span>
            </span>
            <span className="hl">
              <motion.span className="grad" variants={{ hidden: { y: reduce ? "0%" : "110%" }, show: { y: "0%", transition: { delay: 0.1, duration: 0.9, ease } } }}>
                Questions
              </motion.span>
            </span>
            <svg className="fq-swoosh" viewBox="0 0 240 20" aria-hidden="true">
              <motion.path d="M4 14 C 70 4, 160 4, 236 9" fill="none" stroke="#6b4de6" strokeWidth="5" strokeLinecap="round" variants={{ hidden: { pathLength: reduce ? 1 : 0 }, show: { pathLength: 1, transition: { delay: 0.6, duration: 0.8 } } }} />
            </svg>
          </motion.h2>
          <motion.p className="fq-sub" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ delay: 0.2, duration: 0.6, ease }}>
            Quick answers to the most common queries about the Foundation Day Idea Presentation.
          </motion.p>
          <Parallax y={24} className="fq-art">
            <QuestionArt />
          </Parallax>
        </div>

        <div className="fq-list">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                className={`fq-item ${isOpen ? "open" : ""}`}
                initial={{ opacity: 0, x: reduce ? 0 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={inView}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                layout
              >
                <button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="fq-ic">
                    <Icon name={FAQ_ICONS[i] ?? "info"} size={20} />
                  </span>
                  <span className="fq-q-text">{f.q}</span>
                  <motion.span className="fq-tog" key={isOpen ? "up" : "plus"} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }} aria-hidden>
                    <Icon name={isOpen ? "chevronUp" : "plus"} size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="fq-a">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
