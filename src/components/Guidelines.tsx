"use client";
import { motion, useReducedMotion } from "framer-motion";
import { DEADLINE_TEXT, MAX_FILE_MB } from "@/lib/config";
import { GUIDELINES } from "@/lib/content";
import Icon from "./Icon";

const ease = [0.2, 0.8, 0.2, 1] as const;
const fill = (s: string) => s.replace("{deadline}", DEADLINE_TEXT).replace("{maxMb}", String(MAX_FILE_MB));

/** Detailed submission guidelines, grouped into six sections, shown just before the rule cards. */
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
            <h2 id="gl-title">Detailed guidelines before you submit</h2>
            <p>Please read these carefully. They cover who can take part, what to write, how to submit and what happens next.</p>
          </div>
          <div className="gl-grid">
            {GUIDELINES.map((g, i) => (
              <motion.article key={g.title} className="gl-sec" initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.5, delay: 0.05 * i, ease }}>
                <header>
                  <span className="gl-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="gl-ic" aria-hidden>
                    <Icon name={g.icon} size={20} />
                  </span>
                  <h3>{g.title}</h3>
                </header>
                <ul>
                  {g.points.map((p) => (
                    <li key={p}>
                      <span className="gl-tick" aria-hidden>
                        <Icon name="check" size={13} />
                      </span>
                      <span>{fill(p)}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
