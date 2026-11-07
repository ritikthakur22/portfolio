import { HoverPreview } from "@/components/motion/hover-preview";
import { moreProjects } from "@/content/projects";
import { SectionHeading } from "./section-heading";

export function MoreProjects() {
  const items = moreProjects.map((p) => ({
    label: p.name,
    meta: p.stack.slice(0, 3).join(", "),
    image: p.image,
    href: p.links[0].href,
  }));
  return (
    <section id="more" className="scroll-mt-20 px-4 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading intro="Smaller builds, experiments and coursework that turned into real tools.">More things I&apos;ve built.</SectionHeading>
        <HoverPreview items={items} />
      </div>
    </section>
  );
}
