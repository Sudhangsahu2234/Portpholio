'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

export default function BladeProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.body.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        if (fillRef.current) {
          fillRef.current.style.height = `${self.progress * 100}%`;
        }
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div className="blade-progress" aria-hidden="true">
      <div className="blade-track" />
      <div ref={fillRef} className="blade-fill" />
    </div>
  );
}
