import { profile } from "@/lib/profile";

type CaseNotes = {
  cardTitle: string;
  discipline: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
};

const notes: Record<string, CaseNotes> = {
  "medical-report-analyser": {
    cardTitle: "Medical Report Analyser",
    discipline: "Full-stack development",
    summary: "A web application that turns a medical report into structured findings using a language model.",
    problem: "Clinical reports combine observations, measurements and explanatory text in a single document. I wanted to turn that material into a structured view a reader could review alongside the report.",
    approach: "I connected the application to a language-model API to extract and organise the clinical information. When moving it to Vercel, I fixed issues with static file routing, environment variables and session handling.",
    result: "The deployed application returns a structured interpretation of a report. A reader can review the extracted information alongside the original clinical text.",
  },
  "job-recommender": {
    cardTitle: "AI Job Recommender",
    discipline: "Natural language processing",
    summary: "A résumé parser that matches a candidate’s skills and experience to job listings from JSearch.",
    problem: "A résumé describes skills and experience in paragraphs and bullet points. A job search needs specific terms. I built a workflow to turn the candidate’s own wording into a starting point for matching roles.",
    approach: "The engine uses spaCy and regular expressions to extract skills and experience from résumé text. It uses those details to match candidates with listings returned by the JSearch API.",
    result: "The candidate receives a set of matching job listings. The recommendations depend on the skills the parser recognises and the openings JSearch returns.",
  },
  "rag-teaching-assistant": {
    cardTitle: "RAG Teaching Assistant",
    discipline: "Retrieval systems",
    summary: "A video-to-vector pipeline that makes the spoken content of educational videos searchable.",
    problem: "Finding a concept in a recorded lecture usually means scrubbing through video. I wanted learners to be able to ask about the spoken material directly.",
    approach: "The pipeline extracts audio from educational videos and transcribes the speech. It converts the transcript into vector embeddings, giving the retrieval stage a way to find passages related to a learner’s question.",
    result: "The resulting index makes lecture content queryable. Each search works against the material captured in the transcript, so the recording and transcription determine what the assistant can retrieve.",
  },
};

export const caseStudies = profile.projects.flatMap((project) => {
  const editorial = notes[project.id];
  return editorial ? [{ ...project, ...editorial }] : [];
});
