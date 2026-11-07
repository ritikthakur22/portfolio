import { expect, test } from "@playwright/test";

test("skip link is the first focusable element and targets main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toHaveText("Skip to content");
  await expect(focused).toHaveAttribute("href", "#main");
  await expect(page.locator("main#main")).toHaveCount(1);
});

test("theme toggle switches between dark and light", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(html).toHaveClass(/light/);
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(html).toHaveClass(/dark/);
});

test("nav has section links", async ({ page, isMobile }) => {
  test.skip(isMobile, "section links collapse into the palette on small screens");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  for (const name of ["Work", "About", "Experience", "Contact"]) {
    await expect(nav.getByRole("link", { name })).toBeVisible();
  }
});
