export type ChatMessage = { role: "user" | "assistant"; content: string };
/** Returns the reply text or throws; one per AI provider, tried in order. */
export type Provider = (messages: ChatMessage[]) => Promise<string>;
export type ChatResult = { status: number; body: { reply: string } | { error: string } };

export const FALLBACK_REPLY = "Chat's resting right now. You can reach Ritik through the contact form below.";
export const REFUSAL = "I can only answer questions about Ritik Thakur, his work and his projects. Try asking about his apps, skills or experience.";

// Answers about Ritik never need code, and must never contain his private number.
const unsafe = (reply: string) => reply.includes("```") || reply.replace(/\D/g, "").includes("9840239154");
const MAX_CHARS = 500;
const KEEP = 6;

const GREETING = /^(hi+|hello+|hey+|hiya|yo|namaste|namaskar|good (morning|afternoon|evening|day)|sup|what'?s up)\b[\s!.,?]*(there|bot)?[\s!.,?]*$/i;
const THANKS = /^(thanks|thank you|thx|ty|ok(ay)?|cool|great|nice|awesome)\b.*$/i;

/** Instant replies for greetings and thanks, so small talk never reaches a model (or gets refused). */
export function smallTalkReply(text: string): string | null {
  const t = text.trim();
  if (t.length > 40) return null;
  if (GREETING.test(t)) return "Hi! I'm Ritik's portfolio assistant. Ask me about his projects, skills, experience or how to get in touch.";
  if (THANKS.test(t)) return "You're welcome! Anything else you'd like to know about Ritik?";
  return null;
}

function parse(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const ok = messages.every(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() && m.content.length <= MAX_CHARS,
  );
  return ok ? (messages as ChatMessage[]).slice(-KEEP) : null;
}

export async function handleChat(body: unknown, ip: string, deps: { providers: Provider[]; allow: (key: string) => boolean; guard?: (text: string) => Promise<boolean> }): Promise<ChatResult> {
  const messages = parse(body);
  if (!messages) return { status: 400, body: { error: `Messages must be 1 to ${MAX_CHARS} characters.` } };
  if (!deps.allow(ip)) return { status: 429, body: { error: "You're sending messages quickly. Try again in a minute." } };
  const quick = smallTalkReply(messages[messages.length - 1].content);
  if (quick) return { status: 200, body: { reply: quick } };
  if (deps.guard) {
    try {
      if (await deps.guard(messages[messages.length - 1].content)) return { status: 200, body: { reply: REFUSAL } };
    } catch {
      // guard unavailable: the instructions and output check still apply
    }
  }
  for (const provider of deps.providers) {
    try {
      const reply = (await provider(messages)).trim();
      if (reply) return { status: 200, body: { reply: unsafe(reply) ? REFUSAL : reply } };
    } catch {
      // try the next provider
    }
  }
  return { status: 503, body: { error: FALLBACK_REPLY } };
}
