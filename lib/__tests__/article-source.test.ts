import { describe, it, expect } from "vitest"
import { getArticles } from "../article-source"

describe("getArticles", () => {
  it("returns a non-empty array", () => {
    const articles = getArticles()
    expect(articles.length).toBeGreaterThan(0)
  })

  it("returns the same result regardless of query parameter", () => {
    const withoutQuery = getArticles()
    const withQuery = getArticles("inflation")
    expect(withQuery).toEqual(withoutQuery)
  })

  it("returns articles conforming to the SearchArticle schema", () => {
    const articles = getArticles()

    for (const article of articles) {
      expect(typeof article.title).toBe("string")
      expect(Array.isArray(article.topics)).toBe(true)
      expect(article.topics.length).toBeGreaterThan(0)
      expect(typeof article.source).toBe("string")
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof article.url).toBe("string")
      expect(["Singapore", "Asia", "Global"]).toContain(article.region)
    }
  })

  it("stores topics in lowercase hyphenated format", () => {
    const articles = getArticles()

    for (const article of articles) {
      for (const topic of article.topics) {
        expect(topic).toBe(topic.toLowerCase())
        expect(topic).not.toMatch(/\s/)
      }
    }
  })

  it("contains exactly 11 dummy articles", () => {
    expect(getArticles()).toHaveLength(11)
  })

  it("returns a new array reference each call (no shared mutation risk)", () => {
    const a = getArticles()
    const b = getArticles()
    expect(a).not.toBe(b)
  })

  it("includes articles from all three regions", () => {
    const articles = getArticles()
    const regions = new Set(articles.map((a) => a.region))
    expect(regions).toContain("Global")
    expect(regions).toContain("Asia")
    expect(regions).toContain("Singapore")
  })
})
