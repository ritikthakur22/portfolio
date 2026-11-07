"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const CommandPalette = dynamic(() => import("./command-palette").then((m) => m.CommandPalette), { ssr: false });

/** Opens the palette with Ctrl/Cmd+K, "/" (outside text fields) or the nav button. Loads it on first use. */
export function PaletteLoader() {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const show = useCallback(() => (setLoaded(true), setOpen(true)), []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName) || (e.target as HTMLElement).isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); // claim the shortcut before the browser's search bar
        setLoaded(true);
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        show();
      }
    };
    const click = (e: MouseEvent) => (e.target as HTMLElement).closest("#palette-trigger") && show();
    addEventListener("keydown", key);
    document.addEventListener("click", click);
    return () => (removeEventListener("keydown", key), document.removeEventListener("click", click));
  }, [show]);

  return loaded ? <CommandPalette open={open} onClose={() => setOpen(false)} /> : null;
}
