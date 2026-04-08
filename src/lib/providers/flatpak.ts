/**
 * Flathub / Flatpak API provider for Linux package search.
 *
 * Uses the public Flathub search API to find Flatpak applications by query.
 * Results are normalised into the shared NormalizedApp shape.
 *
 * Official API:
 *   https://flathub.org/api/v2/search?query=TERM
 */

import { inferCategory, type NormalizedApp } from "./types";

// ---------------------------------------------------------------------------
// Raw API shape (minimal – only fields we use)
// ---------------------------------------------------------------------------

interface FlathubHit {
  id: string;
  name?: string;
  summary?: string;
  description?: string;
  icon?: string;
}

interface FlathubSearchResponse {
  hits?: FlathubHit[];
}

const FLATHUB_SEARCH_URL = "https://flathub.org/api/v2/search";

// ---------------------------------------------------------------------------
// Normaliser
// ---------------------------------------------------------------------------

function normalizeFlathubHit(hit: FlathubHit): NormalizedApp {
  const name = hit.name ?? hit.id;
  const text = `${name} ${hit.summary ?? ""} ${hit.description ?? ""}`;
  return {
    id: `flatpak:${hit.id}`,
    name,
    description: hit.summary ?? hit.description,
    category: inferCategory(text),
    flatpak: hit.id,
  };
}

// ---------------------------------------------------------------------------
// Public search API
// ---------------------------------------------------------------------------

/**
 * Search the Flathub catalog for Flatpak applications matching the query.
 * Returns at most `limit` normalised app records.
 */
export async function searchFlatpak(
  query: string,
  limit = 24,
  signal?: AbortSignal,
): Promise<NormalizedApp[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({ query: query.trim() });
  const res = await fetch(`${FLATHUB_SEARCH_URL}?${params.toString()}`, { signal });

  if (!res.ok) throw new Error(`Flathub API error: ${res.status}`);

  const data: FlathubSearchResponse = await res.json();
  const hits = data.hits ?? [];

  return hits.slice(0, limit).map(normalizeFlathubHit);
}
