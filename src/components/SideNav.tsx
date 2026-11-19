"use client";
import { useEffect, useState } from "react";

const ITEMS = [
  ["top", "Home"],
  ["about", "About"],
  ["rules", "Rules"],
  ["journey", "Journey"],
  ["awards", "Awards"],
  ["submit", "Submit"],
  ["faq", "FAQ"],
] as const;

/** Dot navigation fixed to the right edge that follows the section in view. */
export default function SideNav() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ITEMS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
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
