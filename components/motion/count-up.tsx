"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MOTION_OK, registerGsap } from "@/lib/motion";

/** Renders the final number on the server; counts up from 0 when scrolled into view. */
export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const v = { n: 0 };
      gsap.to(v, {
        n: to,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
        onUpdate: () => void (ref.current!.textContent = String(Math.round(v.n))),
      });
    });
    return () => mm.revert();
  });

  return <span ref={ref}>{to}</span>;
}
