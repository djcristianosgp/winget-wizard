/**
 * Homebrew API provider for macOS package search.
 *
 * Fetches the full Homebrew formula and cask catalogs once and caches them
 * in memory for the duration of the session (TTL 24 h).  All subsequent
 * searches are instantaneous client-side filter operations.
 *
 * Official data sources:
 *   https://formulae.brew.sh/api/formula.json
 *   https://formulae.brew.sh/api/cask.json
 */

import { getCached, setCached, TTL_24H } from "@/lib/cache";
import { inferCategory, type NormalizedApp } from "./types";

// ---------------------------------------------------------------------------
// Raw API shapes (minimal – only fields we actually use)
// ---------------------------------------------------------------------------

interface BrewFormula {
  name: string;
  desc?: string;
  homepage?: string;
  versions?: { stable?: string };
}

interface BrewCask {
  token: string;
  name: string[];
  desc?: string;
  homepage?: string;
  version?: string;
}

// ---------------------------------------------------------------------------
// Cache keys
// ---------------------------------------------------------------------------

const CACHE_KEY_FORMULA = "brew:formula:v1";
const CACHE_KEY_CASK = "brew:cask:v1";

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

async function fetchFormulas(signal?: AbortSignal): Promise<BrewFormula[]> {
  const cached = getCached<BrewFormula[]>(CACHE_KEY_FORMULA);
  if (cached) return cached;

  const res = await fetch("https://formulae.brew.sh/api/formula.json", { signal });
  if (!res.ok) throw new Error(`Homebrew formula API error: ${res.status}`);

  const data: BrewFormula[] = await res.json();
  setCached(CACHE_KEY_FORMULA, data, TTL_24H);
  return data;
}

async function fetchCasks(signal?: AbortSignal): Promise<BrewCask[]> {
  const cached = getCached<BrewCask[]>(CACHE_KEY_CASK);
  if (cached) return cached;

  const res = await fetch("https://formulae.brew.sh/api/cask.json", { signal });
  if (!res.ok) throw new Error(`Homebrew cask API error: ${res.status}`);

  const data: BrewCask[] = await res.json();
  setCached(CACHE_KEY_CASK, data, TTL_24H);
  return data;
}

// ---------------------------------------------------------------------------
// Normalisers
// ---------------------------------------------------------------------------

function normalizeFormula(f: BrewFormula): NormalizedApp {
  const text = `${f.name} ${f.desc ?? ""}`;
  return {
    id: `brew:formula:${f.name}`,
    name: f.name,
    description: f.desc,
    version: f.versions?.stable,
    category: inferCategory(text),
    brew: f.name,
  };
}

function normalizeCask(c: BrewCask): NormalizedApp {
  const displayName = c.name[0] ?? c.token;
  const text = `${displayName} ${c.desc ?? ""}`;
  return {
    id: `brew:cask:${c.token}`,
    name: displayName,
    description: c.desc,
    version: c.version,
    category: inferCategory(text),
    brew: `--cask ${c.token}`,
  };
}

// ---------------------------------------------------------------------------
// Public search API
// ---------------------------------------------------------------------------

/**
 * Search the Homebrew catalog (formulae + casks) for packages whose name or
 * description matches the given query string.  Returns at most `limit` items.
 *
 * The full catalog is fetched and cached on the first call; subsequent calls
 * within the same session use the in-memory cache.
 */
export async function searchBrew(
  query: string,
  limit = 24,
  signal?: AbortSignal,
): Promise<NormalizedApp[]> {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();

  const [formulas, casks] = await Promise.all([
    fetchFormulas(signal),
    fetchCasks(signal),
  ]);

  const results: NormalizedApp[] = [];

  for (const f of formulas) {
    if (results.length >= limit) break;
    const haystack = `${f.name} ${f.desc ?? ""}`.toLowerCase();
    if (haystack.includes(q)) results.push(normalizeFormula(f));
  }

  for (const c of casks) {
    if (results.length >= limit) break;
    const displayName = (c.name[0] ?? c.token).toLowerCase();
    const haystack = `${displayName} ${c.token} ${c.desc ?? ""}`.toLowerCase();
    if (haystack.includes(q)) results.push(normalizeCask(c));
  }

  return results;
}
