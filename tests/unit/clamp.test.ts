import { expect, test } from "vitest";
import { clampPosition } from "@/lib/clamp";

test("keeps the chat icon inside the viewport", () => {
  expect(clampPosition(1800, 1000, 390, 844)).toEqual({ x: 318, y: 772 });
  expect(clampPosition(-50, -50, 390, 844)).toEqual({ x: 8, y: 8 });
  expect(clampPosition(100, 200, 390, 844)).toEqual({ x: 100, y: 200 });
});
