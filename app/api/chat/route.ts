import { handleChat } from "@/lib/chat-handler";
import { providersFromEnv } from "@/lib/chat-providers";
import { createRateLimiter } from "@/lib/rate-limit";

const allow = createRateLimiter({ limit: 10, windowMs: 60_000 });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const body = await req.json().catch(() => null);
  const { status, body: json } = await handleChat(body, ip, { providers: providersFromEnv(), allow });
  return Response.json(json, { status });
}
