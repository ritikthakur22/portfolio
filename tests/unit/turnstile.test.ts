import { expect, test, vi } from "vitest";
import { verifyTurnstile } from "@/lib/turnstile";

test("skips the check when no secret is configured", async () => {
  const f = vi.fn();
  expect(await verifyTurnstile("tok", "ip", undefined, f)).toBe(true);
  expect(f).not.toHaveBeenCalled();
});

test("returns Cloudflare's verdict, false on errors or empty token", async () => {
  const reply = (body: unknown) => vi.fn(async () => new Response(JSON.stringify(body)));
  expect(await verifyTurnstile("tok", "ip", "secret", reply({ success: true }))).toBe(true);
  expect(await verifyTurnstile("tok", "ip", "secret", reply({ success: false }))).toBe(false);
  expect(await verifyTurnstile("", "ip", "secret", reply({ success: true }))).toBe(false);
  expect(await verifyTurnstile("tok", "ip", "secret", vi.fn(async () => { throw new Error("x"); }))).toBe(false);
});
