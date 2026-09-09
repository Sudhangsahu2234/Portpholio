# The Digital Ronin — starter kit

A working pattern for a persistent-canvas, scroll-synced 3D portfolio in Next.js
(App Router) + React Three Fiber + GSAP ScrollTrigger. Drop these files into your
existing project at the matching paths and wire up the pieces flagged below.

## Design tokens used throughout

- **Ink** `#0b0e14` (base) / **Paper** `#e8e1d3` (text)
- **Lacquer red** `#a6323a` — tradition accent
- **Neon cyan** `#3fe0c8` — tech accent
- The two accents are deliberately in tension: old-world lacquer vs. synthetic
  neon, standing in for "samurai vs. cyberpunk."
- Display face: Shippori Mincho B1 (brush-serif headlines). Mono: JetBrains
  Mono (eyebrows, timestamps, HUD-style labels). Body: Manrope.
- **Signature element**: `BladeProgress` — a vertical blade-shaped scroll bar
  fixed to the right edge that fills with neon glow as the page scrolls,
  standing in for a katana slowly being drawn. It's the one place we spend the
  "boldness budget" — everything else stays quiet.

## Install

```bash
npm install three @react-three/fiber @react-three/drei gsap zustand lucide-react
```

## File map

```
app/page.tsx                       assembles the page, mounts Scene client-only
components/canvas/Scene.tsx        single persistent <Canvas>, swaps model by active section
components/canvas/BladeProgress.tsx  the signature scroll indicator (no WebGL needed)
components/sections/*.tsx          Hero, About, Projects, Experience, Skills, Contact
lib/gsap.ts                        client-only GSAP + ScrollTrigger registration
lib/section-store.ts               tiny zustand store bridging GSAP scroll state -> R3F
styles/globals.css                 tokens + base styles for every section
```

## Before this runs

1. **Models**: drop your Draco-compressed `.glb` files (from the Meshy → gltf-pipeline
   pipeline) into `public/models/` as `torii-draco.glb`, `helmet-draco.glb`,
   `katana-draco.glb`. `Scene.tsx` loads them by that exact path — rename or edit
   to match what you actually export.
2. **Fonts**: `globals.css` pulls Shippori Mincho B1 and JetBrains Mono from the
   Google Fonts CSS API for simplicity. For production, switch to `next/font/google`
   so they're self-hosted and don't block on a third-party request.
3. **Placeholders to fill in `Contact.tsx`**: your real GitHub URL, LeetCode URL,
   email, and phone number are stubbed as `YOUR_USERNAME` / `you@example.com` /
   `+91XXXXXXXXXX` — swap those in.
4. **Project copy in `Projects.tsx`**: I seeded it with Digital Ronin / Love In
   Property / Medical Report Analyser as placeholders — edit titles, descriptions,
   and links to what you actually want shown.
5. **Styling approach**: this uses plain CSS (`globals.css`) rather than Tailwind
   since I didn't know which you're using. If your project is already on Tailwind,
   the class names here translate directly to utility classes — happy to convert
   the whole file if you want.

## The core pattern (why it's structured this way)

- **One `<Canvas>` for the whole page**, not one per section. Every `<Canvas>` opens
  its own WebGL context, and most mobile GPUs choke well before you hit even 3–4
  concurrent contexts. `Scene.tsx` sits in a fixed full-viewport layer behind the
  DOM content and swaps which model is visible based on which section is active —
  it never unmounts and remounts the canvas itself.
- **GSAP drives state, R3F reads it in `useFrame`.** Each section's `ScrollTrigger`
  writes into a `zustand` store (`section-store.ts`). Continuous values (like the
  torii "push-through" progress) are read with `useSectionStore.getState()` inside
  `useFrame`, not through the reactive hook — that avoids a React re-render on every
  scroll tick, which is what actually causes scroll-jank with GLTF scenes.
- **`dynamic(..., { ssr: false })`** wraps `Scene` in `page.tsx` because Next.js
  can't render WebGL on the server — trying to import `Scene` directly (without
  `dynamic`) will crash the server build.
- **`gsap.context()` + `ctx.revert()`** in every section's `useEffect` cleanup.
  Without this, Next.js fast-refresh (or route changes if you add more pages) will
  pile up duplicate `ScrollTrigger` instances and animations will double-fire.
- **`prefers-reduced-motion`** is respected in `globals.css` — scroll-behavior and
  the blade-fill transition both get disabled. Worth also gating the torii
  push-through and helmet auto-spin behind the same media query in `Scene.tsx` if
  you want to fully honor it.

## Suggested next pass

- Swap `Environment preset="night"` in `Scene.tsx` for a custom HDRI if you want
  tighter control over the neon/lacquer rim-lighting split.
- Only `useGLTF.preload()` the hero model eagerly; trigger the helmet/katana
  preload when their section's `IntersectionObserver` fires, so you're not pulling
  all three compressed `.glb` files on first load.
- Run Lighthouse on mobile once real assets are in — cap `dpr` lower than `1.75`
  in `Scene.tsx` if frame time is rough on mid-range Android GPUs.
