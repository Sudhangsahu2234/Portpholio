'use client';

import { useEffect, useRef, type MouseEvent } from 'react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useSectionStore } from '@/lib/section-store';
import { hankoPress, inkRipple } from '@/lib/interactions';
import SectionMark from '@/components/sections/SectionMark';

// Email and phone appear on both the résumé and the portfolio spec (§5.7);
// the GitHub and LinkedIn URLs come from the spec. The résumé's own LinkedIn
// hyperlink is an unfilled template placeholder (linkedin.com/in/LinkedIn),
// so the spec's URL is used — worth confirming it resolves.
//
// TODO: no LeetCode (or GeeksforGeeks) profile URL exists in either source.
// The résumé only claims "300+ DSA problems solved across LeetCode and
// GeeksforGeeks" without a username, so the LeetCode tile the starter kit
// stubbed out has been left off rather than guessed at. Add it here when you
// have the URL:
//   { label: 'LeetCode', href: 'https://leetcode.com/<username>', icon: Code2 },
const links = [
  { label: 'GitHub', href: 'https://github.com/Sudhangsahu2234', icon: Github, external: true },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sudhang-sahu-633657288',
    icon: Linkedin,
    external: true,
  },
  { label: 'Email', href: 'mailto:sudhang.sahu@gmail.com', icon: Mail, external: false },
  { label: 'Phone', href: 'tel:+917869607418', icon: Phone, external: false },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const setActive = useSectionStore((s) => s.setActive);
  const setContactProgress = useSectionStore((s) => s.setContactProgress);

  // A hanko is a seal, so clicking one should feel like pressing a stamp.
  const onPress = (e: MouseEvent<HTMLAnchorElement>) => {
    inkRipple(e, 'var(--color-lacquer-bright)');
    hankoPress(e.currentTarget);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive('contact'),
        onEnterBack: () => setActive('contact'),
      });

      // drives the warrior turning to face you in Scene.tsx
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => setContactProgress(self.progress),
      });

      gsap.from('.hanko', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: { trigger: el, start: 'top 70%' },
      });
    }, el);
    return () => ctx.revert();
  }, [setActive, setContactProgress]);

  return (
    <section ref={ref} id="contact" className="section contact">
      <SectionMark char="印" />
      <p className="eyebrow">{'// 06 — REACH THE RONIN'}</p>
      <h2 className="section-title">Looking for a Data Engineering or ML role?</h2>
      <p className="contact-lede">
        I’m actively interviewing and open to product teams that want someone who can own
        the pipeline end to end — not just the model. Based in Raipur, Chhattisgarh, India.
      </p>
      <div className="hanko-grid">
        {links.map(({ label, href, icon: Icon, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="hanko has-ink"
            onClick={onPress}
          >
            <Icon size={22} strokeWidth={1.5} />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
