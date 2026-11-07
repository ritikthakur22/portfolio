import { expect, test } from "@playwright/test";

test("empty submit shows an error for each field", async ({ page }) => {
  await page.goto("/#contact");
  const form = page.getByRole("form", { name: "Contact form" });
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByText("Enter your name")).toBeVisible();
  await expect(form.getByText("Enter a valid email address.")).toBeVisible();
  await expect(form.getByText("Write a message between")).toBeVisible();
  await expect(form.getByLabel("Email")).toHaveAttribute("aria-invalid", "true");
});

test("valid submit reports success (instant bot-speed submit sends no email)", async ({ page }) => {
  await page.goto("/#contact");
  const form = page.getByRole("form", { name: "Contact form" });
  await form.getByLabel("Name").fill("Playwright Test");
  await form.getByLabel("Email").fill("test@example.com");
  await form.getByLabel("Message").fill("Automated test message, please ignore.");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByRole("status")).toContainText("Message sent");
});
