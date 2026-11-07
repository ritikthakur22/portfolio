import { expect, test } from "vitest";
import { escapeHtml } from "@/lib/escape-html";
import { validateContact } from "@/lib/validate";

test("valid input passes, trimmed", () => {
  expect(validateContact({ name: "  Asha  ", email: " asha@example.com ", message: "  Hello there, a project idea.  " })).toEqual({
    ok: true,
    data: { name: "Asha", email: "asha@example.com", message: "Hello there, a project idea." },
  });
});

test("bad fields give per-field errors", () => {
  const r = validateContact({ name: "a", email: "x@", message: "too short" });
  expect(r.ok).toBe(false);
  if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name"]);
  const long = validateContact({ name: "Asha", email: "a@b.co", message: "x".repeat(2001) });
  expect(long.ok).toBe(false);
  expect(validateContact(null).ok).toBe(false);
  expect(validateContact({ name: 5, email: [], message: {} }).ok).toBe(false);
});

test("escapeHtml escapes the five special characters", () => {
  expect(escapeHtml(`<a href="x">&'`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
});
