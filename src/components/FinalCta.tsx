"use client";
import { motion, useReducedMotion } from "framer-motion";
import { DEADLINE_TEXT } from "@/lib/config";
import { Bulb } from "./Hero";
import Icon from "./Icon";
import Magnetic from "./Magnetic";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Books, a laptop with a rising chart, a sticky note and a paper plane around the glowing bulb. */
function CtaArt() {
  return (
    <div className="fc-art" aria-hidden>
      <span className="fc-pedestal" />
      <svg className="fc-books" viewBox="0 0 140 70">
        <rect x="4" y="44" width="132" height="22" rx="4" fill="#5b3bd6" />
        <rect x="4" y="44" width="132" height="5" rx="2" fill="#efe6cf" />
        <rect x="14" y="20" width="114" height="24" rx="4" fill="#7a5df0" />
        <rect x="14" y="20" width="114" height="5" rx="2" fill="#efe6cf" />
        <rect x="104" y="20" width="8" height="30" fill="#ff8fb8" />
      </svg>
      <div className="fc-bulb">
        <Bulb heart />
      </div>
      <svg className="fc-laptop" viewBox="0 0 150 100">
        <rect x="20" y="6" width="112" height="72" rx="6" fill="#6a4ce0" />
        <rect x="27" y="13" width="98" height="58" rx="3" fill="#2b1d70" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={40 + k * 18} y={56 - k * 10} width="11" height={10 + k * 10} rx="2" fill={k === 3 ? "#b9a6ff" : "#8f73f2"} />
        ))}
        <path d="M40 46l18-10 18 6 26-20" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M96 22h8v8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M6 82h140l-9 10H15z" fill="#8f73f2" />
      </svg>
      <svg className="fc-note" viewBox="0 0 60 60">
        <rect x="6" y="8" width="46" height="44" rx="5" fill="#e8d9ff" transform="rotate(-10 29 30)" />
        <rect x="14" y="20" width="26" height="4" rx="2" fill="#a693f0" transform="rotate(-10 29 30)" />
        <rect x="14" y="30" width="20" height="4" rx="2" fill="#a693f0" transform="rotate(-10 29 30)" />
      </svg>
      <svg className="fc-plane" viewBox="0 0 120 70">
        <path d="M4 60c20-6 34-14 48-30" stroke="#c9b8ff" strokeWidth="2" strokeDasharray="4 6" fill="none" />
        <path d="M60 22L116 4 92 56 78 38z" fill="#f4efff" />
        <path d="M78 38l38-34-46 26z" fill="#c9b8ff" />
      </svg>
      <svg className="fc-spark" viewBox="0 0 40 40">
        <path d="M10 26L18 8M24 30l12-8" stroke="#c9b8ff" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function FinalCta() {
  const reduce = useReducedMotion();
  return (
    <section className="fc">
      <span className="fc-ribbon r1" aria-hidden />
      <span className="fc-ribbon r2" aria-hidden />
      <div className="wrap">
        <motion.div className="fc-card" initial={{ opacity: 0, y: reduce ? 0 : 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease }}>
          <div className="fc-copy">
            <p className="fc-pill">
              <Icon name="sparkle" size={15} /> Ready when you are
            </p>
            <h2 className="fc-title">
              Have an idea <em>worth sharing?</em>
              <svg className="fc-swoosh" viewBox="0 0 240 20" aria-hidden="true">
                <motion.path d="M4 14 C 70 4, 160 4, 236 9" fill="none" stroke="#c49cff" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }} />
              </svg>
            </h2>
            <p className="fc-text">
              Submit your prototype in a couple of minutes. <b>Deadline:</b> {DEADLINE_TEXT}.
            </p>
            <div className="fc-actions">
              <Magnetic>
                <a href="#submit" className="btn btn-primary btn-lg">
                  <Icon name="send" size={18} /> Submit Your Prototype <Icon name="arrow" size={18} />
                </a>
              </Magnetic>
              <span className="fc-div" aria-hidden />
              <a href="mailto:admire@iihmrbangalore.edu.in" className="fc-mail">
                <Icon name="mail" size={20} /> admire@iihmrbangalore.edu.in
              </a>
            </div>
          </div>
          <CtaArt />
        </motion.div>
      </div>
    </section>
  );
}
