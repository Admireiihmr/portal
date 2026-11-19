"use client";
import { motion, useReducedMotion } from "framer-motion";
import { FUNNEL } from "@/lib/content";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

// width of the funnel at the top of each layer, in % (the last number is the bottom of the final layer)
const W = [100, 78, 56, 36, 20];

export default function Funnel() {
  const reduce = useReducedMotion();
  return (
    <section className="sec funnel-sec">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">(04) The path to the stage</p>
        </Reveal>
        <SplitHeading text={"From abstract\nto applause"} />

        <div className="fn">
          {FUNNEL.map((f, i) => {
            const a = (100 - W[i]) / 2;
            const b = (100 - W[i + 1]) / 2;
            return (
              <div className="fn-row" key={f.short}>
                <motion.div
                  className={`fn-layer l${i + 1}`}
                  style={{ clipPath: `polygon(${a}% 0, ${100 - a}% 0, ${100 - b}% 100%, ${b}% 100%)` }}
                  initial={{ opacity: 0, y: reduce ? 0 : -36, scaleY: reduce ? 1 : 0.7 }}
                  whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.85, delay: i * 0.17, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <span className="fn-ic" aria-hidden>
                    {f.icon}
                  </span>
                  <span className="fn-short">{f.short}</span>
                  <span className="fn-shine" aria-hidden />
                </motion.div>

                <motion.div
                  className="fn-text"
                  initial={{ opacity: 0, x: reduce ? 0 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, delay: 0.25 + i * 0.17, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <span className="fn-no">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
