import { cacheLife } from "next/cache";
import { handleChat } from "@/lib/chat-handler";
import { buildSystemPrompt } from "@/lib/chat-prompt";
import { guardFromEnv, providersFromEnv } from "@/lib/chat-providers";
import { fetchPublicRepos } from "@/lib/github";
import { createRateLimiter } from "@/lib/rate-limit";

const allow = createRateLimiter({ limit: 10, windowMs: 60_000 });

async function repos() {
  "use cache";
  cacheLife("days");
  return fetchPublicRepos(process.env.GITHUB_TOKEN);
}

const nepalTime = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kathmandu", dateStyle: "full", timeStyle: "short" }).format(new Date());

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const body = await req.json().catch(() => null);
  const { status, body: json } = await handleChat(body, ip, { providers: providersFromEnv(buildSystemPrompt(await repos(), nepalTime())), allow, guard: guardFromEnv() });
  return Response.json(json, { status });
}
