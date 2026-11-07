import type { MetadataRoute } from "next";
import { featuredProjects } from "@/content/projects";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...featuredProjects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
