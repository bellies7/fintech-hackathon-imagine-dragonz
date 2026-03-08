// ============================================================
// app/statistics/page.tsx — STATISTICS PAGE (/statistics)
// ============================================================
// Layout: Topic Timeline (full width) on top,
// then Topic Hotness + Monthly Trends left, Key Events right.
// ============================================================

import TopicTimeline from "@/components/TopicTimeline"
import TopicHotness from "@/components/TopicHotness"
import MonthlyTrends from "@/components/MonthlyTrends"
import KeyEvents from "@/components/KeyEvents"

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-7">

      {/* ── PAGE HEADER ─────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Statistics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track topic popularity and coverage intensity over time
          </p>
        </div>
        <span className="text-xs text-muted-foreground bg-card border border-border rounded-md px-3 py-1.5">
          Jan 2025 — Dec 2025
        </span>
      </div>

      {/* ── TOPIC TIMELINE — full width line chart ──────────── */}
      <TopicTimeline />

      {/* ── 2-COLUMN GRID ───────────────────────────────────────
          Left: Topic Hotness + Monthly Trends stacked
          Right: Key Events timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <TopicHotness />
          <MonthlyTrends />
        </div>
        <KeyEvents />
      </div>

    </div>
  )
}
