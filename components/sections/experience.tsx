import { StackCards } from "@/components/motion/stack-cards";
import { profile } from "@/content/profile";
import type { Role } from "@/content/types";
import { SectionHeading } from "./section-heading";

function RoleCard({ role, kind }: { role: Role; kind: string }) {
  return (
    <article className="rounded-3xl border border-border bg-surface p-7 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] sm:p-10">
      <p className="font-mono text-xs text-accent">
        {kind}, {role.period}
      </p>
      <h3 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">{role.title}</h3>
      <p className="mt-1 text-muted">{role.org}</p>
      <ul className="mt-6 space-y-2 leading-relaxed text-muted">
        {role.points.map((p) => (
          <li key={p} className="flex gap-3">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            {p}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 px-4 py-28 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading intro="Professional work first, then the degree I'm finishing alongside it.">Where I&apos;ve worked and studied.</SectionHeading>
        <StackCards>
          {profile.experience.map((r) => (
            <RoleCard key={r.title} role={r} kind="Work" />
          ))}
          {profile.education.map((r) => (
            <RoleCard key={r.title} role={r} kind="Education" />
          ))}
        </StackCards>
      </div>
    </section>
  );
}
