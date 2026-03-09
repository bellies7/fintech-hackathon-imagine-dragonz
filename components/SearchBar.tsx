// ============================================================
// components/SearchBar.tsx — OR / AND TOPIC SEARCH
// ============================================================
// UI layer for the article search tool.
//
// On mount, calls getArticles() once to populate the local article
// pool. All filtering is then done locally via searchArticles()
// without re-fetching.
//
// getArticles() can later accept a user query string passed from
// a search input if the Guardian API integration adds live querying.
// ============================================================

"use client"

import { useState, useMemo, useEffect } from "react"
import { getArticles, type SearchArticle } from "@/lib/article-source"
import { searchArticles } from "@/lib/search-engine"

const SUGGESTED_TOPICS = [
  "Inflation", "Energy", "Oil", "US", "China", "Economy",
  "Interest Rates", "Federal Reserve", "Central Bank", "Europe",
  "UK", "Fiscal Policy", "Technology", "Equities", "Geopolitics",
  "OPEC", "Real Estate", "Singapore", "Growth", "Trade", "ASEAN",
  "Monetary Policy",
]

export default function SearchBar() {
  const [articles, setArticles] = useState<SearchArticle[]>([])
  const [orTopics, setOrTopics] = useState<string[]>([])
  const [andTopics, setAndTopics] = useState<string[]>([])
  const [orInput, setOrInput] = useState("")
  const [andInput, setAndInput] = useState("")

  useEffect(() => {
    setArticles(getArticles())
  }, [])

  const results = useMemo(() => {
    if (orTopics.length === 0 && andTopics.length === 0) return null
    return searchArticles(articles, orTopics, andTopics)
  }, [articles, orTopics, andTopics])

  const orSuggestions = SUGGESTED_TOPICS.filter(
    (t) =>
      !orTopics.includes(t) &&
      !andTopics.includes(t) &&
      t.toLowerCase().includes(orInput.toLowerCase()) &&
      orInput.length > 0,
  )
  const andSuggestions = SUGGESTED_TOPICS.filter(
    (t) =>
      !orTopics.includes(t) &&
      !andTopics.includes(t) &&
      t.toLowerCase().includes(andInput.toLowerCase()) &&
      andInput.length > 0,
  )

  const addOrTopic = (t: string) => {
    if (!orTopics.includes(t)) setOrTopics([...orTopics, t])
    setOrInput("")
  }
  const addAndTopic = (t: string) => {
    if (!andTopics.includes(t)) setAndTopics([...andTopics, t])
    setAndInput("")
  }
  const removeOrTopic = (t: string) =>
    setOrTopics(orTopics.filter((x) => x !== t))
  const removeAndTopic = (t: string) =>
    setAndTopics(andTopics.filter((x) => x !== t))

  const handleClear = () => {
    setOrTopics([])
    setAndTopics([])
    setOrInput("")
    setAndInput("")
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Search Articles
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        {/* OR input */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-foreground">
              Include any of these topics
            </label>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">
              OR
            </span>
          </div>
          <div className="relative">
            <div className="min-h-[44px] flex flex-wrap gap-1.5 items-center p-2 rounded-lg border border-input bg-input">
              {orTopics.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-primary text-xs"
                >
                  {t}
                  <button
                    onClick={() => removeOrTopic(t)}
                    className="hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={orInput}
                onChange={(e) => setOrInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && orInput.trim() && addOrTopic(orInput.trim())
                }
                placeholder={
                  orTopics.length === 0 ? "Type and press Enter..." : "Add more..."
                }
                className="flex-1 min-w-[100px] bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            {orSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-10 overflow-hidden">
                {orSuggestions.map((t) => (
                  <button
                    key={t}
                    onClick={() => addOrTopic(t)}
                    className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AND input */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-foreground">
              Narrow by — must include all
            </label>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">
              AND
            </span>
          </div>
          <div className="relative">
            <div className="min-h-[44px] flex flex-wrap gap-1.5 items-center p-2 rounded-lg border border-input bg-input">
              {andTopics.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs"
                >
                  {t}
                  <button
                    onClick={() => removeAndTopic(t)}
                    className="hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={andInput}
                onChange={(e) => setAndInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  andInput.trim() &&
                  addAndTopic(andInput.trim())
                }
                placeholder={
                  andTopics.length === 0
                    ? "Type and press Enter..."
                    : "Add more..."
                }
                className="flex-1 min-w-[100px] bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            {andSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-10 overflow-hidden">
                {andSuggestions.map((t) => (
                  <button
                    key={t}
                    onClick={() => addAndTopic(t)}
                    className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clear button */}
        <div className="flex gap-2">
          {(orTopics.length > 0 || andTopics.length > 0) && (
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-xs font-medium text-foreground">
            {results.length} {results.length === 1 ? "article" : "articles"}{" "}
            found
          </p>

          {results.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                No articles match your current filters.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try removing some topics or broadening your search.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {results.map((article) => (
                <a
                  key={article.url}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">
                      {article.source}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {article.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground bg-muted/30"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
