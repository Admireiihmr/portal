"use client";
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RULES } from "@/lib/content";
import { useStickyProgress } from "@/lib/useStickyProgress";
import Icon from "./Icon";
import SplitHeading from "./SplitHeading";
import Tilt from "./Tilt";

const N = RULES.length;
// one photo per rule, in order (a changed photo needs a new filename: Next caches optimised copies by name)
const PHOTOS = ["rule-1.jpg", "rule-2.jpg", "rule-3-speaker.jpg", "rule-4.jpg", "rule-5.jpg", "rule-6.jpg"];
// where each photo is anchored when the card crops it (x% y%)
const FOCUS = ["50% 50%", "50% 40%", "70% 30%", "50% 50%", "50% 40%", "50% 50%"];

function RuleCard({ i }: { i: number }) {
  const r = RULES[i];
  return (
    <Tilt as="article" className="rcard" max={5} lift={1.015}>
      <div className="rcard-photo">
        <Image src={`/images/rules/${PHOTOS[i]}`} alt="" fill sizes="(max-width: 900px) 80vw, 420px" style={{ objectFit: "cover", objectPosition: FOCUS[i] }} />
      </div>
      <div className="rcard-body">
        <div className="rcard-top">
          <span className="rcard-ic">
            <Icon name={r.icon} size={20} />
          </span>
          <span className="mono">Rule {String(i + 1).padStart(2, "0")}</span>
        </div>
        <h3>{r.title}</h3>
        <p>{r.text}</p>
      </div>
    </Tilt>
  );
}

const Header = ({ pinned }: { pinned?: boolean }) => (
  <>
    <p className="label">02 — Rules</p>
    <SplitHeading text="Six things to know before you submit" />
    <p className="intro">{pinned ? "Keep scrolling to move through them." : "Swipe through the cards."}</p>
  </>
);

/**
 * Desktop: pinned section, vertical scroll slides the cards sideways next to a live counter.
 * Phones and reduced motion: a native swipe carousel with scroll-snap.
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
      const on = window.innerWidth >= 1000 && !reduce;
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
          <Header />
        </div>
        <div className="rscroll" role="list">
          {RULES.map((_, i) => (
            <div className="rscroll-item" role="listitem" key={i}>
              <RuleCard i={i} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="rules" className="hrules" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="hr-stick">
        <div className="hr-left">
          <Header pinned />
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
