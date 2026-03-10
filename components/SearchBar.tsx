"use client"

import {
  useState,
  useMemo,
  useEffect,
  useRef,
  type KeyboardEvent,
  type DragEvent,
} from "react"
import { getArticles, type SearchArticle } from "@/lib/article-source"
import { searchArticles } from "@/lib/search-engine"

import { articles as mockArticles } from "@/lib/mock-data"

const TOPIC_GROUPS: { label: string; topics: string[] }[] = [
  {
    label: "Macro",
    topics: ["Inflation", "Interest Rates", "Monetary Policy", "Fiscal Policy", "Central Bank", "Federal Reserve", "Economy", "Growth"],
  },
  {
    label: "Regions",
    topics: ["US", "China", "Europe", "UK", "Singapore", "ASEAN"],
  },
  {
    label: "Sectors",
    topics: ["Energy", "Oil", "OPEC", "Technology", "Equities", "Real Estate", "Geopolitics", "Trade"],
  },
]

const ALL_TOPICS = TOPIC_GROUPS.flatMap((g) => g.topics)

const TRENDING_TOPICS = new Set(
  mockArticles
    .filter((a) => a.heat === "Hot")
    .flatMap((a) => [a.topic, ...a.tags])
)

type FilterMode = "or" | "and"

type Props = {
  starredTopics?: string[]
  onTrackTopic?: (topic: string) => void
}

export default function SearchBar({ starredTopics = [], onTrackTopic }: Props) {
  const [articles, setArticles] = useState<SearchArticle[]>([])
  const [orTopics, setOrTopics] = useState<string[]>([])
  const [andTopics, setAndTopics] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<FilterMode>("or")
  const [isFocused, setIsFocused] = useState(false)
  const [draggingTopic, setDraggingTopic] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const allSelected = [...orTopics, ...andTopics]
  const queryString = allSelected.length > 0
    ? allSelected.join(" OR ")
    : undefined

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getArticles(queryString).then((data) => {
      if (!cancelled) {
        setArticles(data)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [queryString])

  const results = useMemo(() => {
    if (orTopics.length === 0 && andTopics.length === 0) return null
    return searchArticles(articles, orTopics, andTopics)
  }, [articles, orTopics, andTopics])

  const availableTopicsSet = new Set(
    ALL_TOPICS.filter((t) => !allSelected.includes(t)),
  )

  const filterByInput = (t: string) =>
    input.length === 0 || t.toLowerCase().includes(input.toLowerCase())

  const filteredGroups = TOPIC_GROUPS.map((group) => ({
    ...group,
    topics: group.topics.filter(
      (t) => availableTopicsSet.has(t) && filterByInput(t),
    ),
  })).filter((group) => group.topics.length > 0)

  const addTopic = (t: string) => {
    if (allSelected.includes(t)) return
    if (mode === "or") {
      setOrTopics((prev) => [...prev, t])
    } else {
      setAndTopics((prev) => [...prev, t])
    }
    setInput("")
    inputRef.current?.focus()
  }

  const removeOrTopic = (t: string) =>
    setOrTopics((prev) => prev.filter((x) => x !== t))
  const removeAndTopic = (t: string) =>
    setAndTopics((prev) => prev.filter((x) => x !== t))

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      addTopic(input.trim())
    }
  }

  const handleClear = () => {
    setOrTopics([])
    setAndTopics([])
    setInput("")
  }

  const handleDragStart = (e: DragEvent, topic: string) => {
    e.dataTransfer.setData("text/plain", topic)
    e.dataTransfer.setData("application/x-topic", topic)
    e.dataTransfer.effectAllowed = "copy"
    setDraggingTopic(topic)
  }

  const handleDragEnd = () => {
    setDraggingTopic(null)
  }

  const hasFilters = orTopics.length > 0 || andTopics.length > 0
  const showTrackHint = onTrackTopic !== undefined

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Search Articles
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Type any topic or pick from suggestions below
          </p>
        </div>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search input with mode toggle */}
      <div className="space-y-3">
        <div
          className={`flex items-center gap-2 rounded-lg border transition-colors ${
            isFocused
              ? "border-primary/50 ring-1 ring-primary/20"
              : "border-input"
          } bg-input px-3 py-2.5`}
        >
          <svg
            className="w-4 h-4 text-muted-foreground shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for any topic..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />

          <div className="flex items-center rounded-full border border-border overflow-hidden shrink-0">
            <button
              onClick={() => setMode("or")}
              className={`px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                mode === "or"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              OR
            </button>
            <button
              onClick={() => setMode("and")}
              className={`px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                mode === "and"
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AND
            </button>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground px-1">
          {mode === "or"
            ? "OR mode — articles matching any selected topic will appear"
            : "AND mode — only articles matching all selected topics will appear"}
        </p>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="space-y-2">
          {orTopics.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-primary/70 uppercase tracking-wider shrink-0">
                Any of
              </span>
              {orTopics.map((t) => (
                <span
                  key={t}
                  className="group flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium transition-colors hover:bg-primary/20"
                >
                  {t}
                  <button
                    onClick={() => removeOrTopic(t)}
                    className="opacity-50 group-hover:opacity-100 hover:text-white transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {andTopics.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-orange-400/70 uppercase tracking-wider shrink-0">
                Must have
              </span>
              {andTopics.map((t) => (
                <span
                  key={t}
                  className="group flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium transition-colors hover:bg-orange-500/20"
                >
                  {t}
                  <button
                    onClick={() => removeAndTopic(t)}
                    className="opacity-50 group-hover:opacity-100 hover:text-white transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggested topics — grouped by category */}
      {filteredGroups.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {input.length > 0 ? "Matching topics" : "Suggested topics"}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {showTrackHint && (
            <p className="text-[10px] text-muted-foreground/60 text-center italic">
              Click to filter · Drag to Currently Tracking
            </p>
          )}

          {filteredGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.topics.map((t) => {
                  const isAlreadyTracked = starredTopics.includes(t)
                  const isTrending = TRENDING_TOPICS.has(t)
                  return (
                    <button
                      key={t}
                      onClick={() => addTopic(t)}
                      draggable={showTrackHint && !isAlreadyTracked}
                      onDragStart={(e) => handleDragStart(e, t)}
                      onDragEnd={handleDragEnd}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 select-none ${
                        draggingTopic === t
                          ? "opacity-50 scale-95"
                          : "hover:scale-[1.03] active:scale-95"
                      } ${
                        isAlreadyTracked
                          ? "border-emerald-500/30 text-emerald-500/60 cursor-default"
                          : isTrending
                            ? "border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 cursor-grab active:cursor-grabbing"
                            : showTrackHint
                              ? `cursor-grab active:cursor-grabbing ${
                                  mode === "or"
                                    ? "border-primary/15 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5"
                                    : "border-orange-500/15 text-muted-foreground hover:text-orange-400 hover:border-orange-500/40 hover:bg-orange-500/5"
                                }`
                              : mode === "or"
                                ? "border-primary/15 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5"
                                : "border-orange-500/15 text-muted-foreground hover:text-orange-400 hover:border-orange-500/40 hover:bg-orange-500/5"
                      }`}
                    >
                      {isAlreadyTracked ? "✓ " : isTrending ? "🔥 " : "+ "}
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {results !== null && (
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-foreground">
              {results.length} {results.length === 1 ? "article" : "articles"}{" "}
              found
            </p>
            {isLoading && (
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            )}
          </div>

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
