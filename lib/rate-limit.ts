// shortcut: in-memory per server instance, so limits reset on cold starts; upgrade to Upstash Redis if abuse appears
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()) => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    const allowed = recent.length < limit;
    if (allowed) recent.push(now);
    hits.set(key, recent);
    return allowed;
  };
}
