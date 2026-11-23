import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/case-studies";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  const paths = ["/", ...caseStudies.map(({ id }) => `/work/${id}`)];
  return paths.map((path) => ({ url: new URL(path, siteUrl).href }));
}
