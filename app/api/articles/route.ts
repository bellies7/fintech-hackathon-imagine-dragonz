import { NextResponse } from "next/server"

const GUARDIAN_API_BASE = "https://content.guardianapis.com/search"

type GuardianTag = {
  id: string
  type: string
  webTitle: string
}

type GuardianResult = {
  webTitle: string
  sectionId: string
  webPublicationDate: string
  webUrl: string
  pillarName?: string
  tags?: GuardianTag[]
}

type GuardianApiResponse = {
  response: {
    status: string
    results: GuardianResult[]
  }
}

type ArticleRegion = "Singapore" | "Asia" | "Global"

type SearchArticle = {
  title: string
  topics: string[]
  source: string
  date: string
  url: string
  region: ArticleRegion
}

function mapRegion(item: GuardianResult): ArticleRegion {
  const section = item.sectionId?.toLowerCase() ?? ""
  const pillar = item.pillarName?.toLowerCase() ?? ""
  const title = item.webTitle?.toLowerCase() ?? ""

  if (section.includes("singapore") || title.includes("singapore")) {
    return "Singapore"
  }

  if (
    section.includes("asia") ||
    section.includes("china") ||
    section.includes("japan") ||
    section.includes("india") ||
    section.includes("korea") ||
    pillar.includes("asia") ||
    title.includes("asia")
  ) {
    return "Asia"
  }

  return "Global"
}

function mapGuardianResult(item: GuardianResult): SearchArticle {
  const topics: string[] = (item.tags ?? [])
    .filter((tag) => tag.type === "keyword")
    .map((tag) => {
      const segments = tag.id.split("/")
      return segments[segments.length - 1].toLowerCase()
    })

  const sectionSlug = item.sectionId?.toLowerCase()
  if (sectionSlug && !topics.includes(sectionSlug)) {
    topics.push(sectionSlug)
  }

  return {
    title: item.webTitle,
    topics,
    source: "The Guardian",
    date: item.webPublicationDate.slice(0, 10),
    url: item.webUrl,
    region: mapRegion(item),
  }
}

export async function GET(request: Request) {
  const apiKey = process.env.GUARDIAN_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "GUARDIAN_API_KEY not configured" },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""

  const params = new URLSearchParams({
    "api-key": apiKey,
    "show-tags": "keyword",
    "order-by": "newest",
    "page-size": "50",
  })

  if (query) {
    params.set("q", query)
  }

  try {
    const res = await fetch(`${GUARDIAN_API_BASE}?${params.toString()}`)

    if (!res.ok) {
      return NextResponse.json(
        { error: `Guardian API returned ${res.status}` },
        { status: 502 },
      )
    }

    const data: GuardianApiResponse = await res.json()
    const articles = (data.response?.results ?? []).map(mapGuardianResult)

    return NextResponse.json({ articles })
  } catch (err) {
    console.error("Guardian API fetch failed:", err)
    return NextResponse.json(
      { error: "Failed to fetch from Guardian API" },
      { status: 502 },
    )
  }
}
