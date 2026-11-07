"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { DESKTOP_MOTION, registerGsap } from "@/lib/motion";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      gsap.set(ref.current, { autoAlpha: 1 });
      const x = gsap.quickTo(ref.current, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(ref.current, "y", { duration: 0.6, ease: "power3" });
      const move = (e: PointerEvent) => (x(e.clientX), y(e.clientY));
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    });
    return () => mm.revert();
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none invisible fixed top-0 left-0 z-0 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
      style={{ background: "radial-gradient(circle, var(--glow), transparent 65%)" }}
    />
  );
}
