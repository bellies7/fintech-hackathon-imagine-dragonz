// ============================================================
// components/TopicHotness.tsx — TOPIC HOTNESS TIMELINE
// ============================================================
// Top section on the Statistics page.
// Groups tracked topics into Trending Up / Cooling Down / Steady.
//
// To change topics, edit the "topics" array.
// To move a topic between groups, change its "trend" field.
// ============================================================

"use client"

// ── DATA ──────────────────────────────────────────────────────
// trend must be exactly: "Trending Up", "Cooling Down", or "Steady"
const topics = [
  { label: "Inflation",             trend: "Cooling Down", color: "#a855f7" },
  { label: "Federal Reserve",       trend: "Steady",       color: "#7c3aed" },
  { label: "Interest Rates",        trend: "Cooling Down", color: "#c084fc" },
  { label: "China Economy",         trend: "Trending Up",  color: "#f97316" },
  { label: "Geopolitical Tensions", trend: "Trending Up",  color: "#818cf8" },
]

// ── TREND CONFIG ──────────────────────────────────────────────
const trendConfig: Record<string, { icon: string; color: string; label: string }> = {
  "Trending Up":  { icon: "↑", color: "text-emerald-400", label: "Gaining more coverage this month" },
  "Cooling Down": { icon: "↓", color: "text-red-400",     label: "Decreasing media attention" },
  "Steady":       { icon: "→", color: "text-orange-400",  label: "Consistent coverage levels" },
}

// Group topics by their trend value
const grouped: Record<string, typeof topics> = {
  "Trending Up":  topics.filter(t => t.trend === "Trending Up"),
  "Cooling Down": topics.filter(t => t.trend === "Cooling Down"),
  "Steady":       topics.filter(t => t.trend === "Steady"),
}

export default function TopicHotness() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">

      {/* ── ALL TOPIC CHIPS ─────────────────────────────────────
          Row showing all tracked topics as coloured pills */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border">
        {topics.map(t => (
          <span key={t.label}
            className="text-xs px-2.5 py-1 rounded-md border"
            style={{ color: t.color, background: `${t.color}15`, borderColor: `${t.color}35` }}>
            {t.label}
          </span>
        ))}
      </div>

      {/* ── 3-COLUMN TREND GROUPS ───────────────────────────────
          One column per trend: Trending Up | Cooling Down | Steady */}
      <div className="grid grid-cols-3 divide-x divide-border">
        {Object.entries(grouped).map(([trend, items]) => {
          const cfg = trendConfig[trend]
          return (
            <div key={trend} className="p-4">
              {/* Column header */}
              <div className="flex items-start gap-1.5 mb-3">
                <span className={`text-base leading-none ${cfg.color}`}>{cfg.icon}</span>
                <div>
                  <p className="text-xs font-medium text-foreground">{trend}</p>
                  <p className="text-[10px] text-muted-foreground">{cfg.label}</p>
                </div>
              </div>
              {/* Topic chips in this group */}
              <div className="flex flex-col gap-1.5">
                {items.map(t => (
                  <span key={t.label}
                    className="text-xs px-2.5 py-1 rounded-md border w-fit"
                    style={{ color: t.color, background: `${t.color}12`, borderColor: `${t.color}30` }}>
                    {t.label}
                  </span>
                ))}
                {/* Show a dash if no topics in this group */}
                {items.length === 0 && <span className="text-[10px] text-muted-foreground">—</span>}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
