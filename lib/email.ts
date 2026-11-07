import { escapeHtml } from "./escape-html";
import type { ContactData } from "./validate";

export type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };
export type Sender = (mail: Mail) => Promise<void>;
export class EmailUnavailableError extends Error {
  constructor() {
    super("No email provider could send the message");
  }
}

export const FROM = "Ritik Thakur <contact@ritikthakur.com.np>";

/** Resend first; Gmail SMTP if Resend is missing or fails. */
export async function sendWithFallback(mail: Mail, senders: { resend?: Sender; gmail?: Sender }): Promise<"resend" | "gmail"> {
  for (const name of ["resend", "gmail"] as const) {
    const send = senders[name];
    if (!send) continue;
    try {
      await send(mail);
      return name;
    } catch (err) {
      console.error(`[contact] ${name} failed:`, (err as Error).message);
    }
  }
  throw new EmailUnavailableError();
}

const shell = (body: string) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0b0d0e;color:#e8ecea;border-radius:16px">
<p style="margin:0 0 24px;font-size:22px;font-weight:800">RT<span style="color:#2dd4bf">.</span></p>${body}
<p style="margin:32px 0 0;font-size:12px;color:#8e9996">ritikthakur.com.np</p></div>`;

export function notificationEmail(d: ContactData) {
  const name = escapeHtml(d.name);
  return {
    subject: `New message from ${d.name.slice(0, 60)}`,
    text: `From: ${d.name} <${d.email}>\n\n${d.message}`,
    html: shell(
      `<p style="margin:0 0 8px;color:#8e9996">New message from the portfolio contact form</p>
<p style="margin:0 0 16px"><strong>${name}</strong> &lt;${escapeHtml(d.email)}&gt;</p>
<p style="margin:0;white-space:pre-wrap;line-height:1.6">${escapeHtml(d.message)}</p>`,
    ),
  };
}

/** Takes only the name on purpose: echoing visitor text would let anyone send arbitrary content from this address. */
export function autoReplyEmail(name: string) {
  return {
    subject: "Thanks for getting in touch",
    text: `Hi ${name},\n\nThanks for your message. I read every one and usually reply within 48 hours.\n\nRitik Thakur\nhttps://www.ritikthakur.com.np`,
    html: shell(
      `<p style="margin:0 0 16px;font-size:18px">Hi ${escapeHtml(name)},</p>
<p style="margin:0 0 16px;line-height:1.6">Thanks for your message. I read every one and usually reply within 48 hours.</p>
<p style="margin:0;line-height:1.6">Ritik Thakur<br><a href="https://www.ritikthakur.com.np" style="color:#2dd4bf">ritikthakur.com.np</a></p>`,
    ),
  };
}
