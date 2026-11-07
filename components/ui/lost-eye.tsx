"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, registerGsap } from "@/lib/motion";

/** The "0" in 404: an eye that follows the cursor, blinks, and darts around when idle. */
export function LostEye() {
  const eye = useRef<SVGSVGElement>(null);
  const pupil = useRef<SVGGElement>(null);
  const lid = useRef<SVGGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = registerGsap();
    const look = (x: number, y: number) => {
      const b = eye.current!.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      const a = Math.atan2(y - cy, x - cx);
      const d = Math.min(26, Math.hypot(x - cx, y - cy) / 8);
      gsap.to(pupil.current, { x: Math.cos(a) * d, y: Math.sin(a) * d, duration: 0.35, ease: "power3.out", overwrite: true });
    };
    let idle: ReturnType<typeof setTimeout>;
    const wander = () => {
      const b = eye.current!.getBoundingClientRect();
      look(b.left + Math.random() * b.width * 3 - b.width, b.top + Math.random() * b.height * 3 - b.height);
      idle = setTimeout(wander, 1400);
    };
    const move = (e: PointerEvent) => {
      clearTimeout(idle);
      look(e.clientX, e.clientY);
      idle = setTimeout(wander, 3000);
    };
    let blinkT: ReturnType<typeof setTimeout>;
    const blink = () => {
      gsap.to(lid.current, { scaleY: 0.08, duration: 0.09, yoyo: true, repeat: 1, transformOrigin: "50% 50%" });
      blinkT = setTimeout(blink, 2500 + Math.random() * 3000);
    };
    addEventListener("pointermove", move);
    idle = setTimeout(wander, 1200);
    blinkT = setTimeout(blink, 1800);
    gsap.from(eye.current, { scale: 0, rotate: -90, duration: 1, ease: "back.out(1.7)" });
    return () => {
      removeEventListener("pointermove", move);
      clearTimeout(idle);
      clearTimeout(blinkT);
    };
  }, []);

  return (
    <svg ref={eye} data-testid="lost-eye" viewBox="0 0 120 160" aria-hidden className="h-[0.78em] w-auto overflow-visible">
      <g ref={lid} style={{ transformBox: "fill-box" }}>
        <ellipse cx="60" cy="80" rx="54" ry="74" fill="var(--surface)" stroke="var(--accent)" strokeWidth="10" />
        <g ref={pupil}>
          <circle cx="60" cy="80" r="24" fill="var(--accent)" />
          <circle cx="68" cy="70" r="7" fill="var(--bg)" />
        </g>
      </g>
    </svg>
  );
}
