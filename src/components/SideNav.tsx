"use client";
import { useEffect, useState } from "react";

const ITEMS = [
  ["top", "Home"],
  ["guidelines", "Guidelines"],
  ["awards", "Awards"],
  ["submit", "Submit"],
  ["faq", "FAQ"],
] as const;

/** Dot navigation fixed to the right edge that follows the section in view. */
export default function SideNav() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    // the current section is the last one whose top has passed the middle of the viewport (robust to big jumps)
    const update = () => {
      let cur: string = ITEMS[0][0];
      for (const [id] of ITEMS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) cur = id;
      }
      setActive(cur);
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
    <nav className="sidenav" aria-label="Sections">
      {ITEMS.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={active === id ? "on" : ""} aria-label={label} aria-current={active === id}>
          <span>{label}</span>
          <i />
        </a>
      ))}
    </nav>
  );
}
