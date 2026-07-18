// Simple in-memory server cache with TTL. Suitable for long-running server processes.
type CacheEntry = { value: unknown; expiry: number };

const store = new Map<string, CacheEntry>();

/** Get cached value or undefined if missing/expired */
export function getCache<T = unknown>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

/** Set cache with TTL in seconds (default 1 hour) */
export function setCache(key: string, value: unknown, ttlSec = 3600): void {
  const expiry = Date.now() + ttlSec * 1000;
  store.set(key, { value, expiry });
}

/** Delete a single cache key */
export function delCache(key: string): void {
  store.delete(key);
}

/** Delete keys by prefix (simple wildcard) */
export function delCachePrefix(prefix: string): void {
  for (const k of Array.from(store.keys())) {
    if (k.startsWith(prefix)) store.delete(k);
  }
}

/** Clear entire cache (useful for tests) */
export function clearCache(): void {
  store.clear();
}

export default { getCache, setCache, delCache, delCachePrefix, clearCache };
