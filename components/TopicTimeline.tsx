// ============================================================
// components/TopicTimeline.tsx — TOPIC COVERAGE LINE CHART
// ============================================================
// Shows coverage intensity over time as a multi-line SVG chart.
// Each topic = one coloured line. X axis = months, Y axis = intensity.
//
// TODO (backend): Replace the "timelineData" mock below with
// GET /api/statistics/topic-timeline?range=12months
// Expected format: array of { month, [topicName]: number } objects
// ============================================================

"use client"

import { useState } from "react"

// ── MOCK DATA ─────────────────────────────────────────────────
// Each entry = one month. Each topic key = coverage intensity (0–100).
// TODO (backend): Replace with API response
const timelineData = [
  { month: "Jan 25", "Federal Reserve": 65, "Inflation": 80, "Interest Rates": 70, "China Economy": 40, "Geopolitical Tensions": 35 },
  { month: "Feb 25", "Federal Reserve": 60, "Inflation": 75, "Interest Rates": 68, "China Economy": 45, "Geopolitical Tensions": 40 },
  { month: "Mar 25", "Federal Reserve": 72, "Inflation": 70, "Interest Rates": 72, "China Economy": 50, "Geopolitical Tensions": 55 },
  { month: "Apr 25", "Federal Reserve": 68, "Inflation": 65, "Interest Rates": 65, "China Economy": 55, "Geopolitical Tensions": 60 },
  { month: "May 25", "Federal Reserve": 75, "Inflation": 60, "Interest Rates": 70, "China Economy": 60, "Geopolitical Tensions": 65 },
  { month: "Jun 25", "Federal Reserve": 80, "Inflation": 55, "Interest Rates": 75, "China Economy": 58, "Geopolitical Tensions": 70 },
  { month: "Jul 25", "Federal Reserve": 70, "Inflation": 50, "Interest Rates": 68, "China Economy": 65, "Geopolitical Tensions": 68 },
  { month: "Aug 25", "Federal Reserve": 65, "Inflation": 48, "Interest Rates": 62, "China Economy": 72, "Geopolitical Tensions": 72 },
  { month: "Sep 25", "Federal Reserve": 78, "Inflation": 45, "Interest Rates": 80, "China Economy": 78, "Geopolitical Tensions": 75 },
  { month: "Oct 25", "Federal Reserve": 82, "Inflation": 42, "Interest Rates": 85, "China Economy": 82, "Geopolitical Tensions": 78 },
  { month: "Nov 25", "Federal Reserve": 75, "Inflation": 40, "Interest Rates": 78, "China Economy": 88, "Geopolitical Tensions": 80 },
  { month: "Dec 25", "Federal Reserve": 70, "Inflation": 38, "Interest Rates": 72, "China Economy": 85, "Geopolitical Tensions": 82 },
]

// Topics shown on the chart with their colours
const topics = [
  { key: "Federal Reserve",       color: "#a855f7" },
  { key: "Inflation",             color: "#f97316" },
  { key: "Interest Rates",        color: "#22c55e" },
  { key: "China Economy",         color: "#f43f5e" },
  { key: "Geopolitical Tensions", color: "#3b82f6" },
]

// ── SVG LINE CHART ────────────────────────────────────────────
// Draws the chart as an inline SVG. No external library needed.
function LineChart({ visibleTopics }: { visibleTopics: string[] }) {
  const W = 700        // SVG canvas width
  const H = 220        // SVG canvas height
  const padL = 32      // Left padding (for Y axis labels)
  const padR = 16
  const padT = 16
  const padB = 32      // Bottom padding (for X axis labels)
  const chartW = W - padL - padR
  const chartH = H - padT - padB
  const months = timelineData.length

  // Convert data value (0–100) to Y pixel position
  const toY = (val: number) => padT + chartH - (val / 100) * chartH

  // Convert month index to X pixel position
  const toX = (i: number) => padL + (i / (months - 1)) * chartW

  // Build SVG polyline points string for one topic
  const buildPath = (topicKey: string) =>
    timelineData.map((d, i) => `${toX(i)},${toY((d as unknown as Record<string, number>)[topicKey] ?? 0)}`).join(" ")

  // Y axis gridlines at 0, 25, 50, 75, 100
  const yGridLines = [0, 25, 50, 75, 100]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* ── Y AXIS GRID LINES ─────────────────────────────── */}
      {yGridLines.map(val => (
        <g key={val}>
          <line
            x1={padL} y1={toY(val)} x2={W - padR} y2={toY(val)}
            stroke="#1e293b" strokeWidth={1}
          />
          <text x={padL - 6} y={toY(val) + 4} textAnchor="end" fontSize="9" fill="#475569">
            {val}
          </text>
        </g>
      ))}

      {/* ── X AXIS MONTH LABELS ───────────────────────────── */}
      {timelineData.map((d, i) => (
        // Only show every other label to avoid crowding
        i % 2 === 0 && (
          <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#475569">
            {d.month}
          </text>
        )
      ))}

      {/* ── TOPIC LINES ───────────────────────────────────── */}
      {topics
        .filter(t => visibleTopics.includes(t.key))
        .map(t => (
          <polyline
            key={t.key}
            points={buildPath(t.key)}
            fill="none"
            stroke={t.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))
      }

      {/* ── DATA POINT DOTS ───────────────────────────────── */}
      {topics
        .filter(t => visibleTopics.includes(t.key))
        .map(t =>
          timelineData.map((d, i) => (
            <circle
              key={`${t.key}-${i}`}
              cx={toX(i)}
              cy={toY((d as unknown as Record<string, number>)[t.key] ?? 0)}
              r={3}
              fill={t.color}
            />
          ))
        )
      }
    </svg>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function TopicTimeline() {
  // Which topics are currently toggled on in the legend
  const [visibleTopics, setVisibleTopics] = useState<string[]>(topics.map(t => t.key))

  const toggleTopic = (key: string) => {
    setVisibleTopics(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground">Topic Hotness Timeline</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Coverage intensity over time — click legend to show/hide topics
        </p>
      </div>

      {/* ── LEGEND — toggle topics on/off ────────────────────── */}
      <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-border">
        {topics.map(t => {
          const active = visibleTopics.includes(t.key)
          return (
            <button key={t.key} onClick={() => toggleTopic(t.key)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                active ? "opacity-100" : "opacity-30"
              }`}
              style={{
                color: t.color,
                borderColor: `${t.color}50`,
                background: `${t.color}12`,
              }}>
              {/* Coloured dot */}
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
              {t.key}
            </button>
          )
        })}
      </div>

      {/* ── SVG CHART ──────────────────────────────────────────
          LineChart renders the actual graph */}
      <div className="px-5 py-4">
        <LineChart visibleTopics={visibleTopics} />
      </div>

    </div>
  )
}
