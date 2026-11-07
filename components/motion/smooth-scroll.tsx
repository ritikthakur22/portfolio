"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = registerGsap();
    const lenis = new Lenis({ anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    // keep one reference so cleanup removes the same callback it added
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
