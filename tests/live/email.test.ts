// Live check of email providers. Run: LIVE=1 npx vitest run tests/live/email.test.ts
import nodemailer from "nodemailer";
import { expect, test } from "vitest";
import { autoReplyEmail } from "@/lib/email";
import { sendersFromEnv } from "@/lib/email-senders";

const live = process.env.LIVE === "1";
if (live) process.loadEnvFile(".env");

test.skipIf(!live)("Resend can send from contact@ritikthakur.com.np", async () => {
  const { resend } = sendersFromEnv();
  expect(resend).toBeDefined();
  await resend!({ to: "delivered@resend.dev", ...autoReplyEmail("Test") });
}, 30_000);

test.skipIf(!live)("Gmail SMTP login works (nothing is sent)", async () => {
  const t = nodemailer.createTransport({ service: "gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD } });
  expect(await t.verify()).toBe(true);
}, 30_000);
