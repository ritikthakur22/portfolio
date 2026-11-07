import { createGroq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, type LanguageModel } from "ai";
import { buildSystemPrompt } from "./chat-prompt";
import type { ChatMessage, Provider } from "./chat-handler";

const ask = (model: LanguageModel): Provider => async (messages: ChatMessage[]) => {
  const { text } = await generateText({ model, instructions: buildSystemPrompt(), messages, maxOutputTokens: 400, timeout: 8000, maxRetries: 0 });
  return text;
};

/** Groq first, then an OpenRouter free model. Providers without a key are skipped. */
export function providersFromEnv(env = process.env): Provider[] {
  const list: Provider[] = [];
  if (env.GROQ_API_KEY) list.push(ask(createGroq({ apiKey: env.GROQ_API_KEY })(env.GROQ_MODEL || "llama-3.3-70b-versatile")));
  if (env.OPENROUTER_API_KEY && env.OPENROUTER_MODEL) list.push(ask(createOpenRouter({ apiKey: env.OPENROUTER_API_KEY })(env.OPENROUTER_MODEL)));
  return list;
}
