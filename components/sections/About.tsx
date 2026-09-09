'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useSectionStore } from '@/lib/section-store';
import SectionMark from '@/components/sections/SectionMark';

// Education, verbatim from the résumé. The résumé gives "July 2022" for the
// B.Tech (programme start) and "December 2026" for the IIT Madras B.S.;
// the portfolio spec says the B.S. graduates May 2026 — see summary note.
const education = [
  {
    school: 'Indian Institute of Technology Madras (Online)',
    degree: 'B.S., Data Science and Applications',
    detail: 'Expected 2026 · Foundation Level completed',
  },
  {
    school: 'Shri Shankaracharya Institute of Professional Management and Technology (SSIPMT)',
    degree: 'B.Tech, Computer Science & Engineering — Data Science Specialization',
    detail: 'Raipur, CG · Final year',
  },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const setActive = useSectionStore((s) => s.setActive);
  const setAboutProgress = useSectionStore((s) => s.setAboutProgress);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive('about'),
        onEnterBack: () => setActive('about'),
      });

      // drives the warrior's scroll-scrubbed rotation in Scene.tsx
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => setAboutProgress(self.progress),
      });

      gsap.from('.about-line', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: { trigger: el, start: 'top 70%' },
      });
    }, el);
    return () => ctx.revert();
  }, [setActive, setAboutProgress]);

  return (
    <section ref={ref} id="about" className="section about">
      <SectionMark char="面" />
      <div className="about-copy">
        <p className="about-line eyebrow">{'// 素顔 — THE FACE BENEATH THE MASK'}</p>
        <p className="about-line">
          Final-year B.Tech CSE (Data Science) student at SSIPMT Raipur, completing a
          B.S. in Data Science from IIT Madras alongside it. My background sits at the
          intersection of three things most portfolios treat separately: production
          data pipelines, applied machine learning, and the embedded/hardware layer
          underneath them.
        </p>
        <p className="about-line">
          That combination came from working hands-on with industrial telemetry — real
          sensors, real SCADA systems, real dashboards people actually watched — before
          building GenAI and NLP systems on top of that same instinct for how data moves
          through a system.
        </p>
        <p className="about-line">
          Currently looking for a Data Engineering or Data Analytics/ML role at a product
          company, to own that full path — from ingestion to the interface someone uses
          to make a decision.
        </p>

        <ul className="edu-list about-line">
          {education.map((e) => (
            <li key={e.school} className="edu-item">
              <strong>{e.degree}</strong>
              <span>
                {e.school} · {e.detail}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
