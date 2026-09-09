'use client';

import { create } from 'zustand';

export type Section = 'hero' | 'about' | 'projects' | 'experience' | 'skills' | 'contact';

interface SectionState {
  /** Which section is centered in the viewport — changes rarely, safe to use reactively. */
  active: Section;
  /** 0 -> 1 scroll progress through each section. Read via getState() inside useFrame, not the hook. */
  heroProgress: number;
  aboutProgress: number;
  projectsProgress: number;
  experienceProgress: number;
  skillsProgress: number;
  contactProgress: number;
  setActive: (section: Section) => void;
  setHeroProgress: (progress: number) => void;
  setAboutProgress: (progress: number) => void;
  setProjectsProgress: (progress: number) => void;
  setExperienceProgress: (progress: number) => void;
  setSkillsProgress: (progress: number) => void;
  setContactProgress: (progress: number) => void;
}

export const useSectionStore = create<SectionState>((set) => ({
  active: 'hero',
  heroProgress: 0,
  aboutProgress: 0,
  projectsProgress: 0,
  experienceProgress: 0,
  skillsProgress: 0,
  contactProgress: 0,
  setActive: (active) => set({ active }),
  setHeroProgress: (heroProgress) => set({ heroProgress }),
  setAboutProgress: (aboutProgress) => set({ aboutProgress }),
  setProjectsProgress: (projectsProgress) => set({ projectsProgress }),
  setExperienceProgress: (experienceProgress) => set({ experienceProgress }),
  setSkillsProgress: (skillsProgress) => set({ skillsProgress }),
  setContactProgress: (contactProgress) => set({ contactProgress }),
}));
