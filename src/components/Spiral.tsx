"use client";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { STEPS, STEP_IMAGES } from "@/lib/content";

const N = STEPS.length;
// where each step photo is anchored when the card crops it (x% y%)
const FOCUS = ["50% 50%", "50% 50%", "50% 50%", "50% 50%", "46% 68%", "50% 40%", "50% 50%", "50% 50%"];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function Card({ i, a, step, onPick }: { i: number; a: MotionValue<number>; step: number; onPick: () => void }) {
  // Neighbouring cards sit side by side (never overlapping, so 3D layering stays clean) and fade as they swing round.
  const opacity = useTransform(a, (v) => {
    const d = Math.abs((((i - v) * step + 540) % 360) - 180);
    return clamp(1 - (d - 20) / 90, 0.1, 1);
  });
  return (
    <motion.button
      type="button"
      className="hcard"
      style={{ opacity, transform: `rotateY(${i * step}deg) translateZ(var(--R)) translateY(calc(var(--rise) * ${i}))` }}
      onClick={onPick}
      aria-label={`Step ${i + 1}: ${STEPS[i].t}`}
    >
      <span className="hphoto">
        <Image src={`/images/steps/${STEP_IMAGES[i]}`} alt="" fill sizes="300px" style={{ objectFit: "cover", objectPosition: FOCUS[i] }} />
        <span className="hn">
          STEP {i + 1} / {N}
        </span>
      </span>
      <span className="hbody">
        <span className="ht">{STEPS[i].t}</span>
        <span className="hs">{STEPS[i].d}</span>
      </span>
    </motion.button>
  );
}

/** 3D spiral: scrolling winds a helix of step-cards around the viewer. */
export default function Spiral() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [rise, setRise] = useState(90);
  const [step, setStep] = useState(40);
  const [active, setActive] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const a = useTransform(p, [0, 1], [0, N - 1]);
  const rotateY = useTransform(a, (v) => -v * step);
  const y = useTransform(a, (v) => -v * rise);
  const ring1 = useTransform(p, [0, 1], [0, 720]);
  const ring2 = useTransform(p, [0, 1], [0, -540]);
  const fill = useTransform(p, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const f = () => {
      setRise(mq.matches ? 66 : 90);
      setStep(mq.matches ? 45 : 40);
    };
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  useMotionValueEvent(a, "change", (v) => setActive(clamp(Math.round(v), 0, N - 1)));

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const y = top + span * (i / (N - 1)) + 1;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  if (reduce) {
    return (
      <section id="journey" className="spiral-static">
        <div className="wrap">
          <p className="eyebrow">How it works</p>
          <h2>Your journey, step by step</h2>
          <ol className="steps-list">
            {STEPS.map((s) => (
              <li key={s.t}>
                <b>{s.t}.</b> {s.d}
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="journey" className="spiral" aria-label="Your journey, step by step">
      <div className="sp-stick">
        <div className="sp-head">
          <p className="eyebrow yellow">(03) How it works · scroll to spiral through</p>
          <h2>Your journey, step by step</h2>
        </div>
        <div className="sp-grid">
          <div className="sp-panel">
            <motion.div key={active} initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}>
              <div className="big">{String(active + 1).padStart(2, "0")}</div>
              <h3>{STEPS[active].t}</h3>
              <p>{STEPS[active].d}</p>
            </motion.div>
            <div className="sp-prog">
              <motion.i style={{ width: fill }} />
            </div>
            <div className="sp-dots">
              {STEPS.map((s, i) => (
                <button key={s.t} className={i === active ? "on" : ""} onClick={() => jump(i)} aria-label={`Go to step ${i + 1}: ${s.t}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="sp-scene">
            <motion.div className="sp-ring" style={{ rotate: ring1 }} />
            <motion.div className="sp-ring r2" style={{ rotate: ring2 }} />
            <motion.div className="helix" style={{ rotateY, y }}>
              {STEPS.map((_, i) => (
                <Card key={i} i={i} a={a} step={step} onPick={() => jump(i)} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
