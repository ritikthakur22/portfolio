import { CountUp } from "@/components/motion/count-up";
import { DotGrid } from "@/components/motion/dot-grid";
import { HoverPreview } from "@/components/motion/hover-preview";
import { Marquee } from "@/components/motion/marquee";
import { PinnedHorizontal } from "@/components/motion/pinned-horizontal";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { StackCards } from "@/components/motion/stack-cards";
import { Tilt } from "@/components/motion/tilt";

export const metadata = { robots: { index: false } };

// temporary test page for the animation components; removed in the home page task
export default function DevMotion() {
  return (
    <div className="space-y-24 pt-24">
      <SplitReveal as="h1" trigger="mount" data-testid="split-sample" className="font-display text-6xl">Split sample</SplitReveal>
      <Reveal data-testid="reveal-sample"><p>Reveal sample <CountUp to={5} /></p></Reveal>
      <Tilt data-testid="tilt-sample" className="h-40 w-60 rounded-2xl border border-border bg-surface p-6">Tilt sample</Tilt>
      <StackCards data-testid="stack-sample">
        <div className="h-60 rounded-2xl border border-border bg-surface p-6">Card one</div>
        <div className="h-60 rounded-2xl border border-border bg-surface p-6">Card two</div>
      </StackCards>
      <PinnedHorizontal data-testid="pinned-sample">
        {["A", "B", "C", "D"].map((n) => <div key={n} className="h-80 w-[60vw] shrink-0 rounded-2xl border border-border bg-surface p-6">{n}</div>)}
      </PinnedHorizontal>
      <Marquee data-testid="marquee-sample" words={["Web", "Android", "Cross-platform"]} />
      <HoverPreview data-testid="preview-sample" items={[{ label: "Todo v2", meta: "React", image: "/projects/todo/1.webp", href: "https://github.com/ritikthakur22/Todo" }]} />
      <section className="relative h-96 border border-border"><DotGrid /></section>
    </div>
  );
}
