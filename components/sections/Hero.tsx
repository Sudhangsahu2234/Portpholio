'use client';

import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useSectionStore } from '@/lib/section-store';
import { bladeCut, inkRipple } from '@/lib/interactions';
import SectionMark from '@/components/sections/SectionMark';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const setActive = useSectionStore((s) => s.setActive);
  const setHeroProgress = useSectionStore((s) => s.setHeroProgress);

  // The CTAs are the one place the katana metaphor gets to be literal: the
  // blade passes through the control before the page moves.
  const cut = (e: MouseEvent<HTMLElement>) => {
    inkRipple(e);
    bladeCut(e.currentTarget);
  };

  const goTo = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    cut(e);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // tells the shared Canvas which model to show
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive('hero'),
        onEnterBack: () => setActive('hero'),
      });

      // drives the torii "push-through" as the hero scrolls away
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => setHeroProgress(self.progress),
      });

      gsap.from(
        '.hero-eyebrow, .hero-title, .hero-subhead, .hero-lede, .hero-meta, .hero-actions',
        {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );
    }, el);

    return () => ctx.revert(); // avoids duplicate triggers on fast refresh / unmount
  }, [setActive, setHeroProgress]);

  return (
    <section ref={sectionRef} id="hero" className="section hero">
      <SectionMark char="門" />
      <p className="hero-eyebrow">{'// OPEN TO DATA ENGINEERING & ML ROLES'}</p>
      <h1 className="hero-title">Sudhang Sahu</h1>
      <p className="hero-subhead">Data Engineer &amp; ML Systems Builder</p>
      <p className="hero-lede">
        Pipelines, telemetry, and applied GenAI — shipped from first principles.
      </p>
      <p className="hero-meta">
        Raipur, Chhattisgarh, India · B.S. Data Science, IIT Madras (2026) · B.Tech
        CSE (Data Science), SSIPMT Raipur
      </p>
      <div className="hero-actions">
        <button className="hero-cta hero-cta-primary has-ink" onClick={goTo('projects')}>
          View Projects →
        </button>
        <a
          className="hero-cta has-ink"
          href="/Sudhang_Sahu_Resume.pdf"
          download
          onClick={cut}
        >
          Download Résumé ↓
        </a>
        <button className="hero-cta has-ink" onClick={goTo('contact')}>
          Get in Touch
        </button>
      </div>
    </section>
  );
}
