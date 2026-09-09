'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/interactions';

/**
 * An oversized kanji set into the negative space of a section — the traditional
 * counterweight to all the mono/HUD type, and the thing that stops the wide
 * empty right-hand side of each section reading as unfinished. Drifts slowly
 * against the scroll so the page has depth even where there's no 3D.
 */
export default function SectionMark({ char }: { char: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // -50 is the resting centred position (matches translateY(-50%) in CSS);
      // GSAP overwrites `transform` outright, so the centring lives here too.
      gsap.fromTo(
        el,
        { yPercent: -50 },
        {
          yPercent: -64,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <span ref={ref} className="section-mark" aria-hidden="true">
      {char}
    </span>
  );
}
