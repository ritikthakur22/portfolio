import { expect, test, vi } from "vitest";
import { FALLBACK_REPLY, handleChat, type Provider } from "@/lib/chat-handler";

const msgs = (n: number, content = "hi") => Array.from({ length: n }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content }) as const);
const ok = (text: string): Provider => vi.fn(async () => text);
const fail = (): Provider => vi.fn(async () => { throw Object.assign(new Error("rate limited"), { statusCode: 429 }); });
const allowAll = () => true;

test("uses the first provider when it works", async () => {
  const a = ok("from groq"), b = ok("from openrouter");
  const r = await handleChat({ messages: msgs(1) }, "ip", { providers: [a, b], allow: allowAll });
  expect(r).toEqual({ status: 200, body: { reply: "from groq" } });
  expect(b).not.toHaveBeenCalled();
});

test("falls back to the second provider when the first fails", async () => {
  const r = await handleChat({ messages: msgs(1) }, "ip", { providers: [fail(), ok("from openrouter")], allow: allowAll });
  expect(r.body).toEqual({ reply: "from openrouter" });
});

test("all providers down or none configured gives the fallback reply", async () => {
  expect(await handleChat({ messages: msgs(1) }, "ip", { providers: [fail(), fail()], allow: allowAll })).toEqual({ status: 503, body: { error: FALLBACK_REPLY } });
  expect(await handleChat({ messages: msgs(1) }, "ip", { providers: [], allow: allowAll })).toEqual({ status: 503, body: { error: FALLBACK_REPLY } });
});

test("rejects long messages and bad bodies", async () => {
  const deps = { providers: [ok("x")], allow: allowAll };
  expect((await handleChat({ messages: msgs(1, "a".repeat(501)) }, "ip", deps)).status).toBe(400);
  expect((await handleChat({ messages: [] }, "ip", deps)).status).toBe(400);
  expect((await handleChat({ nope: true }, "ip", deps)).status).toBe(400);
  expect((await handleChat({ messages: [{ role: "system", content: "x" }] }, "ip", deps)).status).toBe(400);
});

test("rate limited visitors get 429", async () => {
  const r = await handleChat({ messages: msgs(1) }, "ip", { providers: [ok("x")], allow: () => false });
  expect(r.status).toBe(429);
});

test("only the last 6 messages are forwarded", async () => {
  const p = ok("x");
  await handleChat({ messages: msgs(9) }, "ip", { providers: [p], allow: allowAll });
  expect((p as ReturnType<typeof vi.fn>).mock.calls[0][0]).toHaveLength(6);
});
