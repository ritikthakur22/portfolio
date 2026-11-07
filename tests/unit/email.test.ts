import { describe, expect, test, vi } from "vitest";
import { autoReplyEmail, EmailUnavailableError, notificationEmail, sendWithFallback, type Sender } from "@/lib/email";

const msg = { to: "me@x.com", subject: "s", html: "<p>h</p>", text: "h" };
const okSender = (): Sender => vi.fn(async () => {});
const badSender = (): Sender => vi.fn(async () => { throw new Error("down"); });

describe("sendWithFallback", () => {
  test("uses Resend when it works", async () => {
    const resend = okSender(), gmail = okSender();
    expect(await sendWithFallback(msg, { resend, gmail })).toBe("resend");
    expect(gmail).not.toHaveBeenCalled();
  });
  test("falls back to Gmail when Resend fails", async () => {
    const gmail = okSender();
    expect(await sendWithFallback(msg, { resend: badSender(), gmail })).toBe("gmail");
    expect(gmail).toHaveBeenCalledWith(msg);
  });
  test("skips an unconfigured Resend", async () => {
    expect(await sendWithFallback(msg, { gmail: okSender() })).toBe("gmail");
  });
  test("throws when both fail or none configured", async () => {
    await expect(sendWithFallback(msg, { resend: badSender(), gmail: badSender() })).rejects.toBeInstanceOf(EmailUnavailableError);
    await expect(sendWithFallback(msg, {})).rejects.toBeInstanceOf(EmailUnavailableError);
  });
});

test("notification escapes visitor input", () => {
  const e = notificationEmail({ name: "<b>x</b>", email: "a@b.co", message: "<script>alert(1)</script>" });
  expect(e.html).not.toContain("<script>");
  expect(e.html).not.toContain("<b>x</b>");
  expect(e.html).toContain("&lt;script&gt;");
});

test("auto-reply never echoes the visitor's message and escapes the name", () => {
  const e = autoReplyEmail("<b>Asha</b>");
  expect(e.html).not.toContain("<b>Asha</b>");
  expect(e.html).toContain("&lt;b&gt;Asha&lt;/b&gt;");
  expect(autoReplyEmail.length).toBe(1);
});
