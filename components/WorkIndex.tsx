import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/lib/case-studies";
import { profile } from "@/lib/profile";
import styles from "./work-index.module.css";

const covers: Record<string, string> = {
  "medical-report-analyser": "/scenes/folio-medical.webp",
  "job-recommender": "/scenes/folio-roles.webp",
  "rag-teaching-assistant": "/scenes/folio-teacher.webp",
};

function ExternalArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none">
      <path d="m3.5 12.5 9-9M4 3.5h8.5V12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ProjectArtwork({ id, eager = false }: { id: string; eager?: boolean }) {
  const src = covers[id];
  if (!src) return null;
  return (
    <div className={styles.art} data-project={id} aria-hidden="true">
      <Image src={src} alt="" fill unoptimized loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        sizes={eager ? "(max-width: 760px) 100vw, 52vw" : "(max-width: 680px) 100vw, 33vw"} />
    </div>
  );
}

export default function WorkIndex() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-heading">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="work-heading">Selected <em>works.</em></h2>
          <span className={styles.register}>{String(caseStudies.length).padStart(2, "0")} case studies</span>
        </header>

        <ul className={styles.gallery}>
          {caseStudies.map((project, index) => (
            <li className={styles.entry} key={project.id}>
              <article className={styles.plate}>
                <div className={styles.picture}>
                  <ProjectArtwork id={project.id} />
                </div>
                <div className={styles.folioCaption}>
                  <span>Fig. {String(index + 1).padStart(2, "0")}</span>
                  <span>{project.discipline}</span>
                </div>
                <h3>{project.cardTitle}</h3>
                <p className={styles.summary}>{project.summary}</p>
                <ul className={styles.tools} aria-label={`Technologies used in ${project.cardTitle}`}>
                  {project.tech.map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
                <div className={styles.links}>
                  <Link className={styles.read} href={`/work/${project.id}`} aria-label={`Read the ${project.cardTitle} case study`}>Case study <span aria-hidden="true">→</span></Link>
                  <span className={styles.resources}>
                    {project.link && <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.cardTitle} live demo`}>Live demo <ExternalArrow /></a>}
                    {project.repo && <a href={project.repo} target="_blank" rel="noreferrer" aria-label={`View ${project.cardTitle} source on GitHub`}>Source <ExternalArrow /></a>}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <details className={styles.archive}>
          <summary><span>Project archive <small>({String(profile.githubProjects.length).padStart(2, "0")})</small></span><i aria-hidden="true" /></summary>
          <ul>
            {profile.githubProjects.map((project) => (
              <li key={project.repo}>
                <h3>{project.name}</h3>
                <span className={styles.language}>{project.language}</span>
                <div>
                  {project.link && <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live`}>Live demo <ExternalArrow /></a>}
                  <a href={project.repo} target="_blank" rel="noreferrer" aria-label={`View ${project.name} source code`}>Source <ExternalArrow /></a>
                </div>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
