import { autoReplyEmail, EmailUnavailableError, notificationEmail, type Mail } from "./email";
import { validateContact } from "./validate";

type Deps = {
  allow: (key: string) => boolean;
  verify: (token: string, ip: string) => Promise<boolean>;
  send: (mail: Mail) => Promise<"resend" | "gmail">;
  to: string;
  now?: () => number;
};
export type ContactResult = { status: number; body: Record<string, unknown> };

const MIN_FILL_MS = 3000;

export async function handleContact(body: unknown, ip: string, deps: Deps): Promise<ContactResult> {
  const raw = (body ?? {}) as Record<string, unknown>;
  const now = (deps.now ?? Date.now)();
  // bots fill the hidden field or submit instantly; pretend success so they don't retry
  if (raw.company || typeof raw.startedAt !== "number" || now - raw.startedAt < MIN_FILL_MS) return { status: 200, body: { ok: true } };

  const v = validateContact(raw);
  if (!v.ok) return { status: 400, body: { errors: v.errors } };
  if (!deps.allow(ip)) return { status: 429, body: { error: "Too many messages. Try again in an hour." } };
  if (!(await deps.verify(String(raw.turnstileToken ?? ""), ip))) return { status: 400, body: { error: "Please complete the spam check and try again." } };

  try {
    await deps.send({ to: deps.to, replyTo: v.data.email, ...notificationEmail(v.data) });
  } catch (err) {
    if (err instanceof EmailUnavailableError) return { status: 503, body: { error: "Email is temporarily unavailable. Please email me directly." } };
    throw err;
  }
  try {
    await deps.send({ to: v.data.email, ...autoReplyEmail(v.data.name) });
  } catch {
    // the message reached Ritik; a missing auto-reply is not worth failing the request
  }
  return { status: 200, body: { ok: true } };
}
