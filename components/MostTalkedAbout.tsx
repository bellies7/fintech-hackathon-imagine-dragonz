// ============================================================
// components/MostTalkedAbout.tsx — MOST TALKED ABOUT TOPICS
// ============================================================
// UI layer for the topic popularity feature.
//
// On mount, calls getArticles() once to populate the local article
// pool. All computation is then done locally via
// computeTopicPopularity() without re-fetching.
//
// The region options list is hardcoded for now. It should later
// be derived dynamically from the dataset once real data is
// flowing from the Guardian API.
// ============================================================

"use client"

import { useState, useMemo, useEffect } from "react"
import { getArticles, type SearchArticle } from "@/lib/article-source"
import { computeTopicPopularity } from "@/lib/topic-popularity"

const TOP_N_TOPICS = 5

const REGION_OPTIONS = ["All", "Global", "Asia", "Singapore"] as const

const BAR_COLORS = ["#a855f7", "#f97316", "#22c55e", "#3b82f6", "#eab308"]

export default function MostTalkedAbout() {
  const [articles, setArticles] = useState<SearchArticle[]>([])
  const [activeRegion, setActiveRegion] = useState<string>("All")

  useEffect(() => {
    setArticles(getArticles())
  }, [])

  const popularity = useMemo(
    () => computeTopicPopularity(articles, activeRegion),
    [articles, activeRegion],
  )

  const topTopics = popularity.slice(0, TOP_N_TOPICS)

  const filteredCount =
    activeRegion === "All" || activeRegion === "Global"
      ? articles.length
      : articles.filter((a) => a.region === activeRegion).length

  const maxCount = topTopics.length > 0 ? topTopics[0].count : 1

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Most Talked About
          </h2>
          <p className="text-[10px] text-muted-foreground">
            Top {TOP_N_TOPICS} topics by mention volume
          </p>
        </div>
      </div>

      {/* Region tabs */}
      <div className="flex gap-2 mt-4 mb-4 flex-wrap">
        {REGION_OPTIONS.map((region) => (
          <button
            key={region}
            onClick={() => setActiveRegion(region)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeRegion === region
                ? "bg-primary text-white"
                : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Article count */}
      <p className="text-[10px] text-muted-foreground mb-4">
        Showing {filteredCount}{" "}
        {filteredCount === 1 ? "article" : "articles"} in{" "}
        {activeRegion}
      </p>

      {/* Ranked topic bars */}
      {topTopics.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No articles found for this region.
        </p>
      ) : (
        <div className="space-y-3">
          {topTopics.map((entry, i) => {
            const barWidth = Math.max((entry.count / maxCount) * 100, 8)
            const color = BAR_COLORS[i % BAR_COLORS.length]
            return (
              <div key={entry.topic}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">
                    {entry.topic}
                  </span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {entry.count} mentions &middot; {entry.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
