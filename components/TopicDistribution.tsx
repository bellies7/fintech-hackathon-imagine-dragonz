// ============================================================
// components/TopicDistribution.tsx — MOST TALKED ABOUT
// ============================================================
// Shows top 5 topics by mention volume for each region.
// Left side: donut chart with labels pointing to each segment.
// Right side: legend with topic name + mention count.
// Region tabs at the top switch between Global/Singapore/etc.
//
// To edit topics, update the "regionData" object below.
// To add a new region, add a new key with a topics array.
// ============================================================

"use client"

import { useState } from "react"

// ── DATA ──────────────────────────────────────────────────────
// Each region has up to 5 topics with a label, count, and color.
// "count" = mention volume shown in the legend on the right.
// Colors are intentionally distinct — avoid similar shades.
const regionData: Record<string, { label: string; count: number; color: string }[]> = {
  Global: [
    { label: "GDP & Growth",    count: 386, color: "#a855f7" }, // purple
    { label: "Interest Rates",  count: 357, color: "#f97316" }, // orange
    { label: "Tech & AI",       count: 212, color: "#22c55e" }, // green
    { label: "Trade & Tariffs", count: 188, color: "#eab308" }, // yellow
    { label: "Digital Assets",  count: 178, color: "#3b82f6" }, // blue
  ],
  Singapore: [
    { label: "Housing Market",  count: 310, color: "#a855f7" },
    { label: "Interest Rates",  count: 280, color: "#f97316" },
    { label: "Tech & AI",       count: 195, color: "#22c55e" },
    { label: "Trade & Tariffs", count: 160, color: "#eab308" },
    { label: "GDP & Growth",    count: 140, color: "#3b82f6" },
  ],
  Americas: [
    { label: "Federal Reserve", count: 420, color: "#a855f7" },
    { label: "Inflation",       count: 390, color: "#f97316" },
    { label: "Tech & AI",       count: 230, color: "#22c55e" },
    { label: "GDP & Growth",    count: 200, color: "#eab308" },
    { label: "Digital Assets",  count: 175, color: "#3b82f6" },
  ],
  Europe: [
    { label: "ECB Policy",      count: 340, color: "#a855f7" },
    { label: "Energy Markets",  count: 310, color: "#f97316" },
    { label: "Inflation",       count: 270, color: "#22c55e" },
    { label: "GDP & Growth",    count: 190, color: "#eab308" },
    { label: "Trade & Tariffs", count: 155, color: "#3b82f6" },
  ],
  Asia: [
    { label: "China Economy",   count: 400, color: "#a855f7" },
    { label: "Trade & Tariffs", count: 355, color: "#f97316" },
    { label: "Tech & AI",       count: 240, color: "#22c55e" },
    { label: "Digital Assets",  count: 195, color: "#eab308" },
    { label: "GDP & Growth",    count: 170, color: "#3b82f6" },
  ],
}

const regions = Object.keys(regionData)

// ── DONUT CHART ───────────────────────────────────────────────
// Draws an SVG donut. Each segment = one topic's share of total mentions.
// Labels are positioned around the outside of the chart.
function DonutChart({ topics }: { topics: { label: string; count: number; color: string }[] }) {
  const size = 220
  const cx = size / 2
  const cy = size / 2
  const r = 70
  const strokeWidth = 28
  const gap = 0
  const circumference = 2 * Math.PI * r

  const total = topics.reduce((sum, t) => sum + t.count, 0)

  let cumulativeDeg = 0
const segments = topics.map(t => {
  const pct      = t.count / total
  const degrees  = pct * 360
  const startDeg = cumulativeDeg
  cumulativeDeg += degrees
  const midDeg   = startDeg + degrees / 2

  const dash   = (degrees / 360) * circumference
  const offset = -(startDeg / 360) * circumference

  const labelR = r + strokeWidth / 2 + 22
  const rad    = (midDeg - 90) * (Math.PI / 180)
  const labelX = Math.round(cx + labelR * Math.cos(rad))
  const labelY = Math.round(cy + labelR * Math.sin(rad))

  const shortLabel = t.label.length > 10 ? t.label.slice(0, 9) + "..." : t.label

  return { ...t, dash, offset, labelX, labelY, shortLabel }
})

  return (
    <svg width={size} height={size} className="block">
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
      {/* Coloured segments */}
      {segments.map(s => (
        <circle key={s.label} cx={cx} cy={cy} r={r}
          fill="none" stroke={s.color} strokeWidth={strokeWidth}
          strokeDasharray={`${s.dash} ${circumference - s.dash}`}
          strokeDashoffset={circumference / 4 + s.offset}
          strokeLinecap="butt"
        />
      ))}
      {/* Outside labels */}
      {segments.map(s => (
        <text key={s.label + "-lbl"} x={s.labelX} y={s.labelY}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="#94a3b8">
          {s.shortLabel}
        </text>
      ))}
    </svg>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function TopicDistribution() {
  const [activeRegion, setActiveRegion] = useState("Global")
  const topics = regionData[activeRegion]

  return (
    <div className="bg-card border border-border rounded-xl p-5">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Most Talked About</h2>
          <p className="text-[10px] text-muted-foreground">Top 5 topics by mention volume</p>
        </div>
      </div>

      {/* ── REGION TABS ─────────────────────────────────────────
          To add a region: add a key to regionData above — tabs auto-update */}
      <div className="flex gap-2 mt-4 mb-6 flex-wrap">
        {regions.map(region => (
          <button key={region} onClick={() => setActiveRegion(region)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeRegion === region
                ? "bg-primary text-white"
                : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}>
            {region}
          </button>
        ))}
      </div>

      {/* ── CHART + LEGEND ────────────────────────────────────── */}
      <div className="flex items-center gap-10">
        {/* Donut chart on the left */}
        <div className="flex-shrink-0">
          <DonutChart topics={topics} />
        </div>

        {/* Legend on the right: coloured dot + topic name + count */}
        <div className="flex-1 space-y-4">
          {topics.map(t => (
            <div key={t.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color }} />
                <span className="text-sm text-foreground">{t.label}</span>
              </div>
              {/* Mention count — right aligned */}
              <span className="text-sm text-muted-foreground tabular-nums">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
