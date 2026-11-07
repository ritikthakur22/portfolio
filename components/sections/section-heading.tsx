import { SplitReveal } from "@/components/motion/split-reveal";

export function SectionHeading({ children, intro }: { children: React.ReactNode; intro?: string }) {
  return (
    <div className="mb-12 max-w-3xl">
      <SplitReveal as="h2" type="words" className="font-display text-[clamp(36px,5.5vw,72px)] leading-[0.95] font-extrabold tracking-[-0.03em]">
        {children}
      </SplitReveal>
      {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
