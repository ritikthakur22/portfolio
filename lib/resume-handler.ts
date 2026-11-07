import { EmailUnavailableError, resumeEmail, resumeRequestNotice, type Attachment, type Mail } from "./email";
import { isEmail } from "./validate";

type Deps = {
  allow: (key: string) => boolean;
  verify: (token: string, ip: string) => Promise<boolean>;
  send: (mail: Mail) => Promise<"resend" | "gmail">;
  getResume: () => Promise<Attachment>;
  to: string;
  now?: () => number;
};

const MIN_FILL_MS = 2000;

export async function handleResumeRequest(body: unknown, ip: string, deps: Deps): Promise<{ status: number; body: Record<string, unknown> }> {
  const raw = (body ?? {}) as Record<string, unknown>;
  const now = (deps.now ?? Date.now)();
  // bots fill the hidden field or submit instantly; pretend success so they don't retry
  if (raw.company || typeof raw.startedAt !== "number" || now - raw.startedAt < MIN_FILL_MS) return { status: 200, body: { ok: true } };

  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  if (!isEmail(email)) return { status: 400, body: { errors: { email: "Enter a valid email address." } } };
  if (!deps.allow(ip)) return { status: 429, body: { error: "Too many requests. Try again in an hour." } };
  if (!(await deps.verify(String(raw.turnstileToken ?? ""), ip))) return { status: 400, body: { error: "Please complete the spam check and try again." } };

  try {
    await deps.send({ to: email, replyTo: "contact@ritikthakur.com.np", attachments: [await deps.getResume()], ...resumeEmail() });
  } catch (err) {
    if (err instanceof EmailUnavailableError) return { status: 503, body: { error: "Email is temporarily unavailable. Please email me directly." } };
    throw err;
  }
  try {
    await deps.send({ to: deps.to, replyTo: email, ...resumeRequestNotice(email) });
  } catch {
    // the visitor already has the resume
  }
  return { status: 200, body: { ok: true } };
}
