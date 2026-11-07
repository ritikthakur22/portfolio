"use client";

import { useEffect, useRef, useState } from "react";
import { DESKTOP_MOTION, registerGsap, whenIdle } from "@/lib/motion";

const GAP = 26;
const RADIUS = 120;
const PUSH = 28;

/** Background dots that move away from the cursor. Desktop only; paused while off screen. */
export function DotGrid({ className = "" }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MOTION);
    const sync = () => setEnabled(mq.matches);
    const cancel = whenIdle(sync);
    mq.addEventListener("change", sync);
    return () => {
      cancel();
      mq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const host = cv.parentElement!;
    const gsap = registerGsap();
    let dots: { x: number; y: number; ox: number; oy: number }[] = [];
    let mouse = { x: -999, y: -999 };
    let visible = false;
    let accent = "#2dd4bf";
    let idle = "#2a3236";
    let w = 0;
    let h = 0;

    const size = () => {
      const r = window.devicePixelRatio || 1;
      w = cv.offsetWidth;
      h = cv.offsetHeight;
      cv.width = w * r;
      cv.height = h * r;
      ctx.setTransform(r, 0, 0, r, 0, 0);
      dots = [];
      for (let x = GAP / 2; x < w; x += GAP)
        for (let y = GAP / 2; y < h; y += GAP) dots.push({ x, y, ox: x, oy: y });
      const cs = getComputedStyle(cv);
      accent = cs.getPropertyValue("--accent").trim() || accent;
      idle = cs.getPropertyValue("--border").trim() || idle;
    };
    const move = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect();
      mouse = { x: e.clientX - b.left, y: e.clientY - b.top };
    };
    const leave = () => (mouse = { x: -999, y: -999 });
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    const tick = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.ox - mouse.x;
        const dy = d.oy - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - dist / RADIUS);
        d.x += (d.ox + (dx / dist) * f * PUSH - d.x) * 0.15;
        d.y += (d.oy + (dy / dist) * f * PUSH - d.y) * 0.15;
        ctx.fillStyle = f > 0 ? accent : idle;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.4 + f * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    size();
    io.observe(cv);
    window.addEventListener("resize", size);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    // theme switch changes the CSS colors
    const mo = new MutationObserver(size);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", size);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={canvas} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}
