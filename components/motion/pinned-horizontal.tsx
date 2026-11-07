"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { DESKTOP_MOTION, registerGsap } from "@/lib/motion";

/**
 * Server markup is a vertical stack (readable without JS and on touch).
 * On desktop with motion allowed it becomes a pinned row that scrolls sideways.
 */
export function PinnedHorizontal({ children, className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      const t = track.current!;
      t.dataset.pinned = "true";
      const distance = () => t.scrollWidth - window.innerWidth;
      gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: wrap.current, pin: true, scrub: 1, start: "top top", end: () => `+=${distance()}`, invalidateOnRefresh: true },
      });
      return () => delete t.dataset.pinned;
    });
    return () => mm.revert();
  });

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`} {...rest}>
      <div
        ref={track}
        className="flex flex-col gap-6 px-4 sm:px-8 data-pinned:h-screen data-pinned:w-max data-pinned:flex-row data-pinned:items-center data-pinned:px-[8vw]"
      >
        {children}
      </div>
    </div>
  );
}
