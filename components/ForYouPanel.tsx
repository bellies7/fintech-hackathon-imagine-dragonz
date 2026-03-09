// ============================================================
// components/ForYouPanel.tsx — FOR YOU
// ============================================================
// Shows personalised article recommendations grouped by theme.
// Each card shows: theme label, topic, article title,
// risk implication, and Hot/Warm/Cool badge.
// Clicking a card opens the NewsDetailPanel overlay.
//
// TODO (backend): Replace mock articles with
// GET /api/recommendations?userId=...
// ============================================================

"use client"

import { useState } from "react"
import { articles, type Article } from "@/lib/mock-data"
import NewsDetailPanel from "./NewsDetailPanel"

const heatConfig = {
  Hot:  { badge: "bg-red-500/15 text-red-400 border-red-500/30",    card: "border-red-500/20",    icon: "🔥" },
  Warm: { badge: "bg-orange-500/15 text-orange-400 border-orange-500/30", card: "border-orange-500/20", icon: "☀️" },
  Cool: { badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",   card: "border-blue-500/20",   icon: "❄️" },
}

export default function ForYouPanel() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4 // ← change this number to show more/fewer cards per page

  // TODO (backend): Replace with GET /api/recommendations
  // For now we just use all articles as recommendations
  const recommendations = articles
  const totalPages = Math.ceil(recommendations.length / itemsPerPage)
  const paginatedArticles = recommendations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden">

        {/* ── PANEL HEADER ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            {/* Sparkle icon */}
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l1.5 4.5L11 9l-4.5 1.5L5 15l-1.5-4.5L-1 9l4.5-1.5L5 3zM19 9l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">For You</h3>
          </div>
          {/* Article count badge */}
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
            {recommendations.length} articles
          </span>
        </div>

        {/* ── RECOMMENDATION CARDS ──────────────────────────────
            One card per article recommendation.
            Click to open the detail panel. */}
        <div className="divide-y divide-border">
          {paginatedArticles.map(article => {
            const heat = heatConfig[article.heat]
            return (
              <div key={article.id} onClick={() => setSelectedArticle(article)}
                className={`px-4 py-4 border-l-2 ${heat.card} cursor-pointer hover:bg-muted/30 transition-colors group`}>

                {/* ── THEME LABEL ─────────────────────────────
                    Uppercase red label e.g. "RATES HIGHER FOR LONGER" */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider leading-tight">
                    {article.theme}
                  </p>
                  {/* Heat badge — top right */}
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 flex-shrink-0 ${heat.badge}`}>
                    {heat.icon} {article.heat}
                  </span>
                </div>

                {/* Topic name */}
                <p className="text-[10px] text-muted-foreground mb-1">{article.topic}</p>

                {/* Article title */}
                <h4 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>

                {/* ── RISK IMPLICATION ────────────────────────
                    Warning icon + one-line risk summary */}
                <div className="flex items-start gap-1.5">
                  <span className="text-muted-foreground text-xs mt-0.5">⚠</span>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {article.riskImplication}
                  </p>
                </div>

                {/* Chevron right — hints the card is clickable */}
                <div className="flex justify-end mt-2">
                  <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>
      </div>

{/* ── PAGINATION ──────────────────────────────────────
    Page dots + prev/next arrows */}
{totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-border">
    <button
      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className="text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors px-2"
    >
      ‹‹ Prev
    </button>
    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
          currentPage === i + 1
            ? "bg-primary text-white"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
      className="text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors px-2"
    >
      Next ››
    </button>
  </div>
)}
      {/* ── NEWS DETAIL PANEL ─────────────────────────────────
          Same panel used by ArticleFeed — shared component */}
      <NewsDetailPanel article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </>
  )
}
