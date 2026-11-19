"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Icon from "./Icon";

/** Phone-only sticky bar: appears after the hero, hides while the form itself is on screen. */
export default function MobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const update = () => {
      const form = document.getElementById("submit")?.getBoundingClientRect();
      const formVisible = !!form && form.top < window.innerHeight && form.bottom > 0;
      setShow(window.scrollY > window.innerHeight * 0.8 && !formVisible);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="mcta" initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <div>
            <b>Foundation Day</b>
            <span>Idea Presentation</span>
          </div>
          <a href="#submit" className="btn btn-primary">
            Submit <Icon name="arrow" size={16} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
