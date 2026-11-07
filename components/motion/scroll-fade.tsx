"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MOTION_OK, registerGsap } from "@/lib/motion";

/** Shrinks, blurs and fades its content as the parent section scrolls away. */
export function ScrollFade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const gsap = registerGsap();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.to(ref.current, {
        scale: 0.86,
        opacity: 0.15,
        filter: "blur(6px)",
        transformOrigin: "0% 50%",
        ease: "none",
        scrollTrigger: { trigger: ref.current!.closest("section"), start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
