"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MOTION_OK, registerGsap } from "@/lib/motion";

/** Children marked data-cell pop in as a wave across the grid when scrolled into view. */
export function Ripple({ children, className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const gsap = registerGsap();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-cell]", {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "back.out(2)",
          stagger: { each: 0.002, from: "start" },
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
