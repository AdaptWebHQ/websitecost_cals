/**
 * Simple server-side rate limiter using in-memory Map.
 *
 * Tracks request counts per key (e.g., IP or userId) within a rolling window.
 * Suitable for single-instance Next.js deployments. For distributed/edge
 * deployments, replace with Upstash Redis or similar.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** Maximum requests allowed within the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

/**
 * Check whether a given key has exceeded the rate limit.
 * Returns { allowed: true } if within limit, { allowed: false, retryAfter } if exceeded.
 */
export function checkRateLimit(
  key: string,
  { limit, windowSeconds }: RateLimitOptions
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count < limit) {
    entry.count += 1;
    return { allowed: true };
  }

  const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
  return { allowed: false, retryAfter };
}

/**
 * Derive a rate limit key from the request headers.
 * Uses x-forwarded-for or falls back to a generic key.
 */
export function getRateLimitKey(prefix: string, identifier?: string): string {
  if (identifier) return `${prefix}:${identifier}`;
  return `${prefix}:anonymous`;
}
