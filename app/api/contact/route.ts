import { handleContact } from "@/lib/contact-handler";
import { sendWithFallback } from "@/lib/email";
import { sendersFromEnv } from "@/lib/email-senders";
import { createRateLimiter } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

const allow = createRateLimiter({ limit: 3, windowMs: 3_600_000 });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const body = await req.json().catch(() => null);
  const senders = sendersFromEnv();
  const { status, body: json } = await handleContact(body, ip, {
    allow,
    verify: verifyTurnstile,
    send: (mail) => sendWithFallback(mail, senders),
    to: process.env.CONTACT_TO || "contact@ritikthakur.com.np",
  });
  return Response.json(json, { status });
}
