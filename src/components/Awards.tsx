"use client";
import { motion } from "framer-motion";
import RotBadge from "./RotBadge";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

const POD = [
  { n: "2", place: "Second place", sub: "Runner-up", cls: "p2", h: 230, d: 0.25, medal: "🥈" },
  { n: "1", place: "First place", sub: "Winner", cls: "p1", h: 290, d: 0, medal: "🥇" },
  { n: "3", place: "Third place", sub: "Second runner-up", cls: "p3", h: 190, d: 0.5, medal: "🥉" },
];

const EXTRA = [
  { icon: "🏅", title: "3 consolation awards", sub: "Three more ideas are recognised" },
  { icon: "🎤", title: "Your moment on stage", sub: "About four minutes to pitch to the panel" },
  { icon: "📜", title: "Certificate", sub: "For every presenter, printed and digital", cert: true },
];

export default function Awards() {
  return (
    <section id="awards" className="sec awards">
      <div className="wrap rel">
        <RotBadge className="awards-badge" light={false} text="Top 3 • 3 Consolation • Certificates •" centre="6" />
        <Reveal>
          <p className="eyebrow">(05) Recognition</p>
          <SplitHeading text={"Six awards,\none big stage"} />
          <p className="sub">The top three ideas win, three more are recognised with consolation awards, and every presenter receives a certificate. Award details will be announced by the organisers.</p>
        </Reveal>

        <div className="podium">
          {POD.map((p) => (
            <motion.div
              key={p.n}
              className={`pod ${p.cls}`}
              initial={{ scaleY: 0.12, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 90, damping: 14, delay: p.d }}
              style={{ height: p.h, transformOrigin: "bottom" }}
            >
              <span className="shine" aria-hidden />
              <span className="medal">{p.medal}</span>
              <span className="pl">{p.place}</span>
              <span className="ps">{p.sub}</span>
              <span className="pnum" aria-hidden>
                {p.n}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="podium-floor" aria-hidden />

        <div className="cons">
          {EXTRA.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.08}>
              <div className={`cons-card ${e.cert ? "cert" : ""}`}>
                <span className="medal">{e.icon}</span>
                <b>{e.title}</b>
                <small>{e.sub}</small>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
