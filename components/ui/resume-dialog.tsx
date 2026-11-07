"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isEmail } from "@/lib/validate";
import { useTurnstile } from "./use-turnstile";

export const OPEN_RESUME_EVENT = "open-resume";

/** "Get the full resume by email": the resume is emailed from contact@ and Ritik is notified. */
export function ResumeDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const { captcha, token, reset } = useTurnstile();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");

  useEffect(() => {
    const open = () => {
      setStatus("idle");
      setError("");
      setNote("");
      startedAt.current = Date.now();
      dialog.current?.showModal();
      input.current?.focus();
    };
    addEventListener(OPEN_RESUME_EVENT, open);
    return () => removeEventListener(OPEN_RESUME_EVENT, open);
  }, []);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isEmail(email.trim())) return setError("Enter a valid email address.");
    setError("");
    setStatus("sending");
    try {
      const company = (e.currentTarget.elements.namedItem("company") as HTMLInputElement).value;
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), company, startedAt: startedAt.current, turnstileToken: token.current }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; errors?: { email?: string } };
      if (res.ok && data.ok) {
        setStatus("sent");
        setEmail("");
      } else {
        setStatus("error");
        setNote(data.errors?.email ?? data.error ?? "Something went wrong. Please email me directly.");
      }
    } catch {
      setStatus("error");
      setNote("Couldn't reach the server. Check your connection and try again.");
    }
    reset();
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="resume-title"
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-3xl border border-border bg-surface p-0 text-text shadow-[0_30px_80px_rgb(0_0_0/0.45)] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={onSubmit} noValidate className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="resume-title" className="font-display text-2xl font-bold tracking-tight">
            Get the full resume
          </h2>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="grid size-8 place-items-center rounded-full text-muted hover:text-text">
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter your email and my full resume arrives in a minute from contact@ritikthakur.com.np. Your address is only used to send it.
        </p>
        <label htmlFor="resume-email" className="mt-6 mb-2 block text-sm text-muted">
          Your email
        </label>
        <input
          ref={input}
          id="resume-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => (setEmail(e.target.value), setError(""))}
          aria-invalid={!!error}
          aria-describedby={error ? "resume-email-error" : undefined}
          className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-base outline-none placeholder:text-muted focus:border-accent aria-[invalid=true]:border-red-400"
        />
        {error && (
          <p id="resume-email-error" className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="resume-company">Company</label>
          <input id="resume-company" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <div ref={captcha} className="mt-4" />
        <button type="submit" disabled={status === "sending"} className="mt-5 w-full rounded-full bg-accent px-6 py-3 font-medium text-accent-ink disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Email me the resume"}
        </button>
        <p role="status" aria-live="polite" className={`mt-3 min-h-5 text-sm ${status === "error" ? "text-red-400" : "text-accent"}`}>
          {status === "sent" ? "Sent. Check your inbox (and spam folder) in a minute." : status === "error" ? note : ""}
        </p>
      </form>
    </dialog>
  );
}
