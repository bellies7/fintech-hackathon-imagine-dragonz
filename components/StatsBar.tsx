// ============================================================
// components/StatsBar.tsx — 4 KPI STAT TILES
// ============================================================
// Renders the row of 4 stat tiles near the top of the Overview page.
// To change numbers or labels, edit the "stats" array below.
// ============================================================

"use client"

// ── DATA ──────────────────────────────────────────────────────
// Each object = one tile. Edit values here to update the display.
const stats = [
  { label: "Articles Today",   value: "247",    delta: "+12%", positive: true  },
  { label: "Tracked Topics",   value: "8",      delta: "",   positive: true  },
  { label: "High Risk Alerts", value: "3",      delta: "-1",   positive: false },
  { label: "Last Updated",     value: "2m ago", delta: "Live", live: true      },
]

export default function StatsBar({ trackedCount }: { trackedCount?: number }) {
  // Override the Tracked Topics value if a live count is passed in
  const displayStats = stats.map(s =>
    s.label === "Tracked Topics" && trackedCount !== undefined
      ? { ...s, value: String(trackedCount) }
      : s
  )
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {displayStats.map((s) => (
        <div
          key={s.label}
          className="relative bg-card border border-border rounded-xl px-4 py-4 overflow-hidden"
        >
          {/* ── TOP ACCENT LINE ─────────────────────────────────
              Thin coloured strip at the very top of each tile.
              Purple for live, green for positive, red for negative */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] ${
            s.live     ? "bg-gradient-to-r from-primary to-transparent"
            : s.positive ? "bg-gradient-to-r from-emerald-500/50 to-transparent"
            :              "bg-gradient-to-r from-red-500/50 to-transparent"
          }`} />

          {/* ── LABEL ─────────────────────────────────────────── */}
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            {s.label}
          </p>

          {/* ── VALUE + DELTA ─────────────────────────────────── */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              {s.value}
            </span>
            <span className={`text-xs font-medium flex items-center gap-1 ${
              s.live     ? "text-primary"
              : s.positive ? "text-emerald-400"
              :              "text-red-400"
            }`}>
              {/* Pulsing dot for the "Live" tile */}
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
