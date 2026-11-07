"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Cloudflare Turnstile widget, loaded only when its container is about to be seen. No-op without a site key. */
export function useTurnstile() {
  const captcha = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const token = useRef("");

  useEffect(() => {
    if (!SITE_KEY || !captcha.current) return;
    const el = captcha.current;
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const render = () => {
          widget.current = window.turnstile?.render(el, {
            sitekey: SITE_KEY,
            theme: document.documentElement.classList.contains("light") ? "light" : "dark",
            callback: (t: string) => (token.current = t),
            "expired-callback": () => (token.current = ""),
          });
        };
        if (window.turnstile) return render();
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.onload = render;
        document.head.appendChild(s);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reset = () => {
    if (widget.current) window.turnstile?.reset(widget.current);
    token.current = "";
  };
  return { captcha, token, reset };
}
