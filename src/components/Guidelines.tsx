"use client";
import { motion, useReducedMotion } from "framer-motion";
import { RULES } from "@/lib/content";
import Icon from "./Icon";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** The six rules as a numbered checklist, shown just before the rule cards. Text comes from RULES so both stay in sync. */
export default function Guidelines() {
  const reduce = useReducedMotion();
  const inView = { once: true, margin: "-60px" } as const;
  return (
    <section id="guidelines" className="gl" aria-labelledby="gl-title">
      <div className="wrap">
        <motion.div className="gl-card" initial={{ opacity: 0, y: reduce ? 0 : 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.7, ease }}>
          <div className="gl-head">
            <span className="gl-badge">
              <Icon name="info" size={16} /> Guidelines
            </span>
            <h2 id="gl-title">Six things to know before you submit</h2>
          </div>
          <ol className="gl-list">
            {RULES.map((r, i) => (
              <motion.li key={r.title} initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.5, delay: 0.05 * i, ease }}>
                <span className="gl-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b>{r.title}</b>
                  <p>{r.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
