"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersReducedMotion, registerGsap, ScrollTrigger, whenIdle } from "@/lib/motion";

export function SmoothScroll() {
  const lenis = useRef<Lenis | undefined>(undefined);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = registerGsap();
    // keep one reference so cleanup removes the same callback it added
    const tick = (time: number) => lenis.current?.raf(time * 1000);
    const cancel = whenIdle(() => {
      lenis.current = new Lenis({ anchors: true });
      lenis.current.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });
    return () => {
      cancel();
      gsap.ticker.remove(tick);
      lenis.current?.destroy();
      lenis.current = undefined;
    };
  }, []);

  // a glide still running from the previous page would otherwise carry on down the new one
  useEffect(() => {
    if (first.current) return void (first.current = false);
    if (location.hash) return;
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
