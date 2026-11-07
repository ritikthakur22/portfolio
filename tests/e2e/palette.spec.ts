import { expect, test } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "keyboard palette is a desktop feature");

const palette = (page: import("@playwright/test").Page) => page.getByRole("dialog", { name: "Command palette" });

test("Ctrl+K opens the palette and Esc closes it", async ({ page }) => {
  await page.goto("/");
  await page.locator("body").click({ position: { x: 5, y: 300 } });
  await page.keyboard.press("Control+k");
  await expect(palette(page)).toBeVisible();
  await expect(palette(page).getByRole("combobox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(palette(page)).toBeHidden();
});

test("slash opens it, but not while typing in a field", async ({ page }) => {
  await page.goto("/");
  await page.locator("body").click({ position: { x: 5, y: 300 } });
  await page.keyboard.press("/");
  await expect(palette(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByLabel("Message").fill("a/b");
  await expect(palette(page)).toBeHidden();
});

test("nav button opens it; filtering and Enter run an action", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open command palette" }).click();
  await expect(palette(page).getByRole("combobox")).toBeFocused();
  await page.keyboard.type("fast");
  const options = palette(page).getByRole("option");
  await expect(options).toHaveCount(1);
  await expect(options.first()).toContainText("FastShare");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/fastshare$/);
});

test("arrow keys move the highlight", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open command palette" }).click();
  const options = palette(page).getByRole("option");
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
});
