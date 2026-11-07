import { DotGrid } from "@/components/motion/dot-grid";
import { SplitReveal } from "@/components/motion/split-reveal";
import { profile } from "@/content/profile";

export function ContactSection({ children }: { children?: React.ReactNode }) {
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden px-4 py-32 sm:px-8">
      <DotGrid />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
        <div>
          <SplitReveal as="h2" type="words" className="font-display text-[clamp(44px,7vw,104px)] leading-[0.9] font-extrabold tracking-[-0.04em]">
            Let&apos;s build something.
          </SplitReveal>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Have a project, a role or a question? Send a message and I&apos;ll reply within 48 hours, or email me directly.
          </p>
          <a href={`mailto:${profile.email}`} className="mt-8 inline-block font-display text-2xl font-bold underline decoration-accent underline-offset-8 sm:text-3xl">
            {profile.email}
          </a>
          <ul className="mt-8 flex gap-6 text-muted">
            {profile.socials
              .filter((s) => s.label !== "Email")
              .map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-accent">
                    {s.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
