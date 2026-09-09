'use client';

import type { MouseEvent as ReactMouseEvent } from 'react';
import { gsap } from './gsap';

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Sumi-ink ripple spreading from the pointer. The host element needs
 * `position: relative` and `overflow: hidden` (see .has-ink in globals.css).
 */
export function inkRipple(e: ReactMouseEvent<HTMLElement>, color = 'var(--color-gold)') {
  const host = e.currentTarget;
  if (prefersReducedMotion() || !host) return;

  const rect = host.getBoundingClientRect();
  const dot = document.createElement('span');
  dot.className = 'ink-ripple';
  dot.style.left = `${e.clientX - rect.left}px`;
  dot.style.top = `${e.clientY - rect.top}px`;
  dot.style.background = color;
  host.appendChild(dot);

  const reach = Math.hypot(rect.width, rect.height) * 2;
  gsap.fromTo(
    dot,
    { width: 0, height: 0, opacity: 0.35 },
    {
      width: reach,
      height: reach,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => dot.remove(),
    }
  );
}

/** A single gold cut sweeping left-to-right, like a blade passing through. */
export function bladeCut(host: HTMLElement | null) {
  if (prefersReducedMotion() || !host) return;

  const line = document.createElement('span');
  line.className = 'blade-cut';
  host.appendChild(line);

  gsap
    .timeline({ onComplete: () => line.remove() })
    .fromTo(
      line,
      { scaleX: 0, opacity: 1, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.26, ease: 'power3.in' }
    )
    .to(line, { opacity: 0, duration: 0.3, ease: 'power2.out' }, '>-0.02');
}

/** Hanko press — the tile is a seal, so clicking it should feel stamped. */
export function hankoPress(host: HTMLElement | null) {
  if (prefersReducedMotion() || !host) return;
  gsap
    .timeline()
    .to(host, { scale: 0.92, duration: 0.07, ease: 'power2.out' })
    .to(host, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' });
}

/** Quick tactile pop, for small targets where a ripple would be too much. */
export function tapPop(host: HTMLElement | null) {
  if (prefersReducedMotion() || !host) return;
  gsap
    .timeline()
    .to(host, { scale: 0.94, duration: 0.06, ease: 'power2.out' })
    .to(host, { scale: 1, duration: 0.36, ease: 'back.out(3)' });
}
