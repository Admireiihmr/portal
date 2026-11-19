"use client";
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RULES } from "@/lib/content";
import { useStickyProgress } from "@/lib/useStickyProgress";
import Image from "next/image";
import SplitHeading from "./SplitHeading";
import TiltCard from "./TiltCard";

const N = RULES.length;
// one photo per rule, in order (a changed photo needs a new filename: Next caches optimised copies by name)
const PHOTOS = ["rule-1.jpg", "rule-2.jpg", "rule-3-speaker.jpg", "rule-4.jpg", "rule-5.jpg", "rule-6.jpg"];
// where each photo is anchored when the card crops it (x% y%)
const FOCUS = ["50% 50%", "50% 40%", "70% 30%", "50% 50%", "50% 40%", "50% 50%"];

function RuleCard({ i }: { i: number }) {
  const r = RULES[i];
  return (
    <TiltCard>
      <span className="rule-no" aria-hidden>
        {String(i + 1).padStart(2, "0")}
      </span>
      <span className="rule-ic" aria-hidden>
        {r.icon}
      </span>
      <div className="rule-photo" aria-hidden="true">
        <Image src={`/images/rules/${PHOTOS[i]}`} alt="" fill sizes="(max-width: 960px) 90vw, 420px" style={{ objectFit: "cover", objectPosition: FOCUS[i] }} />
      </div>
      <h3>{r.title}</h3>
      <p>{r.text}</p>
    </TiltCard>
  );
}

/**
 * Pinned section: the heading and a live counter stay on the left while vertical scrolling slides the
 * rule cards across the right. Falls back to a plain grid on small screens or for reduced motion.
 */
export default function HorizontalRules() {
  const ref = useRef<HTMLElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [dist, setDist] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const calc = () => {
      const on = window.innerWidth >= 960 && !reduce;
      setEnabled(on);
      if (on && track.current && win.current) setDist(Math.max(0, track.current.scrollWidth - win.current.clientWidth));
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (track.current) ro.observe(track.current);
    if (win.current) ro.observe(win.current);
    window.addEventListener("resize", calc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, [reduce, enabled]);

  const p = useStickyProgress(ref, enabled);
  const x = useTransform(p, [0, 1], [0, -dist]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))))));

  if (!enabled) {
    return (
      <section id="rules" className="sec">
        <div className="wrap">
          <p className="eyebrow">(02) Ground rules</p>
          <SplitHeading text={"Simple rules,\nbig freedom"} />
          <div className="rules-grid">
            {RULES.map((_, i) => (
              <RuleCard key={i} i={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="rules" className="hrules" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="hr-stick">
        <div className="hr-left">
          <p className="eyebrow">(02) Ground rules</p>
          <SplitHeading text={"Simple rules,\nbig freedom"} />
          <p className="hr-sub">Six things to know before you submit. Keep scrolling to move through them.</p>
          <div className="hr-count" aria-live="polite">
            <b>{String(active + 1).padStart(2, "0")}</b>
            <span>/ {String(N).padStart(2, "0")}</span>
          </div>
          <div className="hr-bar" aria-hidden="true">
            <motion.i style={{ width: bar }} />
          </div>
        </div>
        <div className="hr-window" ref={win}>
          <motion.div ref={track} className="hr-track" style={{ x }}>
            {RULES.map((_, i) => (
              <div className="hr-card" key={i}>
                <RuleCard i={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
