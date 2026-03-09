// ============================================================
// lib/topic-popularity.ts — POPULARITY LOGIC LAYER
// ============================================================
// Pure function — operates only on a list of SearchArticle objects.
// Has no knowledge of where articles came from (dummy data, API, etc).
//
// When the Guardian API is live, articles will come from
// getArticles() and this function needs no changes.
//
// Open question: Guardian's pillarName field will need a mapping
// to the "Global" / "Asia" / "Singapore" region values used here.
// That mapping lives in the data layer (article-source.ts), not here.
// ============================================================

import type { SearchArticle } from "./article-source"

export type TopicPopularityEntry = {
  topic: string
  count: number
  percentage: number
}

/**
 * Computes topic popularity from a list of articles, optionally
 * filtered by region.
 *
 * @param articles - The full pool of articles.
 * @param region   - Filter to a specific region. null, "All", or "Global"
 *                   means no filtering (use all articles). "All" and "Global"
 *                   are treated identically.
 *
 * @returns List sorted by count descending. Each entry contains
 *   topic, count, and percentage (float, 2 decimal places).
 */
export function computeTopicPopularity(
  articles: SearchArticle[],
  region: string | null = null,
): TopicPopularityEntry[] {
  const normalRegion = region?.trim() || null

  const filtered =
    normalRegion === null || normalRegion === "All" || normalRegion === "Global"
      ? articles
      : articles.filter((a) => a.region === normalRegion)

  const counter = new Map<string, number>()

  for (const article of filtered) {
    for (const topic of article.topics) {
      counter.set(topic, (counter.get(topic) ?? 0) + 1)
    }
  }

  const totalMentions = Array.from(counter.values()).reduce(
    (sum, c) => sum + c,
    0,
  )

  const entries: TopicPopularityEntry[] = Array.from(counter.entries()).map(
    ([topic, count]) => ({
      topic,
      count,
      percentage: totalMentions > 0
        ? Math.round((count / totalMentions) * 10000) / 100
        : 0,
    }),
  )

  entries.sort((a, b) => b.count - a.count)

  return entries
}
