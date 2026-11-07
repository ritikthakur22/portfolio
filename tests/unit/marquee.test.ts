import { expect, test } from "vitest";
import { wrapOffset } from "@/lib/motion-math";

test("wrapOffset keeps the marquee offset inside [-width, 0)", () => {
  expect(wrapOffset(-5, 100)).toBe(-5);
  expect(wrapOffset(-105, 100)).toBe(-5);
  expect(wrapOffset(5, 100)).toBe(-95);
  expect(wrapOffset(0, 100)).toBe(-100);
});
