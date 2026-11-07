import { expect, test, vi } from "vitest";
import { EmailUnavailableError } from "@/lib/email";
import { handleResumeRequest } from "@/lib/resume-handler";

const NOW = 1_000_000;
const pdf = { filename: "Ritik_Thakur_Resume.pdf", content: Buffer.from("%PDF-1.7") };
const body = (over: Record<string, unknown> = {}) => ({ email: "recruiter@company.com", company: "", startedAt: NOW - 5000, turnstileToken: "t", ...over });
const deps = (over: Record<string, unknown> = {}) => ({
  allow: () => true,
  verify: vi.fn(async () => true),
  send: vi.fn(async () => "resend" as const),
  getResume: vi.fn(async () => pdf),
  to: "inbox@x.com",
  now: () => NOW,
  ...over,
});

test("emails the resume as an attachment, then notifies Ritik", async () => {
  const send = vi.fn(async () => "resend" as const);
  expect(await handleResumeRequest(body(), "ip", deps({ send }))).toEqual({ status: 200, body: { ok: true } });
  expect(send).toHaveBeenNthCalledWith(1, expect.objectContaining({ to: "recruiter@company.com", attachments: [pdf] }));
  expect(send).toHaveBeenNthCalledWith(2, expect.objectContaining({ to: "inbox@x.com", subject: expect.stringContaining("recruiter@company.com") }));
});

test("bots (honeypot or instant submit) get a fake success and nothing is sent", async () => {
  for (const b of [body({ company: "x" }), body({ startedAt: NOW - 500 })]) {
    const d = deps();
    expect(await handleResumeRequest(b, "ip", d)).toEqual({ status: 200, body: { ok: true } });
    expect(d.send).not.toHaveBeenCalled();
  }
});

test("invalid email, failed captcha and rate limit are rejected", async () => {
  expect((await handleResumeRequest(body({ email: "nope" }), "ip", deps())).status).toBe(400);
  expect((await handleResumeRequest(body(), "ip", deps({ verify: vi.fn(async () => false) }))).status).toBe(400);
  expect((await handleResumeRequest(body(), "ip", deps({ allow: () => false }))).status).toBe(429);
});

test("email providers down → 503; a failed notification still succeeds", async () => {
  const down = await handleResumeRequest(body(), "ip", deps({ send: vi.fn(async () => { throw new EmailUnavailableError(); }) }));
  expect(down).toEqual({ status: 503, body: { error: "Email is temporarily unavailable. Please email me directly." } });
  const send = vi.fn().mockResolvedValueOnce("resend").mockRejectedValueOnce(new EmailUnavailableError());
  expect((await handleResumeRequest(body(), "ip", deps({ send }))).status).toBe(200);
});
