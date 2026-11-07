"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MOTION_OK, registerGsap, SplitText } from "@/lib/motion";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  type?: "chars" | "words" | "lines";
  /** "mount" plays immediately (hero); "scroll" plays when 85% into view. */
  trigger?: "mount" | "scroll";
  delay?: number;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export function SplitReveal({ as: Tag = "h2", type = "chars", trigger = "scroll", delay = 0, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const gsap = registerGsap();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current!, { type: type === "lines" ? "lines" : `words,${type}`, mask: type === "lines" ? "lines" : "words" });
        const targets = type === "chars" ? split.chars : type === "words" ? split.words : split.lines;
        gsap.from(targets, {
          yPercent: 110,
          rotate: type === "chars" ? 6 : 0,
          opacity: 0,
          duration: 1.1,
          stagger: type === "chars" ? 0.03 : 0.08,
          ease: "expo.out",
          delay,
          scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: "top 85%" } : undefined,
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className} {...rest}>
      {children}
    </Tag>
  );
}
