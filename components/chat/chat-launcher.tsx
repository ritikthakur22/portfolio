"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { clampPosition } from "@/lib/clamp";
import { prefersReducedMotion, registerGsap, whenIdle } from "@/lib/motion";
import { BotIcon } from "./bot-icon";

const ChatWidget = dynamic(() => import("./chat-widget").then((m) => m.ChatWidget), { ssr: false });

const SIZE = 64;
const STORE = "chat-pos";
const TAP = 6;

export function ChatLauncher() {
  const button = useRef<HTMLButtonElement>(null);
  const pupils = useRef<SVGGElement>(null);
  const lids = useRef<SVGGElement>(null);
  const hand = useRef<SVGPathElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [wave, setWave] = useState(false);
  const [hint, setHint] = useState(true);
  const lookAt = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  // restore saved position, re-clamped to this screen; follow resizes
  useEffect(() => {
    const place = (p: { x: number; y: number } | null) => setPos(p && clampPosition(p.x, p.y, innerWidth, innerHeight, SIZE));
    try {
      place(JSON.parse(localStorage.getItem(STORE) || "null"));
    } catch {}
    const onResize = () => setPos((p) => p && clampPosition(p.x, p.y, innerWidth, innerHeight, SIZE));
    addEventListener("resize", onResize);
    const t = setTimeout(() => setHint(false), 5000);
    return () => (removeEventListener("resize", onResize), clearTimeout(t));
  }, []);

  // eyes follow the cursor (or the chat input while typing), blink, float
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cleanup: (() => void) | undefined;
    const cancel = whenIdle(() => (cleanup = startEyes()));
    return () => {
      cancel();
      cleanup?.();
    };
    function startEyes() {
    const gsap = registerGsap();
    const aim = (x: number, y: number) => {
      const b = button.current?.getBoundingClientRect();
      if (!b) return;
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height * 0.45;
      const a = Math.atan2(y - cy, x - cx);
      const d = Math.min(3.2, Math.hypot(x - cx, y - cy) / 40);
      gsap.to(pupils.current, { x: Math.cos(a) * d, y: Math.sin(a) * d, duration: 0.25, overwrite: true });
    };
    const move = (e: PointerEvent) => !lookAt.current && aim(e.clientX, e.clientY);
    addEventListener("pointermove", move);
    let timer: ReturnType<typeof setTimeout>;
    const blink = () => {
      gsap.to(lids.current, { scaleY: 0.1, duration: 0.08, yoyo: true, repeat: 1 });
      timer = setTimeout(blink, 3000 + Math.random() * 3000);
    };
    timer = setTimeout(blink, 2000);
    const float = gsap.to(svg.current, { y: -4, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    const look = (e: Event) => {
      const p = (e as CustomEvent<{ x: number; y: number } | null>).detail;
      lookAt.current = p;
      if (p) aim(p.x, p.y);
    };
    addEventListener("chat:look", look);
    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("chat:look", look);
      clearTimeout(timer);
      float.kill();
    };
    }
  }, []);

  // easter egg: type "ritik" anywhere (outside inputs) and the bot waves
  useEffect(() => {
    let buf = "";
    const key = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName) || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-5);
      if (buf !== "ritik") return;
      buf = "";
      setWave(true);
      if (!prefersReducedMotion()) {
        const gsap = registerGsap();
        gsap
          .timeline()
          .set(hand.current, { opacity: 1 })
          .to(hand.current, { rotate: -35, duration: 0.15, repeat: 5, yoyo: true })
          .to(svg.current, { y: -12, duration: 0.2, yoyo: true, repeat: 1 }, 0)
          .set(hand.current, { opacity: 0, rotate: 0 });
      }
      setTimeout(() => setWave(false), 2400);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);

  const toggle = useCallback((next?: boolean) => {
    setLoaded(true);
    setHint(false);
    setOpen((o) => next ?? !o);
  }, []);

  useEffect(() => {
    const openChat = () => toggle(true);
    addEventListener("open-chat", openChat);
    return () => removeEventListener("open-chat", openChat);
  }, [toggle]);

  function onPointerDown(e: React.PointerEvent) {
    const b = button.current!.getBoundingClientRect();
    drag.current = { sx: e.clientX, sy: e.clientY, ox: e.clientX - b.left, oy: e.clientY - b.top, moved: false };
    button.current!.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < TAP) return;
    if (!d.moved) {
      d.moved = true;
      setHint(false);
      if (!prefersReducedMotion()) registerGsap().to(lids.current, { scaleY: 0.55, duration: 0.15 }); // squint while carried
    }
    setPos(clampPosition(e.clientX - d.ox, e.clientY - d.oy, innerWidth, innerHeight, SIZE));
  }
  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!prefersReducedMotion()) registerGsap().to(lids.current, { scaleY: 1, duration: 0.2 });
    if (d.moved) {
      const b = button.current!.getBoundingClientRect();
      try {
        localStorage.setItem(STORE, JSON.stringify({ x: b.left, y: b.top }));
      } catch {}
    } else toggle();
  }

  const style: React.CSSProperties = pos ? { left: pos.x, top: pos.y } : { right: 24, bottom: 24 };

  return (
    <>
      <div className="fixed z-[70] size-16" style={style}>
        <button
          ref={button}
          type="button"
          aria-label="Open chat: ask about Ritik"
          aria-expanded={open}
          aria-controls="chat-panel"
          data-wave={wave}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle())}
          className="size-16 cursor-grab touch-none rounded-full active:cursor-grabbing"
        >
          <BotIcon ref={svg} pupils={pupils} lids={lids} hand={hand} />
        </button>
        {(hint || wave) && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-[74px] -translate-y-1/2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs whitespace-nowrap text-text"
          >
            {wave ? "Hey there! You found me." : "Ask me about Ritik"}
          </span>
        )}
      </div>
      {loaded && <ChatWidget open={open} anchor={button} onClose={() => (toggle(false), button.current?.focus())} />}
    </>
  );
}
