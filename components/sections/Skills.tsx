'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useSectionStore } from '@/lib/section-store';
import { inkRipple, tapPop } from '@/lib/interactions';
import SectionMark from '@/components/sections/SectionMark';

// Every tool below appears in the résumé (SKILLS section or an experience
// bullet) or in the portfolio spec (§5.5). The résumé's four flat groups have
// been split into five so the pipeline/telemetry stack — which is only listed
// inside the Gazpro experience bullets on the résumé — reads as a skill group
// of its own rather than being buried.
const racks = [
  {
    name: 'Data & Analytics',
    tools: ['Python', 'SQL (PostgreSQL)', 'Power BI', 'Statistical Analysis'],
  },
  {
    name: 'Data Engineering & Telemetry',
    tools: ['Apache Airflow', 'MQTT', 'SCADA', 'InfluxDB', 'Grafana', 'Docker'],
  },
  {
    name: 'AI & ML Systems',
    tools: [
      'NLP (spaCy)',
      'Embeddings & Vector Search',
      'Retrieval-Augmented Generation (RAG)',
      'LangGraph',
      'CrewAI',
      'LLM APIs',
    ],
  },
  {
    name: 'Software Engineering',
    tools: [
      'JavaScript (ES6+)',
      'TypeScript',
      'React.js',
      'Next.js',
      'REST APIs',
      'Git',
      'Tailwind CSS',
    ],
  },
  {
    name: 'Robotics & Embedded Systems',
    tools: ['Arduino', 'ESP32', 'Embedded C', 'Sensor Integration', 'Motor Control'],
  },
];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const setActive = useSectionStore((s) => s.setActive);
  const setSkillsProgress = useSectionStore((s) => s.setSkillsProgress);
  const [pinned, setPinned] = useState<Record<string, boolean>>({});

  const onTagClick = (tool: string) => (e: MouseEvent<HTMLButtonElement>) => {
    inkRipple(e, 'var(--color-gold)');
    tapPop(e.currentTarget);
    setPinned((prev) => ({ ...prev, [tool]: !prev[tool] }));
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive('skills'),
        onEnterBack: () => setActive('skills'),
      });

      // drives the katana rack rotation in Scene.tsx
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => setSkillsProgress(self.progress),
      });

      gsap.utils.toArray<HTMLElement>('.skill-tag').forEach((tag, i) => {
        gsap.from(tag, {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          delay: i * 0.02,
          scrollTrigger: { trigger: tag, start: 'top 90%' },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [setActive, setSkillsProgress]);

  return (
    <section ref={ref} id="skills" className="section skills">
      <SectionMark char="武" />
      <p className="eyebrow">{'// 05 — THE ARSENAL'}</p>
      <h2 className="section-title">Skills</h2>
      {racks.map((rack) => (
        <div key={rack.name} className="skill-rack">
          <p className="skill-rack-name">{rack.name}</p>
          <div className="skill-tags">
            {rack.tools.map((t) => (
              <button
                key={t}
                type="button"
                className="skill-tag has-ink"
                aria-pressed={!!pinned[t]}
                onClick={onTagClick(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
