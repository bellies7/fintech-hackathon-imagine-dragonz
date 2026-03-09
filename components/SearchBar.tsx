// ============================================================
// components/SearchBar.tsx — OR / AND TOPIC SEARCH
// ============================================================
// Two input boxes for topic search:
//   OR box  — returns articles matching ANY selected topic
//   AND box — returns articles matching ALL selected topics
// Press Enter or click "+ Add topic" to add a tag.
// Click × on a tag to remove it.
// ============================================================

"use client"

import { useState } from "react"

// ── AVAILABLE TOPICS ──────────────────────────────────────────
// These appear as suggestions when typing. Add more here as needed.
const availableTopics = [
  "Federal Reserve", "Inflation", "Interest Rates", "China Economy",
  "Geopolitical Tensions", "Labor Market", "Oil Prices", "Treasury Yields",
  "Emerging Markets", "Supply Chain", "Energy Markets", "Housing Market",
  "Monetary Policy", "Global Trade", "Volatility Index",
]

export default function SearchBar() {
  // ── STATE ────────────────────────────────────────────────────
  const [orTopics, setOrTopics]   = useState<string[]>([]) // Tags in the OR box
  const [andTopics, setAndTopics] = useState<string[]>([]) // Tags in the AND box
  const [orInput, setOrInput]     = useState("")           // Text typed in OR input
  const [andInput, setAndInput]   = useState("")           // Text typed in AND input
  const [hasSearched, setHasSearched] = useState(false)

  // Filtered suggestions — hide topics already selected
  const orSuggestions  = availableTopics.filter(t => !orTopics.includes(t) && !andTopics.includes(t) && t.toLowerCase().includes(orInput.toLowerCase()) && orInput.length > 0)
  const andSuggestions = availableTopics.filter(t => !orTopics.includes(t) && !andTopics.includes(t) && t.toLowerCase().includes(andInput.toLowerCase()) && andInput.length > 0)

  // ── ADD / REMOVE HELPERS ─────────────────────────────────────
  const addOrTopic  = (t: string) => { if (!orTopics.includes(t))  setOrTopics([...orTopics, t]);  setOrInput("") }
  const addAndTopic = (t: string) => { if (!andTopics.includes(t)) setAndTopics([...andTopics, t]); setAndInput("") }
  const removeOrTopic  = (t: string) => setOrTopics(orTopics.filter(x => x !== t))
  const removeAndTopic = (t: string) => setAndTopics(andTopics.filter(x => x !== t))

  const handleClear = () => {
    setOrTopics([]); setAndTopics([]); setOrInput(""); setAndInput(""); setHasSearched(false)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Search Articles</h2>
      </div>

      {/* ── INPUT ROW: OR | AND | Button ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">

        {/* ── OR INPUT ──────────────────────────────────────────
            Blue/purple tags. Press Enter to add a topic. */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-foreground">Include any of these topics</label>
            {/* OR badge */}
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">OR</span>
          </div>
          <div className="relative">
            {/* Tag input area */}
            <div className="min-h-[44px] flex flex-wrap gap-1.5 items-center p-2 rounded-lg border border-input bg-input">
              {/* Render each selected OR tag */}
              {orTopics.map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-primary text-xs">
                  {t}
                  <button onClick={() => removeOrTopic(t)} className="hover:text-white transition-colors">×</button>
                </span>
              ))}
              {/* Text input */}
              <input
                value={orInput}
                onChange={e => setOrInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && orInput.trim() && addOrTopic(orInput.trim())}
                placeholder={orTopics.length === 0 ? "Type and press Enter..." : "Add more..."}
                className="flex-1 min-w-[100px] bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            {/* Dropdown suggestions */}
            {orSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-10 overflow-hidden">
                {orSuggestions.map(t => (
                  <button key={t} onClick={() => addOrTopic(t)}
                    className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── AND INPUT ─────────────────────────────────────────
            Orange tags. Same behaviour as OR box. */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-foreground">Must include all of these topics</label>
            {/* AND badge */}
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">AND</span>
          </div>
          <div className="relative">
            <div className="min-h-[44px] flex flex-wrap gap-1.5 items-center p-2 rounded-lg border border-input bg-input">
              {andTopics.map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs">
                  {t}
                  <button onClick={() => removeAndTopic(t)} className="hover:text-white transition-colors">×</button>
                </span>
              ))}
              <input
                value={andInput}
                onChange={e => setAndInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && andInput.trim() && addAndTopic(andInput.trim())}
                placeholder={andTopics.length === 0 ? "Type and press Enter..." : "Add more..."}
                className="flex-1 min-w-[100px] bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            {andSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-10 overflow-hidden">
                {andSuggestions.map(t => (
                  <button key={t} onClick={() => addAndTopic(t)}
                    className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SEARCH + CLEAR BUTTONS ──────────────────────────── */}
        <div className="flex gap-2">
          <button
            onClick={() => setHasSearched(true)}
            disabled={orTopics.length === 0 && andTopics.length === 0}
            className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
          {(orTopics.length > 0 || andTopics.length > 0) && (
            <button onClick={handleClear}
              className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── SEARCH RESULTS ──────────────────────────────────────
          Only shown after the user clicks Search */}
      {hasSearched && (
        <div className="pt-4 border-t border-border space-y-2">
          <p className="text-xs font-medium text-foreground">
            Showing results for: {[...orTopics, ...andTopics].join(", ")}
          </p>
          <p className="text-xs text-muted-foreground">
            Connect to a real data source to show live results here.
          </p>
        </div>
      )}

    </div>
  )
}
