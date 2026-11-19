"use client";
import { motion, useReducedMotion } from "framer-motion";
import { FUNNEL } from "@/lib/content";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

// width of the funnel at the top of each layer, in % (the last number is the bottom of the final layer)
const W = [100, 80, 60, 40, 24];

export default function Funnel() {
  const reduce = useReducedMotion();
  return (
    <section className="sec funnel-sec">
      <div className="wrap">
        <Reveal>
          <p className="label">04 — Selection</p>
        </Reveal>
        <SplitHeading text={"From submission\nto the stage"} />

        <div className="fn">
          {FUNNEL.map((f, i) => {
            const a = (100 - W[i]) / 2;
            const b = (100 - W[i + 1]) / 2;
            return (
              <div className="fn-row" key={f.short}>
                <motion.div
                  className={`fn-layer l${i + 1}`}
                  style={{ clipPath: `polygon(${a}% 0, ${100 - a}% 0, ${100 - b}% 100%, ${b}% 100%)` }}
                  initial={{ opacity: 0, y: reduce ? 0 : -24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Icon name={f.icon} size={20} />
                  <span className="fn-short">{f.short}</span>
                </motion.div>
                <motion.div
                  className="fn-text"
                  initial={{ opacity: 0, x: reduce ? 0 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <span className="mono">Stage {i + 1}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
