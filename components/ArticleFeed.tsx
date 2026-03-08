// ============================================================
// components/ArticleFeed.tsx — CURRENTLY TRACKING
// ============================================================
// Shows articles filtered by the user's starred topics.
// Features:
//   - Starred topic pills with × to remove
//   - "+ Add Topic" dropdown to add more
//   - Articles filtered to match starred topics
//   - Hot/Warm/Cool colour-coded article cards
//   - Click any article to open the NewsDetailPanel overlay
//
// TODO (backend): Replace mock data imports with API calls.
// See lib/mock-data.ts for details on what to replace.
// ============================================================

"use client"

import { useState } from "react"
import { articles, availableTopics, type Article } from "@/lib/mock-data"
import NewsDetailPanel from "./NewsDetailPanel"

// Heat level colour config — controls card border + badge colour
const heatConfig = {
  Hot:  { border: "border-red-500/40",    badge: "bg-red-500/15 text-red-400 border-red-500/30",    icon: "🔥" },
  Warm: { border: "border-orange-500/40", badge: "bg-orange-500/15 text-orange-400 border-orange-500/30", icon: "☀️" },
  Cool: { border: "border-blue-500/40",   badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",   icon: "❄️" },
}

type Props = {
  starredTopics: string[]
  setStarredTopics: (topics: string[]) => void
}
  // ── STATE ─────────────────────────────────────────────────
  // Starred topics — starts with defaults, user can add/remove
  // TODO (backend): Load initial value from GET /api/user/starred-topics
export default function ArticleFeed({ starredTopics, setStarredTopics }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  // ── DERIVED DATA ──────────────────────────────────────────
  // Filter articles to only those matching at least one starred topic
  // TODO (backend): Replace with GET /api/articles?topics=...
  const filteredArticles = articles.filter(a =>
    starredTopics.some(topic => a.tags.includes(topic) || a.topic === topic)
  )

  const unstarredTopics = availableTopics.filter(t => !starredTopics.includes(t))

const removeTopic = (topic: string) =>
  setStarredTopics(starredTopics.filter(t => t !== topic))

const addTopic = (topic: string) => {
  setStarredTopics([...starredTopics, topic])
  setDropdownOpen(false)
    // TODO (backend): POST /api/user/starred-topics { topic }
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-visible">

        {/* ── PANEL HEADER ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Currently Tracking</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Articles from your starred topics</p>
          </div>

          {/* ── ADD TOPIC DROPDOWN ────────────────────────────
              Click button to open/close the topic list */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
            >
              <span className="text-base leading-none">+</span> Add Topic
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="max-h-52 overflow-y-auto">
                  {unstarredTopics.length === 0 ? (
                    <p className="text-xs text-muted-foreground px-3 py-2">All topics added</p>
                  ) : (
                    unstarredTopics.map(topic => (
                      <button key={topic} onClick={() => addTopic(topic)}
                        className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors">
                        {topic}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── STARRED TOPIC PILLS ───────────────────────────────
            Star icon + topic name + × to remove */}
        <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-border">
          {starredTopics.map(topic => (
            <span key={topic}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary">
              ★ {topic}
              <button onClick={() => removeTopic(topic)}
                className="hover:text-white transition-colors ml-0.5 text-primary/60 hover:text-primary">
                ×
              </button>
            </span>
          ))}
          {starredTopics.length === 0 && (
            <p className="text-xs text-muted-foreground">No topics starred — click "+ Add Topic" to start tracking</p>
          )}
        </div>

        {/* ── ARTICLE CARDS ─────────────────────────────────────
            Click to open detail panel. */}
        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
          {filteredArticles.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No articles found for your starred topics.
            </div>
          ) : (
            filteredArticles.map(article => {
              const heat = heatConfig[article.heat]
              return (
                <div key={article.id} onClick={() => setSelectedArticle(article)}
                  className={`mx-4 my-3 rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-muted/30 transition-colors group`}>

                  {/* Source + date + external icon */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{article.source}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>

                  {/* Headline */}
                  <h4 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>

                  {/* ── RISK IMPLICATION ──────────────────────── */}
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
                    <span className="text-red-400 text-xs mt-0.5">⚠</span>
                    <p className="text-xs text-red-400 leading-relaxed">{article.riskImplication}</p>
                  </div>

                  {/* Tags + heat badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md border border-border text-muted-foreground bg-muted/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${heat.badge}`}>
                      {heat.icon} {article.heat}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── NEWS DETAIL PANEL ─────────────────────────────────
          Overlays the page when an article is clicked.
          Null article = panel is hidden. */}
      <NewsDetailPanel article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </>
  )
}
