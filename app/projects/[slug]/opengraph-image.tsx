import { featuredProjects, getProject } from "@/content/projects";
import { ogCard, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Project by Ritik Thakur";

export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug) ?? featuredProjects[0];
  return ogCard({ eyebrow: `Project by Ritik Thakur · ${p.platforms.join(", ")}`, title: p.name, subtitle: p.tagline });
}
