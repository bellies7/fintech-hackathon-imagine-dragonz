"use client"

import { useState, type DragEvent } from "react"
import { articles, availableTopics, type Article } from "@/lib/mock-data"
import NewsDetailPanel from "./NewsDetailPanel"

const heatConfig = {
  Hot:  { border: "border-red-500/40",    badge: "bg-red-500/15 text-red-400 border-red-500/30",    icon: "\uD83D\uDD25" },
  Warm: { border: "border-orange-500/40", badge: "bg-orange-500/15 text-orange-400 border-orange-500/30", icon: "\u2600\uFE0F" },
  Cool: { border: "border-blue-500/40",   badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",   icon: "\u2744\uFE0F" },
}

type Props = {
  starredTopics: string[]
  setStarredTopics: (topics: string[]) => void
}

export default function ArticleFeed({ starredTopics, setStarredTopics }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const filteredArticles = articles.filter(a =>
    starredTopics.some(topic => a.tags.includes(topic) || a.topic === topic)
  )

  const unstarredTopics = availableTopics.filter(t => !starredTopics.includes(t))

  const removeTopic = (topic: string) =>
    setStarredTopics(starredTopics.filter(t => t !== topic))

  const addTopic = (topic: string) => {
    if (!starredTopics.includes(topic)) {
      setStarredTopics([...starredTopics, topic])
    }
    setDropdownOpen(false)
  }

  const handleDragOver = (e: DragEvent) => {
    if (e.dataTransfer.types.includes("application/x-topic")) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const topic = e.dataTransfer.getData("application/x-topic")
    if (topic) {
      addTopic(topic)
    }
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-visible">

        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Currently Tracking</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Articles from your starred topics</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
            >
              <span className="text-base leading-none">+</span> Add Topic
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="max-h-52 overflow-y-auto">
                  {unstarredTopics.length === 0 ? (
                    <p className="text-xs text-muted-foreground px-3 py-2">All topics added</p>
                  ) : (
                    unstarredTopics.map(topic => (
                      <button key={topic} onClick={() => addTopic(topic)}
                        className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors">
                        {topic}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Starred topic pills — drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-wrap gap-2 px-5 py-3 border-b transition-all duration-200 ${
            isDragOver
              ? "border-primary bg-primary/5 border-dashed border-2 py-4"
              : "border-border"
          }`}
        >
          {isDragOver && (
            <div className="w-full flex items-center justify-center gap-2 py-1">
              <svg className="w-4 h-4 text-primary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-xs font-medium text-primary">Drop here to track</span>
              <svg className="w-4 h-4 text-primary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )}
          {starredTopics.map(topic => (
            <span key={topic}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary">
              \u2605 {topic}
              <button
                onClick={() => removeTopic(topic)}
                className="transition-colors ml-0.5 text-primary/60 hover:text-primary"
              >
                \u00d7
              </button>
            </span>
          ))}
          {starredTopics.length === 0 && !isDragOver && (
            <p className="text-xs text-muted-foreground">No topics starred \u2014 click "+ Add Topic" or drag from suggested topics</p>
          )}
        </div>

        {/* Article cards */}
        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
          {filteredArticles.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No articles found for your starred topics.
            </div>
          ) : (
            filteredArticles.map(article => {
              const heat = heatConfig[article.heat]
              return (
                <div key={article.id} onClick={() => setSelectedArticle(article)}
                  className="mx-4 my-3 rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-muted/30 transition-colors group">

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{article.source}</span>
                      <span className="text-xs text-muted-foreground">&bull;</span>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>

                  <h4 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>

                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
                    <span className="text-red-400 text-xs mt-0.5">\u26A0</span>
                    <p className="text-xs text-red-400 leading-relaxed">{article.riskImplication}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md border border-border text-muted-foreground bg-muted/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${heat.badge}`}>
                      {heat.icon} {article.heat}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <NewsDetailPanel article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </>
  )
}
