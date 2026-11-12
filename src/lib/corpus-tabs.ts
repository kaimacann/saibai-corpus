/** The corpus views that may be selected or shared through a URL. */
export const CORPUS_TAB_IDS = [
  "Chronological",
  "Geographic",
  "Genealogical",
] as const;

/** A valid tab identifier accepted by the corpus dashboard. */
export type CorpusTabId = (typeof CORPUS_TAB_IDS)[number];

/** Resolves a shared tab URL while rejecting unknown values and retaining the configured fallback.
 * @param search - Query string from the current URL.
 * @param defaultTab - Configured tab to use when the URL has no valid selection.
 * @returns A supported corpus tab identifier.
 */
export function resolveCorpusTab(
  search: string,
  defaultTab: string,
): CorpusTabId {
  const requestedTab = new URLSearchParams(search).get("tab");
  if (isCorpusTabId(requestedTab)) return requestedTab;
  if (isCorpusTabId(defaultTab)) return defaultTab;
  return "Chronological";
}

/**
 * Narrows a query or configuration value to a supported corpus tab identifier.
 * @param value Candidate tab value, including `null` when the URL omits it.
 * @returns Whether the candidate is one of the configured tab identifiers.
 */
function isCorpusTabId(value: string | null): value is CorpusTabId {
  for (const tabId of CORPUS_TAB_IDS) {
    if (tabId === value) return true;
  }
  return false;
}
