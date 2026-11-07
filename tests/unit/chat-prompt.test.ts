import { expect, test } from "vitest";
import { buildSystemPrompt } from "@/lib/chat-prompt";
import { featuredProjects } from "@/content/projects";

test("prompt carries the facts and the rules, never the phone number", () => {
  const p = buildSystemPrompt();
  for (const proj of featuredProjects) expect(p).toContain(proj.name);
  expect(p).toContain("contact@ritikthakur.com.np");
  expect(p).toMatch(/only/i);
  expect(p).toMatch(/never invent/i);
  expect(p).not.toContain("9840239154");
});

import { REFUSAL } from "@/lib/chat-handler";

test("prompt includes the exact refusal sentence and any GitHub repos passed in", () => {
  const p = buildSystemPrompt([{ name: "Echo_Loop", description: "DAF app", url: "https://github.com/ritikthakur22/Echo_Loop", language: "TypeScript" }]);
  expect(p).toContain(REFUSAL);
  expect(p).toContain("Echo_Loop");
});
