"use client";
import Lenis from "lenis";
import { useEffect } from "react";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Inertial smooth scrolling (Lenis). Native scroll position is kept, so framer-motion's useScroll keeps working. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.2 });
    window.__lenis = lenis;

    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    });

    // In-page anchors glide instead of jumping
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = a?.getAttribute("href");
      if (!a || !hash || hash === "#") return;
      const el = hash === "#top" ? document.body : document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(hash === "#top" ? 0 : el, { offset: -72, duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(id);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}
