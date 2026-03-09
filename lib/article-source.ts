export type ArticleRegion = "Singapore" | "Asia" | "Global"

export type SearchArticle = {
  title: string
  topics: string[]
  source: string
  date: string
  url: string
  region: ArticleRegion
}

const DUMMY_ARTICLES: SearchArticle[] = [
  {
    title: "US inflation rises again",
    topics: ["inflation", "us", "economy"],
    source: "The Guardian",
    date: "2026-03-05",
    url: "https://example.com/1",
    region: "Global",
  },
  {
    title: "Oil prices surge after Middle East tensions",
    topics: ["energy", "oil", "geopolitics"],
    source: "The Guardian",
    date: "2026-03-04",
    url: "https://example.com/2",
    region: "Global",
  },
  {
    title: "China property crisis deepens",
    topics: ["china", "real-estate", "economy"],
    source: "The Guardian",
    date: "2026-03-03",
    url: "https://example.com/3",
    region: "Asia",
  },
  {
    title: "Fed hints at interest rate hike",
    topics: ["us", "interest-rates", "federal-reserve", "central-bank"],
    source: "The Guardian",
    date: "2026-03-06",
    url: "https://example.com/4",
    region: "Global",
  },
  {
    title: "ECB holds rates amid eurozone slowdown",
    topics: ["europe", "interest-rates", "central-bank", "economy"],
    source: "The Guardian",
    date: "2026-03-06",
    url: "https://example.com/5",
    region: "Global",
  },
  {
    title: "UK chancellor announces spending cuts",
    topics: ["uk", "fiscal-policy", "economy"],
    source: "The Guardian",
    date: "2026-03-05",
    url: "https://example.com/6",
    region: "Global",
  },
  {
    title: "Singapore GDP grows strongly",
    topics: ["economy", "singapore", "growth"],
    source: "The Guardian",
    date: "2026-03-07",
    url: "https://example.com/7",
    region: "Singapore",
  },
  {
    title: "ASEAN trade deal gains momentum",
    topics: ["trade", "asean", "geopolitics"],
    source: "The Guardian",
    date: "2026-03-06",
    url: "https://example.com/8",
    region: "Asia",
  },
  {
    title: "Singapore MAS holds monetary policy",
    topics: ["singapore", "central-bank", "monetary-policy"],
    source: "The Guardian",
    date: "2026-03-05",
    url: "https://example.com/9",
    region: "Singapore",
  },
  {
    title: "Tech stocks rally on AI optimism",
    topics: ["technology", "equities", "us"],
    source: "The Guardian",
    date: "2026-03-07",
    url: "https://example.com/10",
    region: "Global",
  },
  {
    title: "OPEC+ agrees to extend production cuts",
    topics: ["energy", "oil", "geopolitics", "opec"],
    source: "The Guardian",
    date: "2026-03-04",
    url: "https://example.com/11",
    region: "Global",
  },
]

/**
 * Returns dummy articles synchronously. Used as a fallback and in tests.
 */
export function getDummyArticles(): SearchArticle[] {
  return [...DUMMY_ARTICLES]
}

/**
 * Fetches articles from the internal `/api/articles` route (which
 * proxies the Guardian API server-side to keep the key secret).
 * Falls back to dummy data if the API route returns an error or
 * if we're in a non-browser environment (e.g. tests).
 */
export async function getArticles(query?: string): Promise<SearchArticle[]> {
  if (typeof window === "undefined") {
    return getDummyArticles()
  }

  try {
    const params = new URLSearchParams()
    if (query) {
      params.set("q", query)
    }

    const qs = params.toString()
    const url = `/api/articles${qs ? `?${qs}` : ""}`

    const res = await fetch(url)

    if (!res.ok) {
      console.error(`/api/articles returned ${res.status}`)
      return getDummyArticles()
    }

    const data: { articles: SearchArticle[] } = await res.json()

    if (!data.articles || data.articles.length === 0) {
      return getDummyArticles()
    }

    return data.articles
  } catch (err) {
    console.error("Article fetch failed:", err)
    return getDummyArticles()
  }
}
