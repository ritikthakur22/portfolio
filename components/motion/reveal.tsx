"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MOTION_OK, registerGsap, whenIdle } from "@/lib/motion";

export function Reveal({ y = 32, delay = 0, className, children, ...rest }: { y?: number; delay?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    const mm = gsap.matchMedia();
    const setup = () =>
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, { y, opacity: 0, duration: 0.9, delay, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 88%" } });
      });
    // content already on screen animates now; content further down waits for idle
    const below = ref.current!.getBoundingClientRect().top > window.innerHeight;
    const cancel = below ? whenIdle(setup) : (setup(), () => {});
    return () => {
      cancel();
      mm.revert();
    };
  });

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
