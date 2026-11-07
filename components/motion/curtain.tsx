"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { registerGsap } from "@/lib/motion";

export type CurtainRequest = { href: string; label: string };
export const CURTAIN_EVENT = "curtain:go";

/** Full-screen accent wipe with the destination's name; covers the page, navigates, then lifts. */
export function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const layer = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLParagraphElement>(null);
  const [label, setLabel] = useState("");
  const [state, setState] = useState<"closed" | "open">("closed");
  const target = useRef<string | null>(null);
  const hash = useRef("");

  useEffect(() => {
    const go = (e: Event) => {
      const { href, label } = (e as CustomEvent<CurtainRequest>).detail;
      const gsap = registerGsap();
      const url = new URL(href, location.href);
      target.current = url.pathname;
      hash.current = url.hash.slice(1);
      setLabel(label);
      setState("open");
      gsap
        .timeline()
        .set(layer.current, { yPercent: 100, autoAlpha: 1 })
        .to(layer.current, { yPercent: 0, duration: 0.6, ease: "expo.inOut" })
        .from(word.current, { yPercent: 60, opacity: 0, duration: 0.45, ease: "expo.out" }, "-=0.2")
        .add(() => router.push(href));
    };
    window.addEventListener(CURTAIN_EVENT, go);
    return () => window.removeEventListener(CURTAIN_EVENT, go);
  }, [router]);

  // lift once the destination route has rendered
  useEffect(() => {
    if (state !== "open" || pathname !== target.current) return;
    const gsap = registerGsap();
    const anchor = hash.current && document.getElementById(hash.current);
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
    gsap.to(layer.current, {
      yPercent: -100,
      duration: 0.6,
      delay: 0.15,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(layer.current, { autoAlpha: 0 });
        target.current = null;
        setState("closed");
      },
    });
  }, [pathname, state]);

  return (
    <div
      ref={layer}
      data-curtain={state}
      aria-hidden={state === "closed"}
      className="pointer-events-none invisible fixed inset-0 z-[90] grid place-items-center bg-accent opacity-0"
    >
      <p ref={word} className="px-6 text-center font-display text-[clamp(48px,10vw,140px)] leading-none font-extrabold tracking-[-0.04em] text-accent-ink">
        {label}
      </p>
    </div>
  );
}
