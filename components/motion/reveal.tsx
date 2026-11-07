"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MOTION_OK, registerGsap } from "@/lib/motion";

export function Reveal({ y = 32, delay = 0, className, children, ...rest }: { y?: number; delay?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(ref.current, { y, opacity: 0, duration: 0.9, delay, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 88%" } });
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
