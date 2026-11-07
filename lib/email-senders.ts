import nodemailer from "nodemailer";
import { Resend } from "resend";
import { FROM, type Sender } from "./email";

export function sendersFromEnv(env = process.env): { resend?: Sender; gmail?: Sender } {
  const senders: { resend?: Sender; gmail?: Sender } = {};
  if (env.RESEND_API_KEY) {
    const resend = new Resend(env.RESEND_API_KEY);
    senders.resend = async (m) => {
      const { error } = await resend.emails.send({ from: FROM, to: m.to, subject: m.subject, html: m.html, text: m.text, replyTo: m.replyTo });
      if (error) throw new Error(error.message);
    };
  }
  if (env.EMAIL_USER && env.EMAIL_APP_PASSWORD) {
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user: env.EMAIL_USER, pass: env.EMAIL_APP_PASSWORD } });
    senders.gmail = async (m) => {
      await transport.sendMail({ from: `Ritik Thakur <${env.EMAIL_USER}>`, to: m.to, subject: m.subject, html: m.html, text: m.text, replyTo: m.replyTo });
    };
  }
  return senders;
}
