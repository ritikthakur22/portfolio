import { expect, test, vi } from "vitest";
import { handleContact } from "@/lib/contact-handler";
import { EmailUnavailableError } from "@/lib/email";

const NOW = 1_000_000;
const body = (over: Record<string, unknown> = {}) => ({
  name: "Asha",
  email: "asha@example.com",
  message: "I'd like to talk about a project.",
  company: "",
  startedAt: NOW - 10_000,
  turnstileToken: "tok",
  ...over,
});
const deps = (over: Partial<Parameters<typeof handleContact>[2]> = {}) => ({
  allow: () => true,
  verify: vi.fn(async () => true),
  send: vi.fn(async () => "resend" as const),
  to: "inbox@x.com",
  now: () => NOW,
  ...over,
});

test("happy path sends notification (reply-to visitor) then auto-reply", async () => {
  const send = vi.fn(async () => "resend" as const);
  expect(await handleContact(body(), "ip", deps({ send }))).toEqual({ status: 200, body: { ok: true } });
  expect(send).toHaveBeenCalledTimes(2);
  expect(send).toHaveBeenNthCalledWith(1, expect.objectContaining({ to: "inbox@x.com", replyTo: "asha@example.com" }));
  expect(send).toHaveBeenNthCalledWith(2, expect.objectContaining({ to: "asha@example.com" }));
});

test("honeypot or too-fast submits look successful but send nothing", async () => {
  for (const b of [body({ company: "spam inc" }), body({ startedAt: NOW - 1000 })]) {
    const d = deps();
    expect(await handleContact(b, "ip", d)).toEqual({ status: 200, body: { ok: true } });
    expect(d.send).not.toHaveBeenCalled();
  }
});

test("invalid fields → 400 with errors", async () => {
  const r = await handleContact(body({ email: "nope" }), "ip", deps());
  expect(r.status).toBe(400);
  expect(r.body).toHaveProperty("errors.email");
});

test("failed captcha → 400", async () => {
  const r = await handleContact(body(), "ip", deps({ verify: vi.fn(async () => false) }));
  expect(r).toEqual({ status: 400, body: { error: "Please complete the spam check and try again." } });
});

test("rate limited → 429", async () => {
  expect((await handleContact(body(), "ip", deps({ allow: () => false }))).status).toBe(429);
});

test("email unavailable → 503 with direct-email hint", async () => {
  const r = await handleContact(body(), "ip", deps({ send: vi.fn(async () => { throw new EmailUnavailableError(); }) }));
  expect(r).toEqual({ status: 503, body: { error: "Email is temporarily unavailable. Please email me directly." } });
});

test("auto-reply failure still returns success", async () => {
  const send = vi.fn().mockResolvedValueOnce("resend").mockRejectedValueOnce(new EmailUnavailableError());
  expect(await handleContact(body(), "ip", deps({ send }))).toEqual({ status: 200, body: { ok: true } });
});
