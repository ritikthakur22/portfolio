"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { DESKTOP_MOTION, registerGsap, whenIdle } from "@/lib/motion";

export type PreviewItem = { label: string; meta: string; image: string; href: string };

function Thumb({ item, sizes }: { item: PreviewItem; sizes: string }) {
  return item.image ? (
    <Image src={item.image} alt="" fill sizes={sizes} className="object-cover object-top" />
  ) : (
    <div className="grid size-full place-items-center bg-[linear-gradient(135deg,var(--accent),var(--surface-2))] p-4 text-center font-display text-xl font-extrabold text-accent-ink">
      {item.label}
    </div>
  );
}

/** List where hovering a row floats a preview that follows the cursor. Touch shows inline thumbnails. */
export function HoverPreview({ items, ...rest }: { items: PreviewItem[] } & React.HTMLAttributes<HTMLUListElement>) {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<PreviewItem | null>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    const mm = gsap.matchMedia();
    const cancel = whenIdle(() =>
      mm.add(DESKTOP_MOTION, () => {
        const x = gsap.quickTo(box.current, "x", { duration: 0.45, ease: "power3" });
        const y = gsap.quickTo(box.current, "y", { duration: 0.45, ease: "power3" });
        const move = (e: PointerEvent) => (x(e.clientX + 40), y(e.clientY - 90));
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      }),
    );
    return () => {
      cancel();
      mm.revert();
    };
  });

  function show(item: PreviewItem | null) {
    setActive(item);
    const gsap = registerGsap();
    if (window.matchMedia(DESKTOP_MOTION).matches)
      gsap.to(box.current, { autoAlpha: item ? 1 : 0, scale: item ? 1 : 0.85, rotate: item ? -4 : 0, duration: 0.3 });
  }

  return (
    <>
      <ul className="border-t border-border" onPointerLeave={() => show(null)} {...rest}>
        {items.map((item) => (
          <li key={item.label} onPointerEnter={() => show(item)}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 border-b border-border py-6 transition-[padding,color] duration-300 hover:pl-4 hover:text-accent focus-visible:pl-4 focus-visible:text-accent"
            >
              <span className="relative hidden size-16 shrink-0 overflow-hidden rounded-lg border border-border [@media(hover:none)]:block">
                <Thumb item={item} sizes="64px" />
              </span>
              <span className="font-display text-[clamp(22px,3vw,36px)] font-bold tracking-tight">{item.label}</span>
              <span className="ml-auto text-right font-mono text-xs text-muted">{item.meta}</span>
            </a>
          </li>
        ))}
      </ul>
      <div
        ref={box}
        aria-hidden
        className="pointer-events-none invisible fixed top-0 left-0 z-40 h-44 w-64 overflow-hidden rounded-2xl border border-border opacity-0 shadow-2xl"
      >
        {active && <Thumb item={active} sizes="256px" />}
      </div>
    </>
  );
}
