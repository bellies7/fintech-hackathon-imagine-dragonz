// ============================================================
// components/NewsDetailPanel.tsx — ARTICLE DETAIL SIDE PANEL
// ============================================================
// Slides in from the right as an overlay when an article is clicked.
// Shows: heat badge, region, date, theme, title, summary,
//        risk implication, tags, source link, and expandable timeline.
//
// Props:
//   article — the Article object to display (null = panel closed)
//   onClose — function called when user clicks X or outside panel
// ============================================================

"use client"

import { useState } from "react"
import { type Article } from "@/lib/mock-data"

// Heat badge colours
const heatConfig = {
  Hot:  { bg: "bg-red-500/15",    text: "text-red-500",    border: "border-red-500/30"    },
  Warm: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  Cool: { bg: "bg-blue-500/15",   text: "text-blue-400",   border: "border-blue-500/30"   },
}

const heatIcon = { Hot: "🔥", Warm: "☀️", Cool: "❄️" }

type Props = {
  article: Article | null
  onClose: () => void
}

export default function NewsDetailPanel({ article, onClose }: Props) {
  // Tracks which year rows in the timeline are expanded
  const [expandedYears, setExpandedYears] = useState<number[]>([])

  if (!article) return null

  const heat = heatConfig[article.heat]

  const toggleYear = (year: number) => {
    setExpandedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    )
  }

  return (
    <>
      {/* ── BACKDROP ──────────────────────────────────────────
          Dark overlay behind the panel. Click to close. */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── PANEL ─────────────────────────────────────────────
          Slides in from the right. Fixed width 480px.
          Scrollable if content is long. */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-background border-l border-border z-50 overflow-y-auto shadow-2xl">

        {/* ── HEADER ROW ────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
          <span className="text-sm font-semibold text-foreground">News Detail</span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* ── META BADGES: heat, region, date ────────────── */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Heat badge */}
            <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${heat.bg} ${heat.text} ${heat.border}`}>
              {heatIcon[article.heat]} {article.heat.toLowerCase()}
            </span>
            {/* Region badge */}
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
              📍 {article.region}
            </span>
            {/* Date badge */}
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
              🕐 {article.date}
            </span>
          </div>

          {/* ── THEME LABEL ───────────────────────────────────
              Uppercase red label above the title (e.g. "RATES HIGHER FOR LONGER") */}
          <div>
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
              {article.theme}
            </p>
            <h2 className="text-xl font-bold text-foreground leading-snug">
              {article.title}
            </h2>
          </div>

          {/* ── FULL SUMMARY ──────────────────────────────────── */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {article.summary}
          </p>

          {/* ── RISK IMPLICATION BOX ──────────────────────────
              Grey card with warning icon */}
          <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span className="text-sm font-semibold text-foreground">Risk Implication</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {article.riskImplication}
            </p>
          </div>

          {/* ── KEYWORD TAGS ──────────────────────────────────── */}
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground bg-muted/30">
                {tag}
              </span>
            ))}
          </div>

          {/* ── VIEW SOURCE LINK ──────────────────────────────────
              TODO (backend): Replace "#" with article.url from your API */}
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            onClick={e => e.preventDefault()}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View source: {article.source}
          </a>

          {/* ── TIMELINE ──────────────────────────────────────────
              Grouped by year. Click a year row to expand/collapse events.
              TODO (backend): Replace article.timelineEvents with
              fetch('/api/articles/${article.id}/timeline') */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Timeline</span>
            </div>

            <div className="space-y-2">
              {article.timelineEvents.map(yearGroup => {
                const isExpanded = expandedYears.includes(yearGroup.year)
                return (
                  <div key={yearGroup.year} className="border border-border rounded-xl overflow-hidden">

                    {/* ── YEAR ROW (clickable to expand) ──────── */}
                    <button
                      onClick={() => toggleYear(yearGroup.year)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
                    >
                      <span className="text-sm font-semibold text-foreground">{yearGroup.year}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {yearGroup.events.length} events
                        </span>
                        {/* Chevron rotates when expanded */}
                        <svg
                          className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* ── EXPANDED EVENTS ──────────────────────── */}
                    {isExpanded && (
                      <div className="border-t border-border divide-y divide-border">
                        {yearGroup.events.map((event, i) => (
                          <div key={i} className="px-4 py-3 flex gap-3">
                            {/* Blue left border accent */}
                            <div className="w-1 bg-primary/40 rounded-full flex-shrink-0" />
                            <div className="space-y-1 flex-1">
                              {/* Quarter + date */}
                              <p className="text-[10px] text-muted-foreground">
                                {event.quarter} • {event.date}
                              </p>
                              {/* Event title */}
                              <p className="text-sm font-semibold text-foreground">{event.title}</p>
                              {/* Summary snippet */}
                              <p className="text-xs text-muted-foreground leading-relaxed">{event.summary}</p>
                              {/* Source link */}
                              {/* TODO (backend): Replace with real article URL */}
                              <a href={event.source} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Source
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
