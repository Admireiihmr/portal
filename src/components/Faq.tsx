"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FAQ } from "@/lib/content";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="sec">
      <div className="wrap narrow">
        <Reveal>
          <p className="label">07 — FAQ</p>
          <SplitHeading text={"Frequently asked\nquestions"} />
        </Reveal>
        <div className="faq">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                    {f.q}
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} aria-hidden>
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <p>{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
