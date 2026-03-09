// ============================================================
// components/KeyEvents.tsx — KEY EVENTS TIMELINE
// ============================================================
// Right column on the Statistics page.
// Vertical timeline of major market events.
// Each event has a date, title, description, and topic tags.
//
// To add/edit events, update the "events" array.
// Events are shown most recent first (top to bottom).
// ============================================================

"use client"

// ── DATA ──────────────────────────────────────────────────────
const events = [
  {
    date: "Feb 2025",
    title: "Fed Rate Decision",
    description: "Federal Reserve holds rates steady, signaling confidence in soft landing trajectory",
    tags: ["Federal Reserve", "Interest Rates"],
    tagColors: ["#7c3aed", "#c084fc"],
  },
  {
    date: "Jan 2025",
    title: "China PMI Data Release",
    description: "Manufacturing PMI contracts for fifth consecutive month, raising global growth concerns",
    tags: ["China Economy", "Emerging Markets"],
    tagColors: ["#f97316", "#818cf8"],
  },
  {
    date: "Dec 2024",
    title: "OPEC+ Production Cut",
    description: "Extended production cuts announced, oil prices surge 4% in response",
    tags: ["Oil Prices", "Inflation", "Energy Markets"],
    tagColors: ["#f59e0b", "#a855f7", "#f59e0b"],
  },
  {
    date: "Nov 2024",
    title: "US Inflation Report",
    description: "CPI drops to 3.2%, below expectations, supporting rate cut thesis",
    tags: ["Inflation", "Federal Reserve"],
    tagColors: ["#a855f7", "#7c3aed"],
  },
]

export default function KeyEvents() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground">Key Events Impact</h3>
        <p className="text-[10px] text-muted-foreground">Major events that influenced topic hotness</p>
      </div>

      {/* ── TIMELINE ────────────────────────────────────────────
          Two-column grid per event:
          Left: date + vertical line + purple dot
          Right: event card */}
      <div className="px-4 py-2">
        {events.map((e, i) => (
          <div key={i} className="grid grid-cols-[72px_1fr] gap-3 py-3">

            {/* ── LEFT: DATE + DOT + LINE ──────────────────── */}
            <div className="relative text-right pt-0.5">
              <span className="text-[10px] text-muted-foreground leading-tight block">{e.date}</span>

              {/* Purple dot on the timeline */}
              <span className="absolute right-[-9px] top-[3px] w-[7px] h-[7px] rounded-full bg-primary shadow-[0_0_6px_var(--color-primary)]" />

              {/* Vertical connecting line — shown for all but the last event */}
              {i < events.length - 1 && (
                <span className="absolute right-[-6px] top-[13px] w-px bg-border" style={{ height: "calc(100% + 24px)" }} />
              )}
            </div>

            {/* ── RIGHT: EVENT CARD ────────────────────────── */}
            <div className="bg-muted/30 border border-border rounded-lg p-3 hover:border-primary/30 transition-colors cursor-pointer">
              {/* Title */}
              <p className="text-xs font-semibold text-foreground mb-1">{e.title}</p>
              {/* Description */}
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{e.description}</p>
              {/* Topic tags */}
              <div className="flex flex-wrap gap-1">
                {e.tags.map((tag, j) => (
                  <span key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded border"
                    style={{ color: e.tagColors[j], background: `${e.tagColors[j]}12`, borderColor: `${e.tagColors[j]}30` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
