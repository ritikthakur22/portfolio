"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "@/lib/motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggle(e: React.MouseEvent) {
    const next = resolvedTheme === "light" ? "dark" : "light";
    if (!document.startViewTransition || prefersReducedMotion()) return setTheme(next);
    const { clientX: x, clientY: y } = e;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => flushSync(() => setTheme(next))).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.7,0,.3,1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid size-10 place-items-center rounded-full border border-border bg-surface text-text transition-colors hover:border-accent"
    >
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <Moon className="size-4 dark:hidden" aria-hidden />
    </button>
  );
}
