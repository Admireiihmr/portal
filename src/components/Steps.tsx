"use client";
import { motion, useReducedMotion } from "framer-motion";
import { STEPS } from "@/lib/content";
import { Trophy } from "./Awards";
import Icon from "./Icon";
import Parallax from "./Parallax";
import Tilt from "./Tilt";

const ease = [0.2, 0.8, 0.2, 1] as const;

/* shared gradients for the step illustrations (rendered once) */
const Defs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <linearGradient id="sV" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9a7dff" />
        <stop offset="1" stopColor="#5b3bd6" />
      </linearGradient>
      <linearGradient id="sVl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f3efff" />
        <stop offset="1" stopColor="#d9ceff" />
      </linearGradient>
      <radialGradient id="sGold" cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#fff1a8" />
        <stop offset=".55" stopColor="#f8c533" />
        <stop offset="1" stopColor="#d38f08" />
      </radialGradient>
      <filter id="sGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

const Rays = ({ x, y }: { x: number; y: number }) => (
  <g stroke="#f8c533" strokeWidth="3.5" strokeLinecap="round">
    <path d={`M${x} ${y - 30}v-8M${x - 22} ${y - 22}l-6-6M${x + 22} ${y - 22}l6-6M${x - 30} ${y - 2}h-8M${x + 30} ${y - 2}h8`} />
  </g>
);

const ART = [
  // 01 idea: laptop with a glowing bulb
  <svg viewBox="0 0 120 90" key="1">
    <rect x="22" y="22" width="76" height="48" rx="5" fill="url(#sV)" />
    <rect x="27" y="27" width="66" height="38" rx="3" fill="#2d1f72" />
    <path d="M10 72h100l-7 8H17z" fill="#7a5df0" />
    <Rays x={60} y={44} />
    <circle cx="60" cy="42" r="12" fill="url(#sGold)" filter="url(#sGlow)" />
    <rect x="55" y="53" width="10" height="7" rx="2" fill="#c9bcff" />
  </svg>,
  // 02 abstract: document with a pencil
  <svg viewBox="0 0 120 90" key="2">
    <rect x="30" y="8" width="54" height="72" rx="6" fill="url(#sVl)" stroke="#b9a6ff" strokeWidth="2" />
    <rect x="39" y="20" width="30" height="5" rx="2.5" fill="#6a4ce0" />
    <rect x="39" y="32" width="36" height="5" rx="2.5" fill="#9d84ff" />
    <rect x="39" y="44" width="32" height="5" rx="2.5" fill="#9d84ff" />
    <rect x="39" y="56" width="22" height="5" rx="2.5" fill="#9d84ff" />
    <g transform="rotate(38 86 46)">
      <rect x="80" y="14" width="12" height="56" rx="2" fill="#f8c533" />
      <rect x="80" y="14" width="12" height="9" rx="2" fill="#f3a6c8" />
      <path d="M80 70h12l-6 12z" fill="#f5deb3" />
      <path d="M84 77h4l-2 5z" fill="#3a2a8a" />
    </g>
  </svg>,
  // 03 screening: clipboard with a magnifier
  <svg viewBox="0 0 120 90" key="3">
    <rect x="26" y="12" width="56" height="70" rx="6" fill="url(#sVl)" stroke="#b9a6ff" strokeWidth="2" />
    <rect x="42" y="6" width="24" height="12" rx="4" fill="url(#sV)" />
    {[30, 46, 62].map((y) => (
      <g key={y}>
        <path d={`M34 ${y}l4 4 7-8`} stroke="#6a4ce0" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="50" y={y - 2} width="24" height="5" rx="2.5" fill="#9d84ff" />
      </g>
    ))}
    <circle cx="84" cy="54" r="15" fill="rgba(255,255,255,.7)" stroke="#f8c533" strokeWidth="5" />
    <path d="M95 65l12 12" stroke="#6a4ce0" strokeWidth="7" strokeLinecap="round" />
  </svg>,
  // 04 expert review: group with a gold star
  <svg viewBox="0 0 120 90" key="4">
    <circle cx="36" cy="30" r="10" fill="url(#sV)" />
    <circle cx="84" cy="30" r="10" fill="url(#sV)" />
    <path d="M18 66c0-14 8-22 18-22s18 8 18 22z" fill="#7a5df0" />
    <path d="M66 66c0-14 8-22 18-22s18 8 18 22z" fill="#7a5df0" />
    <circle cx="60" cy="24" r="13" fill="url(#sV)" />
    <path d="M36 70c0-18 11-28 24-28s24 10 24 28z" fill="url(#sV)" />
    <circle cx="60" cy="62" r="15" fill="url(#sGold)" filter="url(#sGlow)" />
    <path d="M60 53l2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L60 67.3l-5.6 2.9 1.1-6.2-4.6-4.4 6.3-.9z" fill="#fff6d6" />
  </svg>,
  // 05 shortlist: highlighted group
  <svg viewBox="0 0 120 90" key="5">
    <Rays x={60} y={34} />
    <circle cx="34" cy="40" r="9" fill="#8a6cf0" />
    <circle cx="86" cy="40" r="9" fill="#8a6cf0" />
    <path d="M18 76c0-13 7-20 16-20s16 7 16 20z" fill="#7a5df0" />
    <path d="M70 76c0-13 7-20 16-20s16 7 16 20z" fill="#7a5df0" />
    <circle cx="60" cy="34" r="12" fill="url(#sV)" />
    <path d="M36 80c0-18 11-28 24-28s24 10 24 28z" fill="url(#sV)" />
  </svg>,
  // 06 pitch: presentation board with a bar chart
  <svg viewBox="0 0 120 90" key="6">
    <rect x="20" y="10" width="80" height="52" rx="4" fill="url(#sVl)" stroke="#7a5df0" strokeWidth="3" />
    <rect x="16" y="6" width="88" height="7" rx="3" fill="#6a4ce0" />
    <rect x="34" y="40" width="10" height="14" rx="2" fill="#f8c533" />
    <rect x="50" y="32" width="10" height="22" rx="2" fill="#f3a03c" />
    <rect x="66" y="24" width="10" height="30" rx="2" fill="#9d84ff" />
    <rect x="82" y="18" width="10" height="36" rx="2" fill="#6a4ce0" />
    <path d="M60 62v8M60 70l-16 16M60 70l16 16" stroke="#7a5df0" strokeWidth="4" strokeLinecap="round" />
  </svg>,
  // 07 present: microphone on a lit stage
  <svg viewBox="0 0 120 90" key="7">
    <ellipse cx="60" cy="74" rx="44" ry="10" fill="url(#sV)" />
    <ellipse cx="60" cy="70" rx="44" ry="10" fill="#c9bcff" />
    <ellipse cx="60" cy="70" rx="30" ry="6" fill="url(#sGold)" opacity=".85" filter="url(#sGlow)" />
    <path d="M60 68V44" stroke="#3a2a8a" strokeWidth="4" strokeLinecap="round" />
    <path d="M52 68h16" stroke="#3a2a8a" strokeWidth="4" strokeLinecap="round" />
    <g transform="rotate(30 64 30)">
      <rect x="57" y="12" width="14" height="26" rx="7" fill="url(#sGold)" />
      <path d="M57 26h14M57 20h14" stroke="#c78a10" strokeWidth="1.5" />
    </g>
  </svg>,
  // 08 awards: trophy with laurels
  null,
];

export default function Steps() {
  const reduce = useReducedMotion();
  const inView = { once: true, margin: "-80px" } as const;
  return (
    <section id="journey" className="st">
      <Defs />
      <span className="st-glow g1" aria-hidden />
      <span className="st-glow g2" aria-hidden />
      <svg className="st-waves" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M-100 ${120 + i * 8} C 300 ${40 + i * 10}, 700 ${200 - i * 6}, 1000 ${110 + i * 6} S 1400 ${50 + i * 9}, 1600 ${120 + i * 4}`} fill="none" stroke="#8f6cff" strokeWidth={i === 3 ? 2 : 1} opacity={0.18 + (i === 3 ? 0.5 : (i % 3) * 0.1)} />
        ))}
      </svg>

      <div className="wrap st-in">
        <div className="st-head">
          <div>
            <motion.p className="st-label" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.6, ease }}>
              How it works <i />
            </motion.p>
            {/* the trigger sits on the heading: the words start clipped, and clipped elements never count as in view */}
            <motion.h2 className="st-title" initial="hidden" whileInView="show" viewport={inView}>
              <span className="hl">
                <motion.span variants={{ hidden: { y: reduce ? "0%" : "110%" }, show: { y: "0%", transition: { duration: 0.9, ease } } }}>
                  From Spark <em>to Spotlight</em>
                </motion.span>
              </span>
            </motion.h2>
            <motion.p className="st-sub" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ delay: 0.2, duration: 0.6, ease }}>
              Eight simple steps take you from your first idea to the Foundation Day stage.
            </motion.p>
          </div>

          <motion.div className="st-hero-art" initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={inView} transition={{ duration: 0.9, ease }} aria-hidden>
            <Parallax y={26} rotate={3}>
            <svg viewBox="0 0 320 200">
              <ellipse cx="185" cy="170" rx="110" ry="22" fill="url(#sV)" />
              <ellipse cx="185" cy="162" rx="110" ry="22" fill="#4a33b2" />
              <ellipse cx="185" cy="160" rx="96" ry="16" fill="none" stroke="#b49cff" strokeWidth="2.5" filter="url(#sGlow)" />
              <ellipse cx="160" cy="118" rx="150" ry="40" fill="none" stroke="#a68cff" strokeWidth="2" opacity=".8" transform="rotate(-10 160 118)" filter="url(#sGlow)" />
              <g className="st-float">
                <rect x="40" y="30" width="78" height="100" rx="10" fill="url(#sVl)" stroke="#b9a6ff" strokeWidth="2" transform="rotate(-10 79 80)" />
                <g transform="rotate(-10 79 80)">
                  <rect x="62" y="22" width="34" height="14" rx="5" fill="url(#sV)" />
                  {[56, 80, 104].map((y) => (
                    <g key={y}>
                      <path d={`M52 ${y}l5 5 9-10`} stroke="#6a4ce0" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="72" y={y - 3} width="34" height="6" rx="3" fill="#9d84ff" />
                    </g>
                  ))}
                </g>
                <rect x="232" y="104" width="12" height="40" rx="2" fill="#9d84ff" />
                <rect x="250" y="86" width="12" height="58" rx="2" fill="#7a5df0" />
                <rect x="268" y="70" width="12" height="74" rx="2" fill="#6a4ce0" />
                <circle cx="185" cy="66" r="34" fill="url(#sGold)" filter="url(#sGlow)" />
                <path d="M172 66l8-10 6 14 8-12" stroke="#fff6d6" strokeWidth="3" fill="none" strokeLinecap="round" />
                <rect x="170" y="98" width="30" height="10" rx="4" fill="#c9bcff" />
                <rect x="173" y="110" width="24" height="9" rx="4" fill="#9d84ff" />
                <rect x="166" y="122" width="38" height="22" rx="6" fill="url(#sV)" />
              </g>
            </svg>
            </Parallax>
          </motion.div>
        </div>

        <div className="st-grid">
          {/* glowing connector: right of step 4 loops down and back to the left of step 5 */}
          <svg className="st-connector" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M985 95 C 1010 95, 1010 200, 960 200 L 40 200 C -10 200, -10 305, 15 305"
              fill="none"
              stroke="#b49cff"
              strokeWidth="2.5"
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={inView}
              transition={{ duration: 1.6, delay: 0.4, ease }}
            />
          </svg>

          {STEPS.map((s, i) => (
            <Tilt
              as="article"
              key={s.t}
              className="st-card"
              initial={{ opacity: 0, y: reduce ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.6, delay: (i % 4) * 0.1 + (i >= 4 ? 0.3 : 0), ease }}
            >
              <span className="st-no">{String(i + 1).padStart(2, "0")}</span>
              <div className="st-art" aria-hidden>
                {ART[i] ?? (
                  <div className="st-trophy">
                    <svg viewBox="0 0 40 70" className="st-laurel">
                      <path d="M34 66C14 56 6 36 12 10" fill="none" stroke="#f2b632" strokeWidth="2.5" strokeLinecap="round" />
                      {[0, 1, 2, 3, 4].map((k) => (
                        <ellipse key={k} cx={30 - 18 * Math.sin((k / 4) * 1.4) - 4} cy={62 - 50 * (k / 4)} rx="7.5" ry="3.2" transform={`rotate(${-40 - k * 11} ${30 - 18 * Math.sin((k / 4) * 1.4) - 4} ${62 - 50 * (k / 4)})`} fill="#f5c043" />
                      ))}
                    </svg>
                    <Trophy tone="gold" />
                    <svg viewBox="0 0 40 70" className="st-laurel flip">
                      <path d="M34 66C14 56 6 36 12 10" fill="none" stroke="#f2b632" strokeWidth="2.5" strokeLinecap="round" />
                      {[0, 1, 2, 3, 4].map((k) => (
                        <ellipse key={k} cx={30 - 18 * Math.sin((k / 4) * 1.4) - 4} cy={62 - 50 * (k / 4)} rx="7.5" ry="3.2" transform={`rotate(${-40 - k * 11} ${30 - 18 * Math.sin((k / 4) * 1.4) - 4} ${62 - 50 * (k / 4)})`} fill="#f5c043" />
                      ))}
                    </svg>
                  </div>
                )}
              </div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              {i % 4 !== 3 && (
                <motion.span className="st-next" aria-hidden animate={reduce ? undefined : { x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}>
                  <Icon name="chevron" size={18} />
                </motion.span>
              )}
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
