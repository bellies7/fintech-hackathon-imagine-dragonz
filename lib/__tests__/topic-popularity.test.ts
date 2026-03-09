import { describe, it, expect } from "vitest"
import { getDummyArticles } from "../article-source"
import { computeTopicPopularity } from "../topic-popularity"

const articles = getDummyArticles()

describe("computeTopicPopularity", () => {
  it("uses all articles when region is All", () => {
    const results = computeTopicPopularity(articles, "All")
    const totalCount = results.reduce((sum, r) => sum + r.count, 0)
    const totalTopicMentions = articles.reduce(
      (sum, a) => sum + a.topics.length,
      0,
    )
    expect(totalCount).toBe(totalTopicMentions)
  })

  it("counts only Singapore articles when region is Singapore", () => {
    const results = computeTopicPopularity(articles, "Singapore")
    const sgArticles = articles.filter((a) => a.region === "Singapore")
    const expectedMentions = sgArticles.reduce(
      (sum, a) => sum + a.topics.length,
      0,
    )
    const totalCount = results.reduce((sum, r) => sum + r.count, 0)
    expect(totalCount).toBe(expectedMentions)

    expect(results.find((r) => r.topic === "singapore")).toBeDefined()
    expect(results.find((r) => r.topic === "economy")).toBeDefined()
  })

  it("counts only Asia articles when region is Asia", () => {
    const results = computeTopicPopularity(articles, "Asia")
    const asiaArticles = articles.filter((a) => a.region === "Asia")
    const expectedMentions = asiaArticles.reduce(
      (sum, a) => sum + a.topics.length,
      0,
    )
    const totalCount = results.reduce((sum, r) => sum + r.count, 0)
    expect(totalCount).toBe(expectedMentions)

    expect(results.find((r) => r.topic === "singapore")).toBeUndefined()
  })

  it("returns results sorted by count descending", () => {
    const results = computeTopicPopularity(articles, "All")
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].count).toBeGreaterThanOrEqual(results[i].count)
    }
  })

  it("has percentages that sum to approximately 100", () => {
    const results = computeTopicPopularity(articles, "All")
    const totalPct = results.reduce((sum, r) => sum + r.percentage, 0)
    expect(totalPct).toBeCloseTo(100, 0)
  })

  it("treats null the same as All", () => {
    const fromNull = computeTopicPopularity(articles, null)
    const fromAll = computeTopicPopularity(articles, "All")
    expect(fromNull).toEqual(fromAll)
  })

  it("treats Global the same as All", () => {
    const fromGlobal = computeTopicPopularity(articles, "Global")
    const fromAll = computeTopicPopularity(articles, "All")
    expect(fromGlobal).toEqual(fromAll)
  })

  it("returns entries with topic, count, and percentage fields", () => {
    const results = computeTopicPopularity(articles, "All")
    for (const r of results) {
      expect(typeof r.topic).toBe("string")
      expect(typeof r.count).toBe("number")
      expect(typeof r.percentage).toBe("number")
      expect(r.percentage).toBeGreaterThanOrEqual(0)
      expect(r.percentage).toBeLessThanOrEqual(100)
    }
  })

  it("returns percentages with at most 2 decimal places", () => {
    const results = computeTopicPopularity(articles, "All")
    for (const r of results) {
      const decimalStr = r.percentage.toString()
      const parts = decimalStr.split(".")
      if (parts.length === 2) {
        expect(parts[1].length).toBeLessThanOrEqual(2)
      }
    }
  })
})
