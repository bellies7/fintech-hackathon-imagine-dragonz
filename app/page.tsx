// ============================================================
// app/page.tsx — OVERVIEW PAGE (route: "/")
// ============================================================
// Layout (top to bottom):
//   1. Page header
//   2. Search bar
//   3. KPI stat tiles
//   4. Topic Distribution (left) | Currently Tracking (right)
//   5. For You (full width below)
// ============================================================

"use client"

import { useState } from "react"
import { defaultStarredTopics } from "@/lib/mock-data"
import StatsBar from "@/components/StatsBar"
import SearchBar from "@/components/SearchBar"
import MostTalkedAbout from "@/components/MostTalkedAbout"
import HighRiskAlertsPanel from "@/components/HighRiskAlertsPanel"
import ArticleFeed from "@/components/ArticleFeed"
import ForYouPanel from "@/components/ForYouPanel"

export default function OverviewPage() {
  // Lifted up here so StatsBar and ArticleFeed both see the same count
  const [starredTopics, setStarredTopics] = useState<string[]>(defaultStarredTopics)

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor macroeconomic developments and market-moving news
        </p>
      </div>
      <SearchBar
        starredTopics={starredTopics}
        onTrackTopic={(topic) => {
          if (!starredTopics.includes(topic)) {
            setStarredTopics([...starredTopics, topic])
          }
        }}
      />
      {/* Pass the live count down to StatsBar */}
      <StatsBar trackedCount={starredTopics.length} />
      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-5 items-start">
        <div className="space-y-5">
          <MostTalkedAbout />
          <HighRiskAlertsPanel />
        </div>
        {/* Pass state down so ArticleFeed can update it */}
        <ArticleFeed
          starredTopics={starredTopics}
          setStarredTopics={setStarredTopics}
        />
      </div>
      <ForYouPanel />
    </div>
  )
}