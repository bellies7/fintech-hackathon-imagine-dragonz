// ============================================================
// components/MonthlyTrends.tsx — MONTHLY TREND ANALYSIS
// ============================================================
// Shows % change in coverage per topic as a horizontal bar chart.
// Green bar = coverage going up. Red bar = going down.
//
// To edit, update the "trends" array below.
// ============================================================

"use client"

// ── DATA ──────────────────────────────────────────────────────
// delta: the % change as a string (positive or negative)
// positive: controls bar colour — true = green, false = red
const trends = [
  { topic: "China Economy",         delta: "+25%", positive: true,  description: "Increased focus on manufacturing slowdown and trade implications",  color: "#f97316" },
  { topic: "Geopolitical Tensions", delta: "+18%", positive: true,  description: "Rising coverage of regional conflicts and energy supply risks",      color: "#818cf8" },
  { topic: "Federal Reserve",       delta: "-5%",  positive: false, description: "Slightly reduced attention as rate path becomes clearer",             color: "#7c3aed" },
  { topic: "Inflation",             delta: "-15%", positive: false, description: "Cooling inflation readings leading to decreased media focus",         color: "#a855f7" },
  { topic: "Interest Rates",        delta: "-12%", positive: false, description: "Market pricing in rate stability, less speculation",                  color: "#c084fc" },
]

const maxAbs = 25 // The biggest absolute change — used to scale all bar widths

export default function MonthlyTrends() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground">Monthly Trend Analysis</h3>
        <p className="text-[10px] text-muted-foreground">How topic coverage has shifted in the past 30 days</p>
      </div>

      {/* ── TREND ROWS ──────────────────────────────────────────
          One row per topic */}
      <div className="divide-y divide-border">
        {trends.map((t, i) => {
          // Scale bar width relative to the largest change
          const barWidth = (Math.abs(parseFloat(t.delta)) / maxAbs) * 100
          return (
            <div key={i} className="px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer">

              {/* Topic name + delta number */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold" style={{ color: t.color }}>{t.topic}</span>
                <span className={`text-sm font-bold ${t.positive ? "text-emerald-400" : "text-red-400"}`}>
                  {t.delta}
                </span>
              </div>

              {/* ── PROGRESS BAR ──────────────────────────────
                  Grey track with coloured fill. Width = scaled % */}
              <div className="h-1 bg-muted rounded-full mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.positive ? "bg-emerald-500" : "bg-red-500"}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Description */}
              <p className="text-[10px] text-muted-foreground">{t.description}</p>

            </div>
          )
        })}
      </div>

    </div>
  )
}
