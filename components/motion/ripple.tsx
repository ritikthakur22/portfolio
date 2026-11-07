"use client";

import { useEffect, useRef } from "react";
import { MOTION_OK } from "@/lib/motion";

/**
 * Cells marked data-cell pop in as a wave across columns (each column sets --w) when scrolled into view.
 * Pure CSS animation: hundreds of per-cell JS tweens blocked the main thread for seconds.
 */
export function Ripple({ children, className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!window.matchMedia(MOTION_OK).matches) return;
    el.dataset.ripple = "armed";
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      el.dataset.ripple = "in";
      io.disconnect();
    }, { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
