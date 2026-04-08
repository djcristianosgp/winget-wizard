/**
 * In-memory TTL cache for external API responses.
 * Avoids repeated fetches of large datasets (e.g. Homebrew formula list)
 * within the same session. Cache entries expire after the configured TTL.
 */

export const TTL_24H = 24 * 60 * 60 * 1000;
export const TTL_1H = 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs: number = TTL_24H): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function deleteCached(key: string): void {
  store.delete(key);
}

export function clearCache(): void {
  store.clear();
}
