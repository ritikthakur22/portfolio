"use client";

import { useGSAP } from "@gsap/react";
import { Children, useRef } from "react";
import { MOTION_OK, registerGsap } from "@/lib/motion";

/** Cards stick and pile up; the card underneath scales back and dims as the next one slides over it. */
export function StackCards({ children, className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  useGSAP(
    () => {
      const gsap = registerGsap();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", ref.current);
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card.firstElementChild, {
            scale: 0.9 + i * 0.02,
            opacity: 0.5,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: `top ${110 + (i + 1) * 20}px`, scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} {...rest}>
      {items.map((child, i) => (
        <div key={i} data-stack-card className="sticky mb-10" style={{ top: 90 + i * 20 }}>
          <div className="origin-top">{child}</div>
        </div>
      ))}
    </div>
  );
}
