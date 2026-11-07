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
