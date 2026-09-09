'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useSectionStore } from '@/lib/section-store';
import { bladeCut, inkRipple, prefersReducedMotion } from '@/lib/interactions';
import SectionMark from '@/components/sections/SectionMark';

// Projects, status tags, descriptions and stacks come from the portfolio spec
// (§5.4); the first, fifth and sixth also appear on the résumé.
//
// TODO: no live/demo or repo URL exists for ANY of these in either source
// document — the spec explicitly lists them as still-needed assets (§7).
// Fill in `link` per project and the card becomes a real anchor automatically.
// The Medical Report Analyser is described as deployed on Vercel, but the
// deployment URL is not given anywhere.
type Project = {
  title: string;
  status: string;
  desc: string;
  stack: string;
  link: string | null;
};

const projects: Project[] = [
  {
    title: 'Medical Report Analyser',
    status: 'DEPLOYED',
    desc: 'Full-stack web app that uses LLM APIs to extract, structure and interpret clinical data from uploaded medical reports. Handles static-file routing, API key injection via environment variables, and session-based state management.',
    stack: 'Python · Flask · Vercel · LLM APIs',
    link: null,
  },
  {
    title: 'Obsidian MCP Agent',
    status: 'IN BUILD',
    desc: 'A Python-native, filesystem-first MCP server connecting Claude Desktop directly to an Obsidian vault, built against a phased three-week roadmap.',
    stack: 'Python · MCP · Claude Desktop',
    link: null,
  },
  {
    title: 'AI Job Application Agent',
    status: 'IN BUILD',
    desc: 'Agentic job-search assistant that automates parts of the application workflow, with a multi-agent LangGraph/CrewAI backend and a React + Express interface.',
    stack: 'LangGraph · CrewAI · React · Express · Gemini API',
    link: null,
  },
  {
    title: 'RAG-Based AI Teaching Assistant',
    status: 'PROJECT',
    desc: 'Retrieval-augmented generation system that grounds answers in real course material rather than the model’s raw parametric memory — an end-to-end pipeline turning educational video into audio, transcription, then vector embeddings.',
    stack: 'RAG · Embeddings · Vector Search',
    link: null,
  },
  {
    title: 'NLP Job Recommender',
    status: 'PROJECT',
    desc: 'spaCy-based matching engine that recommends job postings using semantic similarity between resumes and job descriptions, extracting skills and experience via NLP and regex and matching against listings from the JSearch API.',
    stack: 'Python · spaCy · NLP · JSearch API',
    link: null,
  },
  {
    title: 'Chhattisgarh NHM Health Scorecard',
    status: 'DATA REPORT',
    desc: 'Analysis of the state’s district-level “Swasthyank” health scorecard data, delivered as an interactive dashboard plus a formal report for government review.',
    stack: 'Data Analysis · Dashboarding',
    link: null,
  },
  {
    title: 'EarthDoc',
    status: 'PILOT PROPOSAL',
    desc: 'Blockchain-based document verification platform originally built for IIT Mandi, later extended with a tiered revenue model and a formal pilot proposal.',
    stack: 'Blockchain · Document Verification',
    link: null,
  },
  {
    title: 'Embedded Robotics — ESP32 & Arduino',
    status: 'HARDWARE PROJECT',
    desc: 'A wheeled robot on ESP32 + L298N, plus Arduino-based wall-following and ultrasonic obstacle-avoidance builds, each with full wiring and pin-allocation plans.',
    stack: 'ESP32 · Arduino · L298N',
    link: null,
  },
  {
    // TODO: the spec lists six projects on this page but only five status tags —
    // this one has no status tag in the source document. Confirm the right label.
    title: 'Video Conferencing App',
    status: 'PROJECT',
    desc: 'A browser-based video conferencing application.',
    stack: 'WebRTC · Web',
    link: null,
  },
];

function ProjectCard({ p }: { p: Project }) {
  const cardRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Until a real link exists, the card's job is to reveal its stack line. That
  // keeps the click honest — it does something, rather than miming a link.
  const toggle = (e: MouseEvent<HTMLElement>) => {
    inkRipple(e);
    bladeCut(cardRef.current);

    const el = detailRef.current;
    const next = !open;
    setOpen(next);
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.height = next ? 'auto' : '0px';
      return;
    }
    gsap.to(el, { height: next ? 'auto' : 0, duration: 0.42, ease: 'power2.out' });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const r = cardRef.current?.getBoundingClientRect();
    toggle({
      currentTarget: cardRef.current,
      clientX: (r?.left ?? 0) + (r?.width ?? 0) / 2,
      clientY: (r?.top ?? 0) + (r?.height ?? 0) / 2,
    } as unknown as MouseEvent<HTMLElement>);
  };

  const body = (
    <>
      <span className="project-status">{p.status}</span>
      <h3>{p.title}</h3>
      <p>{p.desc}</p>
      <div ref={detailRef} className="project-detail">
        <p className="project-stack">{p.stack}</p>
      </div>
      <span className="project-toggle">
        <span className="mark" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
        {open ? 'HIDE STACK' : 'VIEW STACK'}
      </span>
    </>
  );

  // Render a real anchor only once a link actually exists — an href="#" card
  // would look interactive and go nowhere.
  if (p.link) {
    return (
      <a href={p.link} target="_blank" rel="noreferrer" className="project-card has-ink">
        {body}
      </a>
    );
  }

  return (
    <article
      ref={cardRef}
      className="project-card has-ink"
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      {body}
    </article>
  );
}

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const setActive = useSectionStore((s) => s.setActive);
  const setProjectsProgress = useSectionStore((s) => s.setProjectsProgress);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive('projects'),
        onEnterBack: () => setActive('projects'),
      });

      // drives the katana's scroll-scrubbed slide-in in Scene.tsx
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => setProjectsProgress(self.progress),
      });

      // One gold cut sweeps across the grid, and the cards unroll behind it.
      gsap.fromTo(
        '.grid-slash',
        { scaleX: 0, opacity: 1, rotation: -6, transformOrigin: 'left center' },
        {
          scaleX: 1,
          rotation: -6,
          duration: 0.7,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 65%', once: true },
          onComplete() {
            gsap.to('.grid-slash', { opacity: 0, duration: 0.5, ease: 'power2.out' });
          },
        }
      );

      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        gsap.fromTo(
          card,
          { clipPath: 'inset(0 0 100% 0)', y: 24 }, // rolled shut, like a closed scroll
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 1,
            ease: 'power2.out',
            // GSAP leaves an inline `transform` behind, which would outrank the
            // CSS :hover lift and quietly kill it once a card has revealed.
            clearProps: 'transform',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          }
        );
      });
    }, el);
    return () => ctx.revert();
  }, [setActive, setProjectsProgress]);

  return (
    <section ref={ref} id="projects" className="section projects">
      <SectionMark char="業" />
      <p className="eyebrow">{'// 03 — THE WORK'}</p>
      <h2 className="section-title">Projects</h2>
      <div className="project-grid">
        <span className="grid-slash" aria-hidden="true" />
        {projects.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>
    </section>
  );
}
