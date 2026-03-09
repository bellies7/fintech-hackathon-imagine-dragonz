// ============================================================
// lib/article-source.ts — DATA LAYER
// ============================================================
// Single source of truth for articles. Both the Search feature
// and Most Talked About Topics feature call getArticles() from
// this file. The rest of the app treats this as a black box —
// only the returned shape matters.
//
// ── TODO: GUARDIAN API ──────────────────────────────────────
// To swap in the Guardian API, replace the body of getArticles()
// with an HTTP call to:
//
//   https://content.guardianapis.com/search
//
// Required API params:
//   show-tags=keyword
//   show-fields=webUrl
//   order-by=newest
//   q=<query>                 (forward the query argument)
//   api-key=<GUARDIAN_API_KEY> (from process.env.GUARDIAN_API_KEY)
//
// Guardian field mapping → SearchArticle schema:
//   webTitle                      → title
//   tags[].id  (split on "/", take last segment, lowercase, hyphenated) → topics
//   sectionId                     → append to topics if not already present
//   webPublicationDate            → date   (trim to first 10 chars for YYYY-MM-DD)
//   webUrl                        → url
//   "The Guardian"                → source (hardcoded string)
//   pillarName or tag             → region (map to "Global" / "Asia" / "Singapore"
//                                    — mapping TBD at integration time)
//
// The function signature and return type stay exactly the same.
// Nothing outside this file needs to change.
// ============================================================

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
 * Returns a list of articles conforming to the SearchArticle schema.
 *
 * @param _query - Optional search query string. Ignored by the dummy
 *   implementation but included so the signature is already compatible
 *   with the Guardian API, which accepts a free-text query.
 */
export function getArticles(_query?: string): SearchArticle[] {
  return [...DUMMY_ARTICLES]
}
