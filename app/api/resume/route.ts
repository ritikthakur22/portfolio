import { sendWithFallback } from "@/lib/email";
import { sendersFromEnv } from "@/lib/email-senders";
import { createRateLimiter } from "@/lib/rate-limit";
import { handleResumeRequest } from "@/lib/resume-handler";
import { verifyTurnstile } from "@/lib/turnstile";

const allow = createRateLimiter({ limit: 3, windowMs: 3_600_000 });

/** Full resume (with phone) from a private link if configured, otherwise the public phone-free copy. */
async function getResume(origin: string) {
  const res = await fetch(process.env.RESUME_FULL_URL || new URL("/resume.pdf", origin));
  const content = Buffer.from(await res.arrayBuffer());
  if (!res.ok || content.subarray(0, 4).toString() !== "%PDF" || content.length > 5_000_000) throw new Error("resume unavailable");
  return { filename: "Ritik_Thakur_Resume.pdf", content };
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const body = await req.json().catch(() => null);
  const senders = sendersFromEnv();
  try {
    const { status, body: json } = await handleResumeRequest(body, ip, {
      allow,
      verify: verifyTurnstile,
      send: (mail) => sendWithFallback(mail, senders),
      getResume: () => getResume(req.url),
      to: process.env.CONTACT_TO || "contact@ritikthakur.com.np",
    });
    return Response.json(json, { status });
  } catch {
    return Response.json({ error: "Couldn't send the resume right now. Please email me directly." }, { status: 503 });
  }
}
