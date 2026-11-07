import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, type LanguageModel } from "ai";
import type { ChatMessage, Provider } from "./chat-handler";

const ask =
  (model: LanguageModel, instructions: string, providerOptions?: Parameters<typeof generateText>[0]["providerOptions"]): Provider =>
  async (messages: ChatMessage[]) => {
    const { text } = await generateText({ model, instructions, messages, maxOutputTokens: 800, temperature: 0.2, timeout: 10_000, maxRetries: 0, providerOptions });
    return text;
  };

/**
 * Groq (two models, each with its own free rate limit), then Gemini, then an OpenRouter free model.
 * Providers without a key are skipped.
 */
export function providersFromEnv(instructions: string, env = process.env): Provider[] {
  const list: Provider[] = [];
  if (env.GROQ_API_KEY) {
    const groq = createGroq({ apiKey: env.GROQ_API_KEY });
    list.push(ask(groq(env.GROQ_MODEL || "openai/gpt-oss-120b"), instructions, { groq: { reasoningEffort: "low" } }));
    list.push(ask(groq(env.GROQ_MODEL_2 || "qwen/qwen3.8-27b"), instructions, { groq: { reasoningEffort: "none" } }));
  }
  if (env.GEMINI_API_KEY)
    list.push(
      ask(createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY })(env.GEMINI_MODEL || "gemini-3.1-flash-lite"), instructions, {
        google: { thinkingConfig: { thinkingBudget: 0 } },
      }),
    );
  if (env.OPENROUTER_API_KEY) list.push(ask(createOpenRouter({ apiKey: env.OPENROUTER_API_KEY })(env.OPENROUTER_MODEL || "openrouter/free"), instructions));
  return list;
}

/** Llama Prompt Guard on Groq: true when the message looks like a jailbreak or prompt injection. */
export function guardFromEnv(env = process.env): ((text: string) => Promise<boolean>) | undefined {
  if (!env.GROQ_API_KEY) return undefined;
  const model = createGroq({ apiKey: env.GROQ_API_KEY })("meta-llama/llama-prompt-guard-2-86m");
  return async (text) => {
    const { text: score } = await generateText({ model, prompt: text, timeout: 4000, maxRetries: 0 });
    return Number(score) > 0.5;
  };
}
