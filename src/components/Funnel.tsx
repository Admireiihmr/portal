"use client";
import { motion, useReducedMotion } from "framer-motion";
import { FUNNEL } from "@/lib/content";
import { Trophy } from "./Awards";
import Icon from "./Icon";
import Tilt from "./Tilt";

const ease = [0.2, 0.8, 0.2, 1] as const;

// funnel width (in %) at the top of each layer; the last value is the bottom of the yellow layer
const W = [100, 82, 64, 47, 33];
const LAYER_ICONS = ["file", "search", "users", "trophy"];
const NODE_ICONS = ["upload", "search", "users", "trophy"];

/* ── small illustrations for the stage cards ── */
const Laptop = () => (
  <svg viewBox="0 0 110 90" aria-hidden="true">
    <defs>
      <linearGradient id="ilScreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9d84ff" />
        <stop offset="1" stopColor="#6a4ce0" />
      </linearGradient>
    </defs>
    <rect x="18" y="8" width="74" height="52" rx="6" fill="url(#ilScreen)" />
    <rect x="24" y="14" width="62" height="40" rx="3" fill="#ece6ff" />
    <rect x="31" y="40" width="34" height="4" rx="2" fill="#c9bcff" />
    <rect x="31" y="47" width="22" height="4" rx="2" fill="#c9bcff" />
    <circle cx="55" cy="27" r="9" fill="#6a4ce0" />
    <path d="M55 32v-9M51 26l4-4 4 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M8 66h94l-8 10H16z" fill="#7a5df0" />
    <path d="M8 66h94" stroke="#b9a6ff" strokeWidth="2" />
  </svg>
);
const Docs = () => (
  <svg viewBox="0 0 110 90" aria-hidden="true">
    <rect x="30" y="6" width="54" height="66" rx="6" fill="#d9cfff" transform="rotate(8 57 39)" />
    <rect x="22" y="10" width="54" height="68" rx="6" fill="#f3efff" stroke="#cbbcff" strokeWidth="1.5" />
    <rect x="31" y="22" width="30" height="4" rx="2" fill="#a693f0" />
    <rect x="31" y="32" width="36" height="4" rx="2" fill="#cbbcff" />
    <rect x="31" y="42" width="28" height="4" rx="2" fill="#cbbcff" />
    <circle cx="78" cy="62" r="16" fill="#6a4ce0" />
    <path d="M70 62l6 6 10-11" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
const Board = () => (
  <svg viewBox="0 0 110 90" aria-hidden="true">
    <rect x="18" y="8" width="74" height="50" rx="4" fill="#f3efff" stroke="#9d84ff" strokeWidth="3" />
    <rect x="30" y="38" width="9" height="12" rx="1.5" fill="#b9a6ff" />
    <rect x="44" y="30" width="9" height="20" rx="1.5" fill="#9d84ff" />
    <rect x="58" y="22" width="9" height="28" rx="1.5" fill="#7a5df0" />
    <rect x="72" y="16" width="9" height="34" rx="1.5" fill="#6a4ce0" />
    <path d="M55 58v8M55 66l-16 18M55 66l16 18" stroke="#7a5df0" strokeWidth="3.5" strokeLinecap="round" />
    <rect x="14" y="5" width="82" height="6" rx="3" fill="#7a5df0" />
  </svg>
);
const Medal = () => (
  <svg viewBox="0 0 110 90" aria-hidden="true">
    <defs>
      <linearGradient id="ilGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffe38a" />
        <stop offset=".55" stopColor="#f5b930" />
        <stop offset="1" stopColor="#c98a0c" />
      </linearGradient>
    </defs>
    <path d="M42 50l-12 34 12-6 8 10 6-30z" fill="#7a5df0" />
    <path d="M68 50l12 34-12-6-8 10-6-30z" fill="#6a4ce0" />
    <circle cx="55" cy="36" r="27" fill="url(#ilGold)" />
    <circle cx="55" cy="36" r="20" fill="none" stroke="#fff3c4" strokeWidth="2.5" opacity=".8" />
    <path d="M55 24l3.8 7.7 8.5 1.2-6.2 6 1.5 8.4L55 43.3l-7.6 4 1.5-8.4-6.2-6 8.5-1.2z" fill="#fff6d6" />
  </svg>
);
const ILLUSTRATIONS = [Laptop, Docs, Board, Medal];
// how far each card/node sits from the left, following the curve of the line
const CURVE = [44, 30, 18, 0];

export default function Funnel() {
  const reduce = useReducedMotion();
  const inView = { once: true, margin: "-80px" } as const;
  return (
    <section className="fs">
      <span className="fs-ribbon r1" aria-hidden />
      <span className="fs-ribbon r2" aria-hidden />
      <span className="fs-ribbon r3" aria-hidden />

      <div className="wrap">
        <motion.p className="fs-label" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.6, ease }}>
          04 – Selection Process <i />
        </motion.p>
        {/* the trigger sits on the heading: the words start clipped, and clipped elements never count as in view */}
        <motion.h2 className="fs-title" initial="hidden" whileInView="show" viewport={inView}>
          <span className="hl">
            <motion.span variants={{ hidden: { y: reduce ? "0%" : "110%" }, show: { y: "0%", transition: { duration: 0.9, ease } } }}>From Submission</motion.span>
          </span>
          <span className="hl">
            <motion.span variants={{ hidden: { y: reduce ? "0%" : "110%" }, show: { y: "0%", transition: { delay: 0.1, duration: 0.9, ease } } }}>
              to the <em>Stage</em>
            </motion.span>
          </span>
          <svg className="fs-swoosh" viewBox="0 0 200 20" aria-hidden="true">
            <motion.path d="M4 13 C 60 4, 130 4, 196 9" fill="none" stroke="#6b4de6" strokeWidth="5" strokeLinecap="round" variants={{ hidden: { pathLength: reduce ? 1 : 0 }, show: { pathLength: 1, transition: { delay: 0.6, duration: 0.8, ease } } }} />
          </svg>
        </motion.h2>

        <div className="fs-grid">
          {/* ── 3D funnel ── */}
          <div className="fs-funnel">
            <svg className="fs-ring" viewBox="0 0 600 200" aria-hidden="true">
              <ellipse cx="300" cy="100" rx="290" ry="60" fill="none" stroke="url(#fsRing)" strokeWidth="2.5" />
              <defs>
                <linearGradient id="fsRing" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#ffffff" stopOpacity=".1" />
                  <stop offset=".3" stopColor="#ffffff" />
                  <stop offset=".7" stopColor="#c4b0ff" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity=".1" />
                </linearGradient>
              </defs>
            </svg>

            {FUNNEL.map((f, i) => {
              const a = (100 - W[i]) / 2;
              const b = (100 - W[i + 1]) / 2;
              return (
                <motion.div
                  key={f.short}
                  className={`fl l${i + 1}`}
                  style={{ ["--a" as string]: `${a}%`, ["--b" as string]: `${b}%` }}
                  initial={{ opacity: 0, y: reduce ? 0 : -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ duration: 0.7, delay: i * 0.13, ease }}
                  whileHover={reduce ? undefined : { scale: 1.045, transition: { type: "spring", stiffness: 300, damping: 18 } }}
                >
                  <span className="fl-rim" />
                  <span className="fl-face" />
                  <span className="fl-label">
                    <Icon name={LAYER_ICONS[i]} size={i === 3 ? 22 : 26} />
                    {f.short}
                  </span>
                </motion.div>
              );
            })}

            <motion.div className="fs-base" initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={inView} transition={{ duration: 0.8, delay: 0.6, ease }}>
              <span className="fs-beam" aria-hidden />
              <div className="fs-cup">
                <svg className="fs-laurel left" viewBox="0 0 60 100" aria-hidden="true">
                  <path d="M50 96C24 84 10 58 16 20" fill="none" stroke="#f2b632" strokeWidth="3" strokeLinecap="round" />
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const t = i / 5;
                    const x = 46 - 30 * Math.sin(t * 1.45);
                    const y = 92 - 72 * t;
                    return <ellipse key={i} cx={x - 6} cy={y} rx="11" ry="4.6" transform={`rotate(${-40 - t * 45} ${x - 6} ${y})`} fill="#f5c043" />;
                  })}
                </svg>
                <Trophy tone="gold" />
                <svg className="fs-laurel right" viewBox="0 0 60 100" aria-hidden="true">
                  <g transform="translate(60 0) scale(-1 1)">
                    <path d="M50 96C24 84 10 58 16 20" fill="none" stroke="#f2b632" strokeWidth="3" strokeLinecap="round" />
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const t = i / 5;
                      const x = 46 - 30 * Math.sin(t * 1.45);
                      const y = 92 - 72 * t;
                      return <ellipse key={i} cx={x - 6} cy={y} rx="11" ry="4.6" transform={`rotate(${-40 - t * 45} ${x - 6} ${y})`} fill="#f5c043" />;
                    })}
                  </g>
                </svg>
              </div>
              <div className="fs-pedestal" aria-hidden>
                <span className="pd-top" />
                <span className="pd-mid" />
                <span className="pd-bot" />
              </div>
            </motion.div>
          </div>

          {/* ── curved timeline ── */}
          <div className="fs-steps">
            <svg className="fs-line" viewBox="0 0 80 600" preserveAspectRatio="none" aria-hidden="true">
              <motion.path d="M70 10 C 30 180, 20 360, 6 590" fill="none" stroke="#b9a6ff" strokeWidth="2" initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={inView} transition={{ duration: 1.4, ease }} />
            </svg>
            {FUNNEL.map((f, i) => {
              const Art = ILLUSTRATIONS[i];
              return (
                <motion.div
                  key={f.title}
                  className={`fs-step ${i === 3 ? "gold" : ""}`}
                  style={{ ["--x" as string]: `${CURVE[i]}px` }}
                  initial={{ opacity: 0, x: reduce ? 0 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={inView}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.13, ease }}
                >
                  <span className="fs-node">
                    <Icon name={NODE_ICONS[i]} size={22} />
                  </span>
                  <Tilt className="fs-card" max={5} lift={1.02}>
                    <div className="fs-ct">
                      <span className="fs-badge">Stage {i + 1}</span>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </div>
                    <span className="fs-art">
                      <Art />
                    </span>
                  </Tilt>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
