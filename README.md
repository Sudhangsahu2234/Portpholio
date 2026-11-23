# Sudhang Sahu — Engineering Portfolio

A Next.js 16 App Router and TypeScript portfolio for Sudhang Sahu. Native scrolling takes visitors from a Renaissance astronomer’s sky into a workbench. An interactive Three.js armillary sphere illustrates his industrial data work, followed by three illustrated case studies, professional experience, and contact details.

[Watch the portfolio walkthrough](preview/Portfolio-Tour.mp4).

## Local development

Use Node.js 22 or 24 and npm. In the project directory, run:

```sh
npm ci
npm run dev
```

Open the local URL shown in the terminal (normally `http://localhost:3000`).

## Production

```sh
npm run lint
npm run build
npm start
```

For Vercel, import the project directory and use the Next.js preset. Set `NEXT_PUBLIC_SITE_URL` to the full public origin if using a custom domain. The app also supports Vercel's production domain environment variable for canonical URLs and the sitemap.

## Content

- `data/profile.json` contains experience, education, skills, contact details and project links. Add a Vercel deployment in the relevant project's `link` field to display its live-demo link. Use `null` while a deployment is pending.
- `lib/case-studies.ts` contains the editorial notes for each featured project, keyed by its ID. Matching entries appear in the project gallery and at `/work/[slug]`.
- `components/EngineeringHero.tsx` controls the opening camera movement and lettering. Original landscape and portrait artwork and the project covers live in `public/scenes`.
- `public/Sudhang_Sahu_Resume.pdf` is the downloadable résumé.
- `lib/armillary.ts` defines the 3D brass instrument. The same camera pose is available in `public/scenes/armillary-study.webp` for browsers without WebGL.
