"use client"

import { useState, useEffect } from "react"
import { articles } from "@/lib/mock-data"

type StatItem = {
  label: string
  value: string
  delta: string
  positive: boolean
  live?: boolean
}

const HIGH_RISK_LIMIT = 3

function computeStats(trackedCount: number): StatItem[] {
  const highRiskCount = Math.min(
    articles.filter((a) => a.heat === "Hot").length,
    HIGH_RISK_LIMIT,
  )

  return [
    { label: "Tracked Topics", value: String(trackedCount), delta: "", positive: true },
    { label: "High Risk Alerts", value: String(highRiskCount), delta: highRiskCount > 0 ? "Needs attention" : "All clear", positive: highRiskCount === 0 },
    { label: "Last Updated", value: "Just now", delta: "Live", positive: true, live: true },
  ]
}

export default function StatsBar({ trackedCount }: { trackedCount?: number }) {
  const [stats, setStats] = useState<StatItem[]>(() =>
    computeStats(trackedCount ?? 0)
  )

  useEffect(() => {
    setStats(computeStats(trackedCount ?? 0))
  }, [trackedCount])

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setStats((prev) =>
        prev.map((s) =>
          s.label === "Last Updated"
            ? {
                ...s,
                value:
                  elapsed < 60
                    ? `${elapsed}s ago`
                    : `${Math.floor(elapsed / 60)}m ago`,
              }
            : s
        )
      )
    }, 10_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="relative bg-card border border-border rounded-xl px-4 py-4 overflow-hidden"
        >
          <div className={`absolute top-0 left-0 right-0 h-[2px] ${
            s.live       ? "bg-gradient-to-r from-primary to-transparent"
            : s.positive ? "bg-gradient-to-r from-emerald-500/50 to-transparent"
            :              "bg-gradient-to-r from-red-500/50 to-transparent"
          }`} />

          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            {s.label}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              {s.value}
            </span>
            <span className={`text-xs font-medium flex items-center gap-1 ${
              s.live       ? "text-primary"
              : s.positive ? "text-emerald-400"
              :              "text-red-400"
            }`}>
              {s.live && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse-dot" />
              )}
              {s.delta}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
