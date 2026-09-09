'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import {
  Box3,
  MathUtils,
  Vector3,
  type Group,
  type Mesh,
  type Object3D,
  type PointLight,
} from 'three';
import { useSectionStore } from '@/lib/section-store';
import { prefersReducedMotion } from '@/lib/interactions';

// The supplied assets were named torii_gate.glb / katanas.glb /
// samurai_warrior_-_traditional_japanese_armor.glb and were NOT Draco-compressed.
// They have been Draco-compressed and texture-optimised into the names below.
const TORII = '/models/torii-draco.glb';
const WARRIOR = '/models/warrior-draco.glb';
const KATANA = '/models/katana-draco.glb';

useGLTF.preload(TORII);

/**
 * Stage layout, in world units. The camera sits at z=5 with a 45deg fov, so it
 * sees roughly 4.1 units of height at z=0 - a `size` of 4 fills the frame.
 * `xFactor` is a fraction of the *visible* width, so placement holds up across
 * breakpoints instead of drifting off-screen on wide monitors.
 *
 * These are the numbers to tweak if a model sits wrong. Everything else is
 * derived from each model's real bounding box at runtime (see useFitted).
 */
const STAGE = {
  torii: { size: 4.6, y: 0.1, z: -1.8, travel: 7.5 },
  warrior: { size: 3.0, y: -0.15, xFactor: 0.26 },
  blade: { size: 3.6, xFrom: -0.44, xTo: -0.37 },
  path: { size: 4.2, xFactor: 0.3, z: -3 },
  rack: { size: 3.2, xFactor: 0.29 },
  seal: { size: 3.2, xFactor: 0.28 },
};

// Sketchfab exports routinely ship an author "signature" plane alongside the
// real geometry. katanas.glb has one (Plane_Sign_0) 1.68 units across while the
// actual blades are 0.11 - left in, it swamps the bounding box and the sword
// fits to nothing.
//
// The leading boundary matters: a bare /sketchfab/ would also match the
// "Sketchfab_model" root wrapper these files use, which would delete the entire
// model rather than just the watermark.
const SIGNATURE = /(^|[_\s.-])(plane[_-]?sign|watermark|signature)/i;

// katanas.glb is really a display rack: a wooden stand (podstavLP), two blades
// and two scabbards. Fitting the whole assembly makes the stand the dominant
// shape, which reads as brown scaffolding rather than a sword - so Projects
// isolates a single blade, and Skills gets the full rack, where a stand of
// weapons is exactly the point.
const LONG_BLADE = /^Blade\.001/;

const isMesh = (o: Object3D) => (o as Mesh).isMesh === true;

type Fitted = { root: Group; scale: number; offset: [number, number, number] };
type FitOpts = { standUp?: boolean; only?: RegExp };

/**
 * Normalises any glTF to a known size, centred on its own origin.
 *
 * The starter kit hardcoded scale/position per model, which only works if the
 * assets happen to be authored at that scale. These are not: the torii is 161
 * units wide and centred 59 units above its origin, so at the original
 * `scale={1.4}` the camera sat inside the geometry and saw nothing at all.
 */
function useFitted(url: string, targetSize: number, opts: FitOpts = {}): Fitted {
  const { scene } = useGLTF(url);
  const { standUp = false, only } = opts;

  return useMemo(() => {
    const root = scene.clone(true) as Group;

    const junk: Object3D[] = [];
    let meshes = 0;
    root.traverse((o) => {
      if (!isMesh(o)) return;
      meshes += 1;
      if (SIGNATURE.test(o.name) || (only && !only.test(o.name))) junk.push(o);
    });
    // Never let the filter strip every mesh — better a watermark than a blank
    // canvas if a future model names all its parts "signature".
    if (junk.length < meshes) junk.forEach((o) => o.removeFromParent());

    if (standUp) {
      const pre = new Box3().setFromObject(root);
      const s = pre.getSize(new Vector3());
      // Bring the longest axis vertical so a blade reads as a blade.
      if (s.z > s.y && s.z > s.x) root.rotation.x = -Math.PI / 2;
      else if (s.x > s.y && s.x > s.z) root.rotation.z = Math.PI / 2;
    }

    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const scale = targetSize / (Math.max(size.x, size.y, size.z) || 1);

    return { root, scale, offset: [-center.x, -center.y, -center.z] };
  }, [scene, targetSize, standUp, only]);
}

/** Wraps a fitted model so animation transforms stay independent of the fit. */
function Fit({ fit }: { fit: Fitted }) {
  return (
    <group scale={fit.scale}>
      <group position={fit.offset}>
        <primitive object={fit.root} />
      </group>
    </group>
  );
}

/** Shrinks the whole stage on narrow viewports so models don't crowd the copy. */
function useStageScale() {
  const width = useThree((s) => s.size.width);
  return width < 768 ? 0.62 : width < 1100 ? 0.82 : 1;
}

/* ---------------------------------------------------------------- 01 hero -- */

function ToriiGate() {
  const fit = useFitted(TORII, STAGE.torii.size);
  const ref = useRef<Group>(null);
  const k = useStageScale();

  useFrame(() => {
    const p = useSectionStore.getState().heroProgress;
    const g = ref.current;
    if (!g) return;
    // Reads as the camera pushing *through* the gate as the hero scrolls away:
    // it starts behind and travels past the camera plane (z=5).
    g.position.z = STAGE.torii.z + p * STAGE.torii.travel;
    g.position.y = STAGE.torii.y - p * 0.35;
    g.rotation.y = p * 0.2;
  });

  return (
    <group ref={ref} scale={k} position={[0, STAGE.torii.y, STAGE.torii.z]}>
      <Fit fit={fit} />
    </group>
  );
}

/* --------------------------------------------------------------- 02 about -- */

// The supplied asset for this slot is a full samurai warrior figure, not just a
// helmet - the starter kit expected `helmet-draco.glb`.
function Warrior() {
  const fit = useFitted(WARRIOR, STAGE.warrior.size);
  const ref = useRef<Group>(null);
  const k = useStageScale();
  const viewport = useThree((s) => s.viewport);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const drift = useRef(0);

  useFrame((_, delta) => {
    const p = useSectionStore.getState().aboutProgress;
    const g = ref.current;
    if (!g) return;
    if (!reduced) drift.current += delta * 0.06; // accumulated, so it actually drifts
    g.rotation.y = p * Math.PI * 2 + drift.current; // full turn scrubbed by scroll
    g.position.x = viewport.width * STAGE.warrior.xFactor;
    g.position.y = STAGE.warrior.y + Math.sin(p * Math.PI) * 0.18;
  });

  return (
    <group ref={ref} scale={k} position={[0, STAGE.warrior.y, 0]}>
      <Fit fit={fit} />
    </group>
  );
}

/* ------------------------------------------------------------ 03 projects -- */

/**
 * A single drawn blade. Scroll draws it upward out of the dark and straightens
 * it, while a gold point light travels the edge on its own loop so the steel
 * always has a moving highlight — the "gleam" is real specular response, not a
 * texture trick.
 */
function Blade() {
  const fit = useFitted(KATANA, STAGE.blade.size, { standUp: true, only: LONG_BLADE });
  const ref = useRef<Group>(null);
  const gleam = useRef<PointLight>(null);
  const k = useStageScale();
  const viewport = useThree((s) => s.viewport);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useFrame((state) => {
    const p = useSectionStore.getState().projectsProgress;
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    g.position.x = viewport.width * MathUtils.lerp(STAGE.blade.xFrom, STAGE.blade.xTo, p);
    g.position.y = MathUtils.lerp(-1.5, 0.3, p); // drawn upward
    g.rotation.z = MathUtils.lerp(0.5, 0.14, p); // settles toward vertical
    g.rotation.y = reduced ? 0.4 : t * 0.18;

    if (gleam.current) {
      const travel = reduced ? 0.5 : (t * 0.4) % 1;
      gleam.current.position.set(0, MathUtils.lerp(-2, 2, travel), 0.6);
      gleam.current.intensity = 7 * Math.sin(travel * Math.PI);
    }
  });

  return (
    <group ref={ref} scale={k} position={[-3, -1.5, 0]}>
      <Fit fit={fit} />
      <pointLight ref={gleam} color="#d4af37" distance={2.2} decay={2} />
    </group>
  );
}

/* ---------------------------------------------------------- 04 experience -- */

/** The gate again, but off to one side and receding — the path already walked. */
function ToriiPath() {
  const fit = useFitted(TORII, STAGE.path.size);
  const ref = useRef<Group>(null);
  const k = useStageScale();
  const viewport = useThree((s) => s.viewport);

  useFrame(() => {
    const p = useSectionStore.getState().experienceProgress;
    const g = ref.current;
    if (!g) return;
    g.position.x = viewport.width * STAGE.path.xFactor;
    g.position.y = -0.4 + p * 0.5;
    g.position.z = STAGE.path.z + p * 1.2;
    g.rotation.y = -0.6 + p * 0.5; // swings from three-quarter toward head-on
  });

  return (
    <group ref={ref} scale={k} position={[3, -0.4, STAGE.path.z]}>
      <Fit fit={fit} />
    </group>
  );
}

/* -------------------------------------------------------------- 05 skills -- */

/** The full katana rack — stand, blades and scabbards. Literally the arsenal. */
function KatanaRack() {
  const fit = useFitted(KATANA, STAGE.rack.size);
  const ref = useRef<Group>(null);
  const k = useStageScale();
  const viewport = useThree((s) => s.viewport);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useFrame((state) => {
    const p = useSectionStore.getState().skillsProgress;
    const g = ref.current;
    if (!g) return;
    g.position.x = viewport.width * STAGE.rack.xFactor;
    g.position.y = -0.3 + Math.sin(p * Math.PI) * 0.2;
    // The rack's length runs along Z, so it points straight into the camera at
    // rest. A quarter turn lays it across the frame — a sword stand only reads
    // as one side-on. The scroll then swings it either side of that.
    g.rotation.y =
      Math.PI / 2 - 0.35 + p * 0.7 + (reduced ? 0 : state.clock.elapsedTime * 0.04);
    g.rotation.x = 0.12;
  });

  return (
    <group ref={ref} scale={k} position={[3, -0.3, 0]}>
      <Fit fit={fit} />
    </group>
  );
}

/* ------------------------------------------------------------- 06 contact -- */

/** The warrior once more, closer and turning to face you. */
function WarriorSeal() {
  const fit = useFitted(WARRIOR, STAGE.seal.size);
  const ref = useRef<Group>(null);
  const k = useStageScale();
  const viewport = useThree((s) => s.viewport);

  useFrame(() => {
    const p = useSectionStore.getState().contactProgress;
    const g = ref.current;
    if (!g) return;
    g.position.x = viewport.width * STAGE.seal.xFactor;
    g.position.y = -0.25;
    // ends square-on to the camera as the page bottoms out
    g.rotation.y = MathUtils.lerp(-0.9, 0, Math.min(p * 1.4, 1));
  });

  return (
    <group ref={ref} scale={k} position={[3, -0.25, 0]}>
      <Fit fit={fit} />
    </group>
  );
}

/* ----------------------------------------------------------------- rig ----- */

/** Faint pointer-follow so the stage never looks like a still image. */
function ParallaxRig({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g || reduced) return;
    g.rotation.y = MathUtils.damp(g.rotation.y, state.pointer.x * 0.14, 3, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, -state.pointer.y * 0.09, 3, delta);
  });

  return <group ref={ref}>{children}</group>;
}

/**
 * Lighting is built in-page from Lightformers rather than drei's
 * `<Environment preset="night" />`, which fetches an HDRI from raw.githack.com
 * at runtime. That CDN has no uptime guarantee, and a failed fetch means every
 * metallic surface renders black - which is what was happening.
 */
function Stage() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.7} color="#d4af37" />
      <directionalLight position={[-5, 2, -3]} intensity={1.2} color="#a6222b" />
      <directionalLight position={[0, -2, 4]} intensity={0.4} color="#e8e1d3" />
      <Environment resolution={128} frames={1}>
        <color attach="background" args={['#0b0e14']} />
        <Lightformer intensity={3} color="#d4af37" position={[4, 3, 2]} scale={[8, 8, 1]} />
        <Lightformer intensity={2} color="#a6222b" position={[-5, 1, -2]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.8} color="#e8e1d3" position={[0, 5, -4]} scale={[10, 3, 1]} />
      </Environment>
    </>
  );
}

export default function Scene() {
  const active = useSectionStore((s) => s.active);
  // Cap pixel ratio - uncapped DPR is a common mobile frame-rate killer, and
  // mid-range phones need a tighter cap than desktop.
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => setDpr(mq.matches ? [1, 1.25] : [1, 1.75]);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={dpr}>
      <Suspense fallback={null}>
        <Stage />
        <ParallaxRig>
          {active === 'hero' && <ToriiGate />}
          {active === 'about' && <Warrior />}
          {active === 'projects' && <Blade />}
          {active === 'experience' && <ToriiPath />}
          {active === 'skills' && <KatanaRack />}
          {active === 'contact' && <WarriorSeal />}
        </ParallaxRig>
      </Suspense>
    </Canvas>
  );
}
