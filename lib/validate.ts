export type ContactData = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactData, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the form (inline errors) and the API route (trust boundary). */
export function validateContact(input: unknown): { ok: true; data: ContactData } | { ok: false; errors: ContactErrors } {
  const raw = (input ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const data = { name: str(raw.name), email: str(raw.email), message: str(raw.message) };
  const errors: ContactErrors = {};
  if (data.name.length < 2 || data.name.length > 80) errors.name = "Enter your name (2 to 80 characters).";
  if (!EMAIL.test(data.email) || data.email.length > 120) errors.email = "Enter a valid email address.";
  if (data.message.length < 10 || data.message.length > 2000) errors.message = "Write a message between 10 and 2000 characters.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
