'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import BladeProgress from '@/components/canvas/BladeProgress';
import SideNav from '@/components/SideNav';
import StageLoader from '@/components/canvas/StageLoader';

// WebGL can't render on the server — importing Scene without `dynamic` +
// `ssr: false` will crash the Next.js server build.
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });

export default function Home() {
  return (
    <>
      <StageLoader />
      <div className="canvas-layer">
        <Scene />
      </div>

      {/* Tategaki wordmark — vertical setting is the traditional orientation for
          Japanese, and reads as craft rather than decoration. Purely visual: the
          name itself is in the hero and the footer. */}
      <span className="site-mark" lang="ja" aria-hidden="true">
        デジタル浪人
      </span>

      <SideNav />
      <BladeProgress />

      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>

      {/* Outside <main> so it resolves as the `contentinfo` landmark — a
          <footer> nested in <main> gets no landmark role at all. */}
      <Footer />
    </>
  );
}
