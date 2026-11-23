"use client";

import { useEffect, useRef } from "react";
import { getImageProps } from "next/image";
import styles from "./EngineeringHero.module.css";

const portraitQuery = "(max-aspect-ratio: 3/4)";
const { props: skyImage } = getImageProps({
  src: "/scenes/atelier-sky.webp", alt: "", width: 1920, height: 1080,
  unoptimized: true, loading: "eager", fetchPriority: "high",
});
const { props: benchImage } = getImageProps({
  src: "/scenes/atelier-bench.webp", alt: "", width: 1920, height: 1080,
  unoptimized: true, loading: "eager", fetchPriority: "low",
});

// Coordinates in the source photographs, before object-fit crops the image.
const axis = {
  landscape: { x: 1138 / 1672, y: 318 / 941, objectX: 0.58, objectY: 0.5 },
  portrait: { x: 360 / 920, y: 982 / 1635, objectX: 0.52, objectY: 0.55 },
};
const clamp = (value: number) => Math.max(0, Math.min(1, value));
function ramp(from: number, to: number, value: number) {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}

function Arrow({ down = false }: { down?: boolean }) {
  return <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {down ? <path d="M10 3v13m-5-5 5 5 5-5"/> : <path d="M4 10h12m-5-5 5 5-5 5"/>}
  </svg>;
}

export default function EngineeringHero() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const photograph = useRef<HTMLImageElement>(null);
  const macro = useRef<HTMLImageElement>(null);
  const actions = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current, stage = frame.current;
    const art = photograph.current, bench = macro.current, links = actions.current;
    if (!section || !stage || !art || !bench || !links) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const portrait = window.matchMedia(portraitQuery);
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    let visible = true, raf = 0, pointerX = 0, pointerY = 0;

    function draw() {
      raf = 0;
      if (!section || !stage || !art || !bench || !links) return;
      const animated = !reduced.matches && section.dataset.sequence === "scrub";
      if (!animated) { links.inert = false; stage.dataset.shot = "sky"; return; }
      const w = stage.clientWidth, h = stage.clientHeight;
      const bounds = section.getBoundingClientRect();
      const distance = Math.max(1, bounds.height - h);
      // Keep the opening usable on a slow connection until the destination frame exists.
      const p = bench.complete && bench.naturalWidth ? clamp(-bounds.top / distance) : 0;
      const mobile = portrait.matches;
      const anchor = mobile ? axis.portrait : axis.landscape;
      const iw = art.naturalWidth || (mobile ? 900 : 1600);
      const ih = art.naturalHeight || (mobile ? 1600 : 900);
      const cover = Math.max(w / iw, h / ih);
      const x = anchor.x * iw * cover + (w - iw * cover) * anchor.objectX;
      const y = anchor.y * ih * cover + (h - ih * cover) * anchor.objectY;
      const travel = ramp(0.035, 0.76, p);
      const center = ramp(0.09, 0.61, p);
      const opening = ramp(0.32, 0.79, p);
      const exit = ramp(0.045, 0.245, p);
      const parallax = 1 - ramp(0.035, 0.23, p);
      const shiftX = (w * 0.503 - x) * center + pointerX * parallax * 4.5;
      const shiftY = (h * 0.504 - y) * center + pointerY * parallax * 3;
      const cx = x + shiftX, cy = y + shiftY;
      const radius = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * Math.pow(opening, 1.85) + opening * 3;
      const put = (key: string, value: number, units = "") => stage.style.setProperty(key, value.toFixed(3) + units);
      put("--axis-x", x, "px"); put("--axis-y", y, "px");
      put("--pan-x", shiftX, "px"); put("--pan-y", shiftY, "px");
      put("--camera-scale", 1.019 * Math.exp(travel * Math.log(mobile ? 2.91 : 3.45)));
      put("--camera-roll", -travel * 2.35, "deg");
      put("--iris-x", cx, "px"); put("--iris-y", cy, "px"); put("--iris-radius", radius, "px");
      put("--rim-alpha", ramp(0.335, 0.415, p) * (1 - ramp(0.65, 0.79, p)) * 0.75);
      put("--copy-alpha", 1 - exit); put("--copy-rise", -exit * 34, "px");
      put("--veil-alpha", 1 - ramp(0.10, 0.37, p));
      // The second photograph starts with the artisan's adjustment point exactly
      // inside the opening, then pulls back to the full hand and engraved disc.
      const inspection = ramp(0.47, 0.91, p);
      const bw = bench.naturalWidth || 1672, bh = bench.naturalHeight || 941;
      const benchFit = Math.max(w / bw, h / bh);
      const plateW = bw * benchFit, plateH = bh * benchFit;
      const finalX = plateW * 0.671 + (w - plateW) * (mobile ? 0.64 : 0.62);
      const finalY = plateH * 0.385 + (h - plateH) * (mobile ? 0.5 : 0.52);
      const benchScale = 1.42 - inspection * 0.397;
      const benchX = cx + (finalX - cx) * inspection - plateW * benchScale * 0.671;
      const benchY = cy + (finalY - cy) * inspection - plateH * benchScale * 0.385;
      put("--bench-width", plateW, "px"); put("--bench-height", plateH, "px");
      put("--bench-left", Math.max(w - plateW * benchScale, Math.min(0, benchX)), "px");
      put("--bench-top", Math.max(h - plateH * benchScale, Math.min(0, benchY)), "px");
      put("--bench-scale", benchScale);
      const note = ramp(0.69, 0.90, p);
      put("--note-alpha", note); put("--note-rise", (1 - note) * 18, "px");
      put("--progress", Math.max(0.065, p));
      stage.dataset.shot = p > 0.64 ? "bench" : "sky";
      links.inert = exit > 0.97;
    }
    function schedule() { if (visible && !document.hidden && !raf) raf = requestAnimationFrame(draw); }
    function configure() {
      if (!section || !links || !bench) return;
      const missingBench = bench.complete && Boolean(bench.currentSrc) && !bench.naturalWidth;
      section.dataset.sequence = missingBench ? "opening" : reduced.matches ? "still" : "scrub";
      links.inert = false;
      draw();
    }
    function point(event: PointerEvent) {
      if (!hover.matches || reduced.matches || !stage) return;
      const b = stage.getBoundingClientRect();
      pointerX = clamp((event.clientX - b.left) / b.width) * 2 - 1;
      pointerY = clamp((event.clientY - b.top) / b.height) * 2 - 1;
      schedule();
    }
    function leave() { pointerX = pointerY = 0; schedule(); }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); });
    const resize = new ResizeObserver(schedule);
    observer.observe(section); resize.observe(stage);
    configure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    stage.addEventListener("pointermove", point, { passive: true });
    stage.addEventListener("pointerleave", leave);
    portrait.addEventListener("change", schedule); reduced.addEventListener("change", configure);
    art.addEventListener("load", schedule); bench.addEventListener("load", configure); bench.addEventListener("error", configure);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      stage.removeEventListener("pointermove", point); stage.removeEventListener("pointerleave", leave);
      portrait.removeEventListener("change", schedule); reduced.removeEventListener("change", configure);
      art.removeEventListener("load", schedule); bench.removeEventListener("load", configure); bench.removeEventListener("error", configure);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, []);

  return (
    <section ref={root} id="hero" className={styles.sequence} aria-labelledby="atelier-title">
      <div ref={frame} className={styles.frame}>
        <div className={styles.opening}>
          <div className={styles.sky} role="img" aria-label="An artisan in an ivory robe works on a brass armillary sphere above the clouds.">
            <picture>
              <source media={portraitQuery} srcSet="/scenes/atelier-sky-mobile.webp" />
              <img {...skyImage} alt="" ref={photograph} className={styles.photo} />
            </picture>
          </div>
          <div className={styles.veil} aria-hidden="true" />
          <div className={styles.intro}>
            <p className={styles.byline}><span>Sudhang Sahu</span><i aria-hidden="true" />Software &amp; data engineer</p>
            <h1 id="atelier-title">The art of<br /><em>engineering.</em></h1>
            <div className={styles.actions} ref={actions}>
              <a className={styles.primary} href="#work">Selected work <Arrow /></a>
              <a className={styles.resume} href="/Sudhang_Sahu_Resume.pdf" download>Résumé
                <svg viewBox="0 0 18 18" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 2v8.4M5.7 7.2 9 10.5l3.3-3.3M3 12v2.6h12V12"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className={styles.workbench}>
          <picture className={styles.benchCamera}><img {...benchImage} alt="" ref={macro} className={styles.benchPhoto} /></picture>
          <div className={styles.benchShade} aria-hidden="true" />
          <div className={styles.note}>
            <p className={styles.location}><i aria-hidden="true" />Berbera, Somaliland</p>
            <h2>Reading a terminal<br /><em>in real time.</em></h2>
            <p className={styles.caption}>At Gazpro, I built data pipelines that turned live industrial readings into dashboards for terminal operators.</p>
          </div>
        </div>
        <div className={styles.irisRim} aria-hidden="true" />
        <div className={styles.footer}>
          <span className={styles.chapter} aria-hidden="true">
            <span className={styles.chapterNumber}><span>01</span><span>02</span></span>
            <span className={styles.chapterRule}><i /></span>
            <span className={styles.chapterName}><span>The atelier</span><span>The workbench</span></span>
          </span>
          <a className={styles.scroll} href="#studio"><span>Explore the studio</span><i><Arrow down /></i></a>
        </div>
      </div>
    </section>
  );
}
