import { describe, it, expect } from "vitest"
import { getDummyArticles } from "../article-source"
import { searchArticles, normaliseTopic } from "../search-engine"

const articles = getDummyArticles()

describe("normaliseTopic", () => {
  it("lowercases and hyphenates multi-word input", () => {
    expect(normaliseTopic("Federal Reserve")).toBe("federal-reserve")
  })

  it("handles already normalised input", () => {
    expect(normaliseTopic("oil")).toBe("oil")
  })

  it("trims whitespace", () => {
    expect(normaliseTopic("  Interest Rates  ")).toBe("interest-rates")
  })

  it("collapses multiple spaces into a single hyphen", () => {
    expect(normaliseTopic("China   Economy")).toBe("china-economy")
  })
})

describe("searchArticles", () => {
  it("returns only articles tagged 'inflation' when main = {inflation}", () => {
    const results = searchArticles(articles, ["inflation"])
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) {
      expect(r.topics).toContain("inflation")
    }
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe("US inflation rises again")
  })

  it("returns articles tagged inflation OR energy", () => {
    const results = searchArticles(articles, ["inflation", "energy"])
    expect(results.length).toBeGreaterThan(1)
    for (const r of results) {
      const hasMatch =
        r.topics.includes("inflation") || r.topics.includes("energy")
      expect(hasMatch).toBe(true)
    }
    expect(results).toHaveLength(3)
  })

  it("returns articles matching (us OR inflation) AND federal-reserve", () => {
    const results = searchArticles(articles, ["us", "inflation"], [
      "federal-reserve",
    ])
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) {
      const hasUnion =
        r.topics.includes("us") || r.topics.includes("inflation")
      expect(hasUnion).toBe(true)
      expect(r.topics).toContain("federal-reserve")
    }
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe("Fed hints at interest rate hike")
  })

  it("returns economy-tagged articles that also have central-bank", () => {
    const results = searchArticles(articles, ["economy"], ["central-bank"])
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) {
      expect(r.topics).toContain("economy")
      expect(r.topics).toContain("central-bank")
    }
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe("ECB holds rates amid eurozone slowdown")
  })

  it("returns zero results for china + federal-reserve (no overlap)", () => {
    const results = searchArticles(articles, ["china"], ["federal-reserve"])
    expect(results).toHaveLength(0)
  })

  it("handles human-readable topic strings via normalisation", () => {
    const results = searchArticles(articles, ["Federal Reserve"])
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) {
      expect(r.topics).toContain("federal-reserve")
    }
  })

  it("returns empty array when mainTopics is empty", () => {
    const results = searchArticles(articles, [])
    expect(results).toHaveLength(0)
  })

  it("preserves all required output fields on each result", () => {
    const results = searchArticles(articles, ["oil"])
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) {
      expect(r).toHaveProperty("title")
      expect(r).toHaveProperty("source")
      expect(r).toHaveProperty("date")
      expect(r).toHaveProperty("topics")
      expect(r).toHaveProperty("url")
    }
  })
})
