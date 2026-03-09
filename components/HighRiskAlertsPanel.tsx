"use client"

import { useState } from "react"
import { articles, type Article } from "@/lib/mock-data"
import NewsDetailPanel from "./NewsDetailPanel"

const HIGH_RISK_LIMIT = 3

function selectHighRiskArticles(all: Article[]): Article[] {
  return all.filter((a) => a.heat === "Hot").slice(0, HIGH_RISK_LIMIT)
}

export default function HighRiskAlertsPanel() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const highRiskArticles = selectHighRiskArticles(articles)
  const total = highRiskArticles.length

  const regionCounts = highRiskArticles.reduce<Record<string, number>>(
    (acc, article) => {
      const key = article.region
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    },
    {},
  )

  const regions = Object.entries(regionCounts).sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1]
    }
    return a[0].localeCompare(b[0])
  })

  const handleSelect = (article: Article) => {
    setSelectedArticle(article)
  }

  const handleClose = () => {
    setSelectedArticle(null)
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86 3.82 16a1.75 1.75 0 0 0 1.53 2.57h13.3A1.75 1.75 0 0 0 20.18 16l-6.47-12.14a1.75 1.75 0 0 0-3.42 0Z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              High Risk Alerts
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Top {total} {"“Hot”"} macro risks from your watchlist
            </p>
          </div>
        </div>
          <span className="text-xs px-2 py-1 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 font-medium">
            {total} active
          </span>
        </div>

        {regions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {regions.map(([region, count]) => (
              <span
                key={region}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-muted/40 text-[10px] text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {region}
                <span className="text-[9px] text-muted-foreground/70">
                  · {count}
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {highRiskArticles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => handleSelect(article)}
              className="w-full text-left rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2.5 space-y-1.5 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  {article.theme}
                </p>
                <span className="text-[10px] text-red-300">
                  {article.region} · {article.date}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground leading-snug">
                {article.title}
              </p>
              <p className="text-[11px] text-red-100/90 leading-snug">
                {article.riskImplication}
              </p>
            </button>
          ))}
        </div>
      </div>

      <NewsDetailPanel article={selectedArticle} onClose={handleClose} />
    </>
  )
}

