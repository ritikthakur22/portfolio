import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion, registerGsap } from "@/lib/motion";

type Msg = { role: "user" | "assistant"; content: string };

const LINK = /(https?:\/\/[^\s)]+[^\s).,]|\/projects\/[a-z0-9-]+|#contact)/g;

/** Turns URLs, project pages and #contact in a reply into links. */
function linkify(text: string) {
  return text.split(LINK).map((part, i) =>
    i % 2 ? (
      <a key={i} href={part} {...(part.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})} className="text-accent underline underline-offset-2">
        {part === "#contact" ? "contact form" : part}
      </a>
    ) : (
      part
    ),
  );
}

const SUGGESTIONS = ["What has he built?", "What's his stack?", "How do I hire him?"];
const GREETING: Msg = { role: "assistant", content: "Hi! I can tell you about Ritik's projects, skills and experience. What would you like to know?" };

export function ChatWidget({ open, anchor, onClose }: { open: boolean; anchor: React.RefObject<HTMLButtonElement | null>; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");

  // open beside the launcher, on whichever side has room
  useLayoutEffect(() => {
    if (!open || !panel.current || !anchor.current) return;
    const b = anchor.current.getBoundingClientRect();
    const p = panel.current;
    const w = p.offsetWidth;
    const h = p.offsetHeight;
    const x = b.left + b.width / 2 < innerWidth / 2 ? b.left : b.right - w;
    const y = b.top > h + 16 ? b.top - h - 12 : b.bottom + 12;
    p.style.left = `${Math.max(16, Math.min(innerWidth - w - 16, x))}px`;
    p.style.top = `${Math.max(16, Math.min(innerHeight - h - 16, y))}px`;
    if (!prefersReducedMotion()) registerGsap().fromTo(p, { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.6)" });
    input.current?.focus();
  }, [open, anchor]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open, onClose]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [msgs, busy]);

  async function send(q: string) {
    const question = q.trim().slice(0, 500);
    if (!question || busy) return;
    const history = [...msgs.slice(1), { role: "user" as const, content: question }];
    setMsgs((m) => [...m, { role: "user", content: question }]);
    setText("");
    setBusy(true);
    let reply: string;
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      const data = (await res.json()) as { reply?: string; error?: string };
      reply = data.reply ?? data.error ?? "Something went wrong. Try the contact form instead.";
    } catch {
      reply = "I couldn't reach the server. Check your connection, or use the contact form.";
    }
    setBusy(false);
    if (prefersReducedMotion()) return setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    // type the reply out word by word
    setMsgs((m) => [...m, { role: "assistant", content: "" }]);
    const words = reply.split(" ");
    for (let i = 1; i <= words.length; i++) {
      await new Promise((r) => setTimeout(r, 28));
      setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content: words.slice(0, i).join(" ") }]);
    }
  }

  const look = (on: boolean) => {
    const r = input.current?.getBoundingClientRect();
    dispatchEvent(new CustomEvent("chat:look", { detail: on && r ? { x: r.left + 40, y: r.top } : null }));
  };

  return (
    <div
      ref={panel}
      id="chat-panel"
      role="dialog"
      aria-label="Chat about Ritik"
      hidden={!open}
      className="fixed z-[69] flex h-[min(520px,calc(100svh-120px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_30px_80px_rgb(0_0_0/0.35)]"
    >
      <header className="flex items-center gap-3 border-b border-border px-4 py-3.5">
        <span className="size-2 rounded-full bg-accent shadow-[0_0_0_3px_var(--accent-soft)]" aria-hidden />
        <div>
          <p className="font-display font-bold">Ask about Ritik</p>
          <p className="text-xs text-muted">AI assistant, answers only about his work</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close chat" className="ml-auto grid size-8 place-items-center rounded-full text-muted hover:text-text">
          <X className="size-4" aria-hidden />
        </button>
      </header>
      <div ref={list} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4 text-sm leading-relaxed" aria-live="polite">
        {msgs.map((m, i) => (
          <p
            key={i}
            className={
              m.role === "user"
                ? "max-w-[85%] self-end rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-accent-ink"
                : "max-w-[85%] rounded-2xl rounded-bl-md bg-surface-2 px-3.5 py-2.5 whitespace-pre-line"
            }
          >
            {m.role === "assistant" ? linkify(m.content) : m.content}
          </p>
        ))}
        {busy && (
          <p className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-surface-2 px-4 py-3" aria-label="Thinking">
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />
            ))}
          </p>
        )}
      </div>
      {msgs.length === 1 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:border-accent hover:text-accent">
              {s}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={(e) => (e.preventDefault(), send(text))} className="flex gap-2 border-t border-border p-3">
        <label htmlFor="chat-input" className="sr-only">
          Your question
        </label>
        <input
          ref={input}
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => look(true)}
          onBlur={() => look(false)}
          maxLength={500}
          autoComplete="off"
          placeholder="Ask anything about Ritik"
          className="min-w-0 flex-1 rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm outline-none focus:border-accent"
        />
        <button type="submit" disabled={busy || !text.trim()} className="rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
}
