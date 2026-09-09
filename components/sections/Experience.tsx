'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useSectionStore } from '@/lib/section-store';
import SectionMark from '@/components/sections/SectionMark';

// Roles, dates, locations and stacks are taken from the résumé, which is the
// authoritative source. Reverse-chronological.
//
// NOTE: the résumé titles the Gazpro role "Software Automation Engineer"; the
// portfolio spec calls the same role "Internship Engineer — Industrial
// Automation". The résumé title is used here — see summary note.
const roles = [
  {
    year: 'Jun 2026 — Jul 2026',
    role: 'Robotics Research Intern',
    org: 'IIT Mandi',
    location: 'Mandi, Himachal Pradesh',
    desc: 'Prototyped an autonomous Smart Cleaning Robot using an ESP32 as the main compute unit, HC-SR04 ultrasonic sensors for obstacle detection, and a TB6612FNG motor driver controlling differential-drive DC motors for real-time navigation. Also built a Gesture Control Robot that captures hand motion with an MPU6050 accelerometer-gyroscope and transmits control signals over nRF24L01 to an Arduino Uno receiver driving the robot through an L298N driver.',
    stack: 'ESP32 · Arduino Uno · MPU6050 · nRF24L01 · HC-SR04 · TB6612FNG · L298N',
  },
  {
    year: 'Oct 2025 — Jan 2026',
    role: 'Software Automation Engineer',
    org: 'Gazpro FZC',
    location: 'Berbera, Somaliland (onsite) & Remote, India',
    desc: 'Built and orchestrated data pipelines with Python and Apache Airflow to automate ingestion and processing of live industrial data from oil & gas terminal operations. Integrated MQTT and SCADA systems for real-time data acquisition, stored time-series data in InfluxDB, and visualised operational metrics through Grafana dashboards. Containerised services with Docker and exposed automation workflows via REST APIs.',
    stack: 'Python · Apache Airflow · MQTT · SCADA · InfluxDB · Grafana · Docker · REST APIs',
  },
  {
    year: 'Aug 2024 — Jan 2025',
    role: 'Front-End Developer',
    org: 'Love In Property',
    location: 'Raipur, CG',
    desc: 'Developed responsive production interfaces in React.js on a component-based architecture, improving page-load performance through lazy loading and code splitting. Integrated RESTful APIs and implemented state-management strategies, and owned the front-end design-to-development pipeline for a property-listings website — designing the UI/UX in Figma and implementing the responsive, interactive pages.',
    stack: 'JavaScript · React.js · CSS · REST APIs · Figma',
  },
];

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const setActive = useSectionStore((s) => s.setActive);
  const setExperienceProgress = useSectionStore((s) => s.setExperienceProgress);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive('experience'),
        onEnterBack: () => setActive('experience'),
      });

      // drives the torii's swing and recede in Scene.tsx
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => setExperienceProgress(self.progress),
      });

      gsap.from('.timeline-spine', {
        scaleY: 0,
        transformOrigin: 'top',
        scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 80%', scrub: 1 },
      });

      gsap.utils.toArray<HTMLElement>('.timeline-entry').forEach((entry) => {
        gsap.from(entry, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          scrollTrigger: { trigger: entry, start: 'top 75%' },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [setActive, setExperienceProgress]);

  return (
    <section ref={ref} id="experience" className="section experience">
      <SectionMark char="道" />
      <p className="eyebrow">{'// 04 — THE PATH'}</p>
      <h2 className="section-title">Experience</h2>
      <div className="timeline">
        <div className="timeline-spine" />
        {roles.map((r) => (
          <div key={r.role + r.org} className="timeline-entry">
            <span className="timeline-year">{r.year}</span>
            <h3>
              {r.role} — {r.org}
            </h3>
            <p className="timeline-loc">{r.location}</p>
            <p className="timeline-desc">{r.desc}</p>
            <p className="timeline-stack">{r.stack}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
