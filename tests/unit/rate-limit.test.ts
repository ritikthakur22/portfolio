import { expect, test } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

test("allows up to the limit inside the window, then blocks", () => {
  const allow = createRateLimiter({ limit: 3, windowMs: 3_600_000 });
  expect([allow("ip", 0), allow("ip", 1), allow("ip", 2), allow("ip", 3)]).toEqual([true, true, true, false]);
});

test("window slides and keys are independent", () => {
  const allow = createRateLimiter({ limit: 3, windowMs: 3_600_000 });
  for (let i = 0; i < 3; i++) allow("a", i);
  expect(allow("a", 10)).toBe(false);
  expect(allow("b", 10)).toBe(true);
  expect(allow("a", 3_600_001)).toBe(true);
});
