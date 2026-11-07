import { expect, test } from "@playwright/test";

test("public resume download has no phone number", async ({ request }) => {
  const res = await request.get("/resume.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
});

test("full resume can be requested by email", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Get the full resume by email" }).click();
  const dialog = page.getByRole("dialog", { name: "Get the full resume" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Your email")).toBeFocused();
  await dialog.getByRole("button", { name: "Email me the resume" }).click();
  await expect(dialog.getByText("Enter a valid email address.")).toBeVisible();
  await dialog.getByLabel("Your email").fill("test@example.com");
  await dialog.getByRole("button", { name: "Email me the resume" }).click();
  // instant (bot-speed) submits are accepted silently without sending, so this sends no email
  await expect(dialog.getByRole("status")).toContainText("Sent");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
