'use client';

/**
 * The portfolio spec's site map (§4) ends on a footer; the starter kit had none,
 * so the page previously just stopped at the contact seals. No year: a
 * client-rendered `getFullYear()` would drift from the prerendered HTML and
 * trip a hydration mismatch every January.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-id">
        <p className="footer-name">Sudhang Sahu</p>
        <p className="footer-role">
          Data Engineer &amp; ML Systems Builder · Raipur, Chhattisgarh, India
        </p>
      </div>

      <p className="footer-built">
        Next.js · React Three Fiber · GSAP · zustand
      </p>

      <div className="footer-end">
        <p className="footer-copy">© Sudhang Sahu</p>
        <a className="footer-top" href="#hero">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
