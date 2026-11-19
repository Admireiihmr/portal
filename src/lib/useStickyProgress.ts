"use client";
import { useMotionValue } from "framer-motion";
import { useEffect, type RefObject } from "react";

/**
 * 0 → 1 progress through a tall section that contains a `position: sticky` stage.
 * Computed straight from the element's rectangle on scroll/resize, so it stays correct even when the
 * section's height changes after the first render (which useScroll's cached measurements can miss).
 */
export function useStickyProgress(ref: RefObject<HTMLElement | null>, active = true, top = 0) {
  const p = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const calc = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - (window.innerHeight - top);
      p.set(span > 0 ? Math.min(1, Math.max(0, (top - r.top) / span)) : 0);
    };
    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
      ro.disconnect();
    };
  }, [ref, active, top, p]);
  return p;
}
