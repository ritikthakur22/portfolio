"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MOTION_OK, registerGsap, ScrollTrigger, SplitText } from "@/lib/motion";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  type?: "chars" | "words" | "lines";
  /** "mount" plays immediately (hero); "scroll" plays when 85% into view. */
  trigger?: "mount" | "scroll";
  delay?: number;
  /** Play only once per browser session (sessionStorage key). */
  onceKey?: string;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export function SplitReveal({ as: Tag = "h2", type = "chars", trigger = "scroll", delay = 0, onceKey, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const gsap = registerGsap();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (onceKey) {
          try {
            if (sessionStorage.getItem(onceKey)) return;
            sessionStorage.setItem(onceKey, "1");
          } catch {}
        }
        let split: SplitText | undefined;
        const play = () => {
          const onLoad = trigger === "mount";
          // on load the text must stay visible (it is the largest paint), so it only rises and settles
          split = SplitText.create(ref.current!, {
            type: type === "lines" ? "lines" : `words,${type}`,
            mask: onLoad ? undefined : type === "lines" ? "lines" : "words",
          });
          const targets = type === "chars" ? split.chars : type === "words" ? split.words : split.lines;
          gsap.from(targets, {
            yPercent: onLoad ? 35 : 110,
            rotate: type === "chars" ? (onLoad ? 4 : 6) : 0,
            opacity: onLoad ? 1 : 0,
            duration: onLoad ? 0.8 : 1.1,
            stagger: type === "chars" ? (onLoad ? 0.02 : 0.03) : 0.08,
            ease: onLoad ? "back.out(2)" : "expo.out",
            delay,
            scrollTrigger: onLoad ? undefined : { trigger: ref.current, start: "top 85%" },
          });
        };
        // splitting is costly; for scroll reveals do it just before the element nears the screen
        if (trigger === "mount") play();
        else ScrollTrigger.create({ trigger: ref.current, start: "top bottom+=300", once: true, onEnter: play });
        return () => split?.revert();
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
