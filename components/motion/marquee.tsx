"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MOTION_OK, registerGsap, ScrollTrigger, whenIdle } from "@/lib/motion";
import { wrapOffset } from "@/lib/motion-math";

/** Giant text band whose speed and direction follow scroll velocity. */
export function Marquee({ words, reverse = false, ...rest }: { words: string[]; reverse?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const row = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    const mm = gsap.matchMedia();
    const cancel = whenIdle(() =>
    mm.add(MOTION_OK, () => {
      let x = 0;
      let dir = reverse ? -1 : 1;
      let boost = 0;
      const st = ScrollTrigger.create({
        onUpdate: (s) => {
          dir = s.direction * (reverse ? -1 : 1);
          boost = Math.min(Math.abs(s.getVelocity()) / 300, 12);
        },
      });
      const el = row.current!;
      // reading scrollWidth after a transform write forces layout every frame, so measure only on resize
      let width = el.scrollWidth / 2;
      const ro = new ResizeObserver(() => (width = el.scrollWidth / 2));
      ro.observe(el);
      let visible = false;
      const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
      io.observe(el);
      const tick = () => {
        if (!visible) return;
        x -= (1 + boost) * dir;
        boost *= 0.92;
        el.style.transform = `translate3d(${wrapOffset(x, width)}px,0,0)`;
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        ro.disconnect();
        io.disconnect();
      };
    }),
    );
    return () => {
      cancel();
      mm.revert();
    };
  });

  const line = words.map((w, i) => (
    <span key={i} className={`pr-[0.6em] ${i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_var(--accent)]" : ""}`}>
      {w} ·
    </span>
  ));

  return (
    <div className="overflow-hidden border-y border-border py-6 select-none" {...rest}>
      <div ref={row} className="flex w-max font-display text-[clamp(40px,7vw,96px)] leading-none font-extrabold tracking-tight whitespace-nowrap uppercase will-change-transform">
        <div className="flex">{line}</div>
        <div className="flex" aria-hidden>
          {line}
        </div>
      </div>
    </div>
  );
}
