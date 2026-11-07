import { CountUp } from "@/components/motion/count-up";
import { CursorGlow } from "@/components/motion/cursor-glow";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { ScrollFade } from "@/components/motion/scroll-fade";
import { SplitReveal } from "@/components/motion/split-reveal";
import { ResumeLink } from "@/components/ui/resume-link";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-svh flex-col justify-center px-4 pt-28 pb-16 sm:px-8">
      <CursorGlow />
      <div className="relative mx-auto w-full max-w-7xl">
        <p className="mb-8 inline-flex items-center gap-3 text-sm text-muted">
          <span className="size-2 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)]" aria-hidden />
          {profile.availability}
        </p>
        <ScrollFade>
          <SplitReveal
            as="h1"
            trigger="mount"
            onceKey="intro-seen"
            className="font-display text-[clamp(56px,13vw,200px)] leading-[0.88] font-extrabold tracking-[-0.045em] uppercase"
          >
            <span className="sr-only">{profile.name}, </span>
            <span className="block">Software</span>
            <span className="block text-accent">Developer</span>
          </SplitReveal>
        </ScrollFade>
        <Reveal delay={0.4}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            I&apos;m {profile.name}. I build and ship <span className="text-text">web, Android and cross-platform apps</span>, from React
            frontends and FastAPI or NestJS backends to apps live on <span className="text-text">Google Play</span>.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a href="#work" className="inline-block rounded-full bg-accent px-7 py-3.5 font-medium text-accent-ink">
                View my work
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.resumePath} download className="inline-block rounded-full border border-border bg-surface px-7 py-3.5 font-medium">
                Download resume
              </a>
            </Magnetic>
          </div>
          <ResumeLink className="mt-4 text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent" />
          <dl className="mt-16 flex flex-wrap gap-x-12 gap-y-6">
            {profile.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="font-display text-4xl font-bold tracking-tight">{Number(s.value) < 100 ? <CountUp to={Number(s.value)} /> : s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
