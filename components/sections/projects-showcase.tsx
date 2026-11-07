import Image from "next/image";
import Link from "next/link";
import { PinnedHorizontal } from "@/components/motion/pinned-horizontal";
import { Tilt } from "@/components/motion/tilt";
import { featuredProjects } from "@/content/projects";
import { SectionHeading } from "./section-heading";

export function ProjectsShowcase() {
  return (
    <section id="work" className="scroll-mt-20 py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading intro="Five apps I designed, built and released, three of them on Google Play.">Things I&apos;ve shipped.</SectionHeading>
      </div>
      <PinnedHorizontal>
        {featuredProjects.map((p) => (
          <Tilt key={p.slug} className="w-full shrink-0 rounded-[28px] border border-border bg-surface md:w-[min(78vw,980px)]">
            <Link href={`/projects/${p.slug}`} className="grid h-full gap-8 overflow-hidden rounded-[28px] p-7 sm:p-10 md:grid-cols-[1.25fr_1fr] md:items-center">
              <div className="relative z-20">
                <p className="text-sm text-muted">{p.platforms.join(", ")}</p>
                <h3 className="mt-3 font-display text-[clamp(40px,5vw,72px)] leading-none font-extrabold tracking-[-0.03em]">{p.name}</h3>
                <p className="mt-3 text-lg text-accent">{p.tagline}</p>
                <p className="mt-4 max-w-md leading-relaxed text-muted">{p.summary}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-xs">
                      {s}
                    </li>
                  ))}
                </ul>
                <span className="mt-8 inline-block border-b border-accent pb-0.5 font-medium">Read the case study</span>
              </div>
              <div className="relative mx-auto aspect-[9/16] w-48 overflow-hidden rounded-[28px] border-8 border-surface-2 bg-surface-2 sm:w-56">
                <Image src={p.image} alt={`${p.name} screenshot`} fill sizes="224px" className="object-cover object-top" />
              </div>
            </Link>
          </Tilt>
        ))}
      </PinnedHorizontal>
    </section>
  );
}
