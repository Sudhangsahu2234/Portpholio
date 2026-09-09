'use client';

import { useSectionStore, type Section } from '@/lib/section-store';

/**
 * Scroll-spy rail. The active section is already tracked in the zustand store
 * by each section's ScrollTrigger, so this needs no scroll listener of its own
 * — it just reads `active`, which the store notes changes rarely and is safe to
 * consume reactively.
 *
 * Plain `<a href="#id">` rather than a JS scroll handler: `scroll-behavior:
 * smooth` in globals.css already animates it, and anchors stay keyboard- and
 * middle-click-friendly for free.
 */
const NAV: { id: Section; kanji: string; label: string }[] = [
  { id: 'hero', kanji: '門', label: 'Enter' },
  { id: 'about', kanji: '面', label: 'About' },
  { id: 'projects', kanji: '業', label: 'Work' },
  { id: 'experience', kanji: '道', label: 'Path' },
  { id: 'skills', kanji: '武', label: 'Arsenal' },
  { id: 'contact', kanji: '印', label: 'Contact' },
];

export default function SideNav() {
  const active = useSectionStore((s) => s.active);

  return (
    <nav className="side-nav" aria-label="Sections">
      <ul>
        {NAV.map(({ id, kanji, label }, i) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="side-nav-link"
              aria-current={active === id ? 'true' : undefined}
            >
              <span className="side-nav-kanji" aria-hidden="true">
                {kanji}
              </span>
              <span className="side-nav-label">
                <i>{String(i + 1).padStart(2, '0')}</i>
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
