"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion, registerGsap, ScrollTrigger, whenIdle } from "@/lib/motion";

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = registerGsap();
    let lenis: Lenis | undefined;
    // keep one reference so cleanup removes the same callback it added
    const tick = (time: number) => lenis?.raf(time * 1000);
    const cancel = whenIdle(() => {
      lenis = new Lenis({ anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });
    return () => {
      cancel();
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);
  return null;
}
