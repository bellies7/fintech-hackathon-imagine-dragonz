// ============================================================
// lib/search-engine.ts — SEARCH / FILTER LAYER
// ============================================================
// Pure logic — operates only on a list of SearchArticle objects.
// Has no knowledge of where articles came from (dummy data, API, etc).
//
// Topic normalisation: user input like "Federal Reserve" or
// "federal reserve" is converted to "federal-reserve" before
// comparison. This must match the format that Guardian API tags
// are stored in (lowercase, hyphen-separated slugs).
// ============================================================

import type { SearchArticle } from "./article-source"

/**
 * Normalises a human-readable topic string into the lowercase
 * hyphenated slug format used in article topic arrays.
 *
 * "Federal Reserve" → "federal-reserve"
 * "OIL"             → "oil"
 * " Interest Rates" → "interest-rates"
 */
export function normaliseTopic(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "-")
}

/**
 * Filters a list of articles using union (OR) and intersection (AND) logic.
 *
 * @param articles    - The full pool of articles to search.
 * @param mainTopics  - Union set: include any article whose topics share
 *                      at least one entry with this set.
 * @param addTopics   - Intersection set (optional): further restrict results
 *                      so only articles containing ALL of these topics are kept.
 *
 * @returns Filtered articles with all five fields: title, source, date, topics, url.
 */
export function searchArticles(
  articles: SearchArticle[],
  mainTopics: string[],
  addTopics: string[] = [],
): SearchArticle[] {
  const normalMain = mainTopics.map(normaliseTopic)
  const normalAdd = addTopics.map(normaliseTopic)

  return articles.filter((article) => {
    const articleTopics = article.topics.map((t) => t.toLowerCase())

    const matchesUnion = normalMain.some((mt) => articleTopics.includes(mt))
    if (!matchesUnion) return false

    if (normalAdd.length > 0) {
      const matchesIntersection = normalAdd.every((at) =>
        articleTopics.includes(at),
      )
      if (!matchesIntersection) return false
    }

    return true
  })
}
