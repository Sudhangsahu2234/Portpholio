/* eslint-disable @next/next/no-html-link-for-pages -- Cross-page fragments use native navigation so the browser restores the portfolio section. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { ProjectArtwork } from "@/components/WorkIndex";
import { caseStudies } from "@/lib/case-studies";
import { profile } from "@/lib/profile";
import { siteUrl } from "@/lib/site-url";
import styles from "./case-study.module.css";

type StudyProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.id }));
}

function studyBySlug(slug: string) {
  const study = caseStudies.find((project) => project.id === slug);
  if (!study) notFound();
  return study;
}

export async function generateMetadata({ params }: StudyProps): Promise<Metadata> {
  const study = studyBySlug((await params).slug);
  const url = siteUrl ? new URL(`/work/${study.id}`, siteUrl) : undefined;
  const title = `${study.cardTitle} | ${profile.name}`;
  return {
    title: study.cardTitle,
    description: study.summary,
    alternates: url ? { canonical: url } : undefined,
    openGraph: { type: "article", title, description: study.summary, url },
    twitter: { card: "summary_large_image", title, description: study.summary },
  };
}

export default async function CaseStudyPage({ params }: StudyProps) {
  const study = studyBySlug((await params).slug);
  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/"><BrandMark />{profile.name}</Link>
          <nav aria-label="Portfolio navigation">
            <a href="/#work">Selected works</a>
            <a href="/#contact">Contact <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className={styles.main}>
        <a href="/#work" className={styles.back}><span aria-hidden="true">←</span> Back to projects</a>
        <article>
          <header className={styles.spread}>
            <div className={styles.intro}>
              <p className={styles.classification}>{study.discipline}</p>
              <h1>{study.name}</h1>
              <p className={styles.lead}>{study.summary}</p>
              <div className={styles.actions}>
                {study.link && <a className={styles.primary} href={study.link} target="_blank" rel="noreferrer">Open live project <span aria-hidden="true">↗</span></a>}
                {study.repo && <a className={study.link ? styles.secondary : styles.primary} href={study.repo} target="_blank" rel="noreferrer">View source code <span aria-hidden="true">↗</span></a>}
              </div>
            </div>
            <figure className={styles.cover}>
              <div className={styles.mount}><ProjectArtwork id={study.id} eager /></div>
              <figcaption><span>Fig. {String(index + 1).padStart(2, "0")}</span><i>{study.cardTitle}</i></figcaption>
            </figure>
          </header>
          <div className={styles.content}>
            <aside className={styles.stack} aria-label="Technologies">
              <h2>Technical stack</h2>
              <ul>{study.tech.map((tech) => <li key={tech}>{tech}</li>)}</ul>
            </aside>
            <div className={styles.story}>
              <section><h2>The problem</h2><p>{study.problem}</p></section>
              <section><h2>Implementation</h2><p>{study.approach}</p></section>
              <section><h2>Result</h2><p>{study.result}</p></section>
            </div>
          </div>
        </article>
        <footer className={styles.next}>
          <Link href={`/work/${next.id}`}>
            <span><small>Next case study</small><strong>{next.cardTitle}</strong></span>
            <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </main>
    </div>
  );
}
