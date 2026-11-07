import Link from "next/link";
import { AskAiButton } from "@/components/ui/ask-ai-button";
import { LostEye } from "@/components/ui/lost-eye";
import { featuredProjects } from "@/content/projects";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col justify-center px-4 pt-28 pb-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="font-display font-extrabold tracking-[-0.05em]">
          <span className="flex items-center gap-[0.04em] text-[clamp(120px,26vw,360px)] leading-none" aria-hidden>
            4<LostEye />4
          </span>
          <span className="sr-only">404: </span>
          <span className="mt-6 block text-[clamp(32px,4.5vw,64px)] leading-tight tracking-[-0.03em]">Page not found.</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg text-muted">
          The link may be old or mistyped. Even the eye can&apos;t find it. Try one of these instead.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-accent px-7 py-3.5 font-medium text-accent-ink">
            Go to the home page
          </Link>
          <AskAiButton className="rounded-full border border-border bg-surface px-7 py-3.5 font-medium transition-colors hover:border-accent">
            Ask the AI where to go
          </AskAiButton>
        </div>
        <nav aria-label="Projects" className="mt-14">
          <p className="text-sm text-muted">Or jump to a project</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {featuredProjects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="inline-block rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
