"use client";

import { useEffect, useRef, useState } from "react";
import { validateContact, type ContactData, type ContactErrors } from "@/lib/validate";
import { useTurnstile } from "./use-turnstile";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text placeholder:text-muted outline-none transition-colors focus:border-accent aria-[invalid=true]:border-red-400";

export function ContactForm() {
  const [values, setValues] = useState<ContactData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState("");
  const startedAt = useRef(0);
  const { captcha, token, reset } = useTurnstile();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (k: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = validateContact(values);
    if (!v.ok) return setErrors(v.errors);
    setStatus("sending");
    setNote("");
    try {
      const form = e.currentTarget;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v.data, company: (form.elements.namedItem("company") as HTMLInputElement).value, startedAt: startedAt.current, turnstileToken: token.current }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; errors?: ContactErrors };
      if (res.ok && data.ok) {
        setStatus("sent");
        setValues({ name: "", email: "", message: "" });
      } else {
        if (data.errors) setErrors(data.errors);
        setStatus("error");
        setNote(data.error ?? "Check the highlighted fields.");
      }
    } catch {
      setStatus("error");
      setNote("Couldn't reach the server. Check your connection and try again.");
    }
    reset();
  }

  const err = (k: keyof ContactData) =>
    errors[k] && (
      <p id={`${k}-error`} className="mt-2 text-sm text-red-400">
        {errors[k]}
      </p>
    );
  const aria = (k: keyof ContactData) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Contact form" className="space-y-5 rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur sm:p-8">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-muted">
          Name
        </label>
        <input id="name" name="name" autoComplete="name" placeholder="Your name" value={values.name} onChange={set("name")} className={field} {...aria("name")} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-muted">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={set("email")} className={field} {...aria("email")} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-muted">
          Message
        </label>
        <textarea id="message" name="message" rows={5} placeholder="Tell me about your project, the role, or your question." value={values.message} onChange={set("message")} className={`${field} resize-y`} {...aria("message")} />
        {err("message")}
      </div>
      {/* hidden from people; bots that fill every field get caught */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div ref={captcha} />
      <button type="submit" disabled={status === "sending"} className="w-full rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink transition-opacity disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p role="status" aria-live="polite" className={`text-sm ${status === "error" ? "text-red-400" : "text-accent"}`}>
        {status === "sent" ? "Message sent. I'll reply within 48 hours." : status === "error" ? note : ""}
      </p>
    </form>
  );
}
