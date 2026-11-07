"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { DESKTOP_MOTION, registerGsap } from "@/lib/motion";

export function Magnetic({ strength = 0.3, children }: { strength?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      const x = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3" });
      const move = (e: PointerEvent) => {
        const b = el.getBoundingClientRect();
        x((e.clientX - b.left - b.width / 2) * strength);
        y((e.clientY - b.top - b.height / 2) * strength);
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    return () => mm.revert();
  });

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
