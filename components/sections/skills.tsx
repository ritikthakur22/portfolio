import { Reveal } from "@/components/motion/reveal";
import { TechIcon } from "@/components/ui/tech-icon";
import { profile } from "@/content/profile";
import { SectionHeading } from "./section-heading";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 px-4 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading intro="What I reach for day to day, grouped the way I use it.">Tools of the trade.</SectionHeading>
        <Reveal className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {profile.skills.map((g) => (
            <div key={g.name}>
              <h3 className="border-b border-border pb-3 font-display text-lg font-bold">{g.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    <TechIcon name={item} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
