/** Cloudflare Turnstile server check. With no secret configured the check is skipped (honeypot + rate limit still apply). */
export async function verifyTurnstile(token: string, ip: string, secret = process.env.TURNSTILE_SECRET_KEY, fetchImpl: typeof fetch = fetch) {
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    return ((await res.json()) as { success?: boolean }).success === true;
  } catch {
    return false;
  }
}
