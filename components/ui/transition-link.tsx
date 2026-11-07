"use client";

import Link from "next/link";
import { CURTAIN_EVENT, type CurtainRequest } from "@/components/motion/curtain";
import { prefersReducedMotion } from "@/lib/motion";

/** Link that plays the page curtain. Modified clicks (new tab etc.) and reduced motion navigate normally. */
export function TransitionLink({ href, label, ...rest }: { href: string; label: string } & Omit<React.ComponentProps<typeof Link>, "href">) {
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || prefersReducedMotion()) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent<CurtainRequest>(CURTAIN_EVENT, { detail: { href, label } }));
  }
  return <Link href={href} onClick={onClick} {...rest} />;
}
