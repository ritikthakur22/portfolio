import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    registered = true;
  }
  return gsap;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

export { gsap, ScrollTrigger, SplitText };

/** Fine pointer, hover-capable, motion allowed: the only setup that gets cursor effects, pinning and the dot grid. */
export const DESKTOP_MOTION = "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Runs `cb` once the browser is idle after load, so below-the-fold animation setup never competes with first paint. */
export function whenIdle(cb: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const t = setTimeout(cb, 300);
  return () => clearTimeout(t);
}
