'use client';

import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

/**
 * Preloader for the 3D stage. The models are ~6.7MB of Draco-compressed glTF,
 * and until they arrive the canvas is simply empty — the hero reads as broken
 * rather than loading.
 *
 * drei's `useProgress` reads from a store fed by THREE.DefaultLoadingManager,
 * so it works *outside* <Canvas> (this is how drei's own <Loader/> is used).
 */
export default function StageLoader() {
  const { active, progress } = useProgress();
  const [gone, setGone] = useState(false);
  const finished = !active && progress >= 100;

  useEffect(() => {
    if (!finished) return;
    const t = setTimeout(() => setGone(true), 600); // let the fade play out
    return () => clearTimeout(t);
  }, [finished]);

  // Safety net: if nothing ever registers with the loading manager (a cached
  // page, a failed fetch), don't trap the visitor behind a 0% overlay forever.
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 9000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      className={`stage-loader${finished ? ' is-done' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading the stage, ${Math.round(progress)} percent`}
    >
      <span className="stage-loader-kanji" aria-hidden="true">
        刀
      </span>
      <span className="stage-loader-bar" aria-hidden="true">
        <i style={{ width: `${progress}%` }} />
      </span>
      <span className="stage-loader-meta" aria-hidden="true">
        <em>DRAWING THE BLADE</em>
        <b>{String(Math.round(progress)).padStart(3, '0')}%</b>
      </span>
    </div>
  );
}
