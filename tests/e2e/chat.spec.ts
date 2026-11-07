import { expect, test } from "@playwright/test";

test("launcher sits bottom-right and opens the chat", async ({ page }) => {
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Open chat: ask about Ritik" });
  const box = (await launcher.boundingBox())!;
  const vp = page.viewportSize()!;
  expect(box.x + box.width).toBeGreaterThan(vp.width - 120);
  expect(box.y + box.height).toBeGreaterThan(vp.height - 120);
  await launcher.click();
  const dialog = page.getByRole("dialog", { name: "Chat about Ritik" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("textbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(launcher).toBeFocused();
});

test("dragging moves the launcher without opening the chat", async ({ page, isMobile }) => {
  test.skip(isMobile, "mouse drag");
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Open chat: ask about Ritik" });
  const before = (await launcher.boundingBox())!;
  await page.mouse.move(before.x + 32, before.y + 32);
  await page.mouse.down();
  await page.mouse.move(before.x - 100, before.y - 50, { steps: 5 });
  await page.mouse.move(before.x - 200, before.y - 100, { steps: 5 });
  await page.mouse.up();
  const after = (await launcher.boundingBox())!;
  expect(before.x - after.x).toBeGreaterThan(150);
  await expect(page.getByRole("dialog", { name: "Chat about Ritik" })).toBeHidden();
});

test("typing ritik makes the bot wave", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard easter egg");
  await page.goto("/");
  await page.locator("body").click({ position: { x: 5, y: 300 } });
  await page.keyboard.type("ritik");
  await expect(page.locator('[data-wave="true"]')).toHaveCount(1);
});

test("chat shows the fallback when no AI keys are set", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat: ask about Ritik" }).click();
  await page.getByRole("button", { name: "What has he built?" }).click();
  await expect(page.getByRole("dialog", { name: "Chat about Ritik" })).toContainText(/resting|eSkool/);
});

for (const path of ["/projects/eskool", "/no-such-page"]) {
  test(`chat launcher is available on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Open chat: ask about Ritik" })).toBeVisible();
  });
}
