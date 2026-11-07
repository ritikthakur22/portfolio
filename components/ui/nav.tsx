"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { registerGsap } from "@/lib/motion";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const gsap = registerGsap();
    gsap.to(bar.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-md">
      <div ref={bar} className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent" aria-hidden />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight" aria-label="Ritik Thakur, home">
          RT<span className="text-accent">.</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-2 sm:gap-6">
          <ul className="hidden items-center gap-6 text-sm text-muted md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            id="palette-trigger"
            type="button"
            className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-muted transition-colors hover:text-text"
            aria-label="Open command palette"
          >
            Ctrl K
          </button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
