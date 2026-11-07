import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import Link from "next/link";
import { featuredProjects, getProject } from "@/content/projects";
import { breadcrumbJsonLd, jsonLdScript, projectJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const p = getProject((await params).slug);
  if (!p) return {};
  const title = `${p.name}: ${p.tagline}`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { type: "article", title, description: p.summary, url: `/projects/${p.slug}` },
    twitter: { card: "summary_large_image", title, description: p.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.featured) notFound();
  const i = featuredProjects.indexOf(project);
  const next = featuredProjects[(i + 1) % featuredProjects.length];

  return (
    <article className="px-4 pt-32 pb-24 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(projectJsonLd(project))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(project))} />
      <div className="mx-auto max-w-6xl">
        <Link href="/#work" className="text-sm text-muted transition-colors hover:text-accent">
          Back to work
        </Link>
        <header className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="text-muted">{project.platforms.join(", ")}</p>
            <SplitReveal as="h1" trigger="mount" className="mt-3 font-display text-[clamp(56px,10vw,150px)] leading-[0.9] font-extrabold tracking-[-0.045em]">
              {project.name}
            </SplitReveal>
            <p className="mt-4 text-xl text-accent">{project.tagline}</p>
          </div>
          <div>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs">
                  {s}
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-3">
              {project.links.map((l, k) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-block rounded-full px-5 py-2.5 text-sm font-medium ${k === 0 ? "bg-accent text-accent-ink" : "border border-border bg-surface"}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <Reveal className="mt-16 flex gap-5 overflow-x-auto pb-4" tabIndex={0} role="region" aria-label={`${project.name} screenshots`}>
          {project.images.map((src, k) => (
            <div
              key={src}
              className={`relative shrink-0 overflow-hidden rounded-3xl border border-border bg-surface ${project.slug === "fastshare" ? "aspect-[3/2] w-[min(85vw,720px)]" : "aspect-[9/19] w-56 sm:w-64"}`}
            >
              <Image src={src} alt={`${project.name} screenshot ${k + 1}`} fill sizes="(min-width: 640px) 720px, 85vw" className="object-cover object-top" priority={k === 0} />
            </div>
          ))}
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-3xl font-bold tracking-tight">About the project</h2>
          <div className="max-w-[68ch] space-y-5 text-lg leading-relaxed text-muted">
            {project.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
            {project.credit && <p className="pt-2 text-xs text-muted">{project.credit}</p>}
          </div>
        </div>

        <Link
          href={`/projects/${next.slug}`}
          className="group mt-24 block border-t border-border pt-10"
        >
          <span className="text-sm text-muted">Next project</span>
          <span className="mt-2 block font-display text-[clamp(40px,7vw,96px)] leading-none font-extrabold tracking-[-0.04em] transition-colors group-hover:text-accent">
            {next.name}
          </span>
        </Link>
      </div>
    </article>
  );
}
