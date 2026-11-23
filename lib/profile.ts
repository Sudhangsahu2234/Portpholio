import raw from "@/data/profile.json";

/**
 * Typed view over data/profile.json.
 *
 * Every string rendered anywhere on this site originates here, and every entry
 * in the JSON carries a `source` field naming the document it came from. If a
 * fact isn't in resume.pdf or linkedin.pdf, it isn't on the site.
 */

export type Experience = {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  dates: string;
  type: "research" | "industry" | "leadership" | "training";
  source: string;
  bullets: string[];
  tech: string[];
  resolved?: string;
};

export type Education = {
  id: string;
  degree: string;
  specialization: string | null;
  institution: string;
  location: string | null;
  dates: string;
  source: string;
  honors: string[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  detail: string | null;
  tech: string[];
  deployed: string | null;
  link: string | null;
  repo: string | null;
  source: string;
};

export type GithubProject = {
  name: string;
  repo: string;
  link: string | null;
  language: string;
};

export type Profile = {
  name: string;
  targetRole: string;
  headline: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    githubUsername: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Record<string, string[]>;
  projects: Project[];
  githubProjects: GithubProject[];
  certifications: { name: string; issuer: string; detail: string; date: string | null }[];
  honors: { name: string; detail: string }[];
};

export const profile = raw as unknown as Profile;

/** Timeline merges jobs and degrees into one chronological spine. */
export type TimelineEntry = {
  kind: "work" | "study";
  id: string;
  title: string;
  org: string;
  meta: string | null;
  dates: string;
  sortKey: string;
  bullets: string[];
  tech: string[];
};

export function buildTimeline(): TimelineEntry[] {
  const work: TimelineEntry[] = profile.experience.map((e) => ({
    kind: "work",
    id: e.id,
    title: e.title,
    org: e.company,
    meta: e.location,
    dates: e.dates,
    sortKey: e.start,
    bullets: e.bullets,
    tech: e.tech,
  }));

  const study: TimelineEntry[] = profile.education.map((e) => ({
    kind: "study",
    id: e.id,
    title: e.degree,
    org: e.institution,
    meta: e.specialization ?? e.location,
    dates: e.dates,
    // education entries carry human date ranges, not ISO — derive a sortable year
    sortKey: (e.dates.match(/(\d{4})/g)?.slice(-1)[0] ?? "0000") + "-01",
    bullets: e.honors,
    tech: [],
  }));

  return [...work, ...study].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}

/** Flat list used by the marquee. */
export const allSkills: string[] = Object.values(profile.skills).flat();
