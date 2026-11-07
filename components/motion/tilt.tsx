"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { DESKTOP_MOTION, registerGsap } from "@/lib/motion";

/** 3D tilt toward the cursor with a soft accent spotlight under it. */
export function Tilt({ max = 16, className = "", children, ...rest }: { max?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      const move = (e: PointerEvent) => {
        const b = el.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width - 0.5;
        const py = (e.clientY - b.top) / b.height - 0.5;
        el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
        el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
        gsap.to(el, { rotateY: px * max, rotateX: -py * max, duration: 0.4, ease: "power2.out", transformPerspective: 900 });
      };
      const leave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
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
    <div ref={ref} className={`group/tilt relative transform-3d ${className}`} {...rest}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{ background: "radial-gradient(500px circle at var(--mx,50%) var(--my,50%), var(--accent-soft), transparent 45%)" }}
      />
      {children}
    </div>
  );
}
