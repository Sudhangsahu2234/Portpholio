"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";

const chapters = [
  { id: "studio", label: "Workshop" },
  { id: "work", label: "Selected work" },
  { id: "about", label: "Experience" },
] as const;

function NorthEast() {
  return <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 13 12.5 3.5M3.5 3.5h9v9" /></svg>;
}

export default function PortfolioNav() {
  const [current, setCurrent] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = ["hero", ...chapters.map(chapter => chapter.id), "contact"]
      .map(id => document.getElementById(id));
    let frame = 0;
    function update() {
      frame = 0;
      const threshold = Math.min(230, window.innerHeight * .29);
      const active = sections.findLast(section => section && section.getBoundingClientRect().top <= threshold);
      const atFoot = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
      setCurrent(atFoot ? "contact" : active?.id ?? "hero");
      setScrolled(window.scrollY > 66);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    function outside(event: PointerEvent) {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) menu.current.open = false;
    }
    function key(event: KeyboardEvent) {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        trigger.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 701px)");
    function resize() { if (desktop.matches && menu.current) menu.current.open = false; }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    desktop.addEventListener("change", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key);
      desktop.removeEventListener("change", resize);
    };
  }, []);

  function closeMenu() { if (menu.current) menu.current.open = false; }
  const links = chapters.map(({ id, label }) =>
    <a key={id} className="nav-link" href={`#${id}`} aria-current={current === id ? "location" : undefined} onClick={closeMenu}>{label}</a>
  );

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="nav-inner">
        <a className="signature" href="#hero" aria-label="Sudhang Sahu, back to top" onClick={closeMenu}>
          <BrandMark /><span>Sudhang Sahu</span>
        </a>
        <nav className="desktop-menu" aria-label="Primary navigation">{links}</nav>
        <a className="nav-contact" href="#contact">Contact <NorthEast /></a>
        <details className="mobile-menu" ref={menu}>
          <summary ref={trigger} className="menu-toggle" aria-label="Portfolio menu">
            <span className="menu-open-label">Menu</span><span className="menu-close-label">Close</span>
            <span className="menu-bars" aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile navigation" className="menu-sheet">
            {links}
            <a className="nav-link" href="#contact" onClick={closeMenu}>Get in touch <NorthEast /></a>
          </nav>
        </details>
      </div>
    </header>
  );
}
