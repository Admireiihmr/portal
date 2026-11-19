"use client";
import { motion, useReducedMotion } from "framer-motion";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

const POD = [
  { n: 2, label: "Runner-up", h: 62 },
  { n: 1, label: "Winner", h: 100 },
  { n: 3, label: "Second runner-up", h: 44 },
];

const MORE = [
  { icon: "medal", title: "3 consolation awards", text: "Three more ideas are recognised on the day." },
  { icon: "mic", title: "Four minutes on stage", text: "Every finalist pitches to the expert panel." },
  { icon: "cert", title: "Certificate", text: "For every presenter, printed and digital." },
];

export default function Awards() {
  const reduce = useReducedMotion();
  return (
    <section id="awards" className="sec">
      <div className="wrap awards">
        <div className="awards-copy">
          <Reveal>
            <p className="label">05 — Awards</p>
          </Reveal>
          <SplitHeading text={"Six awards\non the day"} />
          <Reveal delay={0.1}>
            <p className="intro">The top three ideas win, three more receive consolation awards, and every presenter gets a certificate. Award details will be announced by the organisers.</p>
          </Reveal>
          <ul className="more">
            {MORE.map((m, i) => (
              <Reveal key={m.title} delay={0.1 + i * 0.08}>
                <li>
                  <span className="more-ic">
                    <Icon name={m.icon} size={20} />
                  </span>
                  <div>
                    <b>{m.title}</b>
                    <span>{m.text}</span>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="podium" aria-label="Top three places">
          {POD.map((p, i) => (
            <div className={`pod p${p.n}`} key={p.n}>
              <span className="pod-label">{p.label}</span>
              <motion.div
                className="pod-bar"
                style={{ height: `${p.h}%` }}
                initial={{ scaleY: reduce ? 1 : 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: 0.15 * i, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {p.n === 1 && <Icon name="trophy" size={26} />}
                <span className="pod-n">{p.n}</span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
