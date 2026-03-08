// ============================================================
// lib/mock-data.ts — SHARED MOCK DATA
// ============================================================
// All placeholder data lives here so your teammate can swap it
// out for real API calls in one place.
//
// TO CONNECT BACKEND: Replace each exported constant with an
// API fetch call. e.g.:
//   export async function getArticles() {
//     const res = await fetch('/api/articles')
//     return res.json()
//   }
// ============================================================

export type HeatLevel = "Hot" | "Warm" | "Cool"

export type Article = {
  id: string
  title: string
  source: string
  date: string
  region: string
  topic: string
  theme: string
  summary: string
  riskImplication: string
  heat: HeatLevel
  tags: string[]
  timelineEvents: {
    year: number
    events: {
      quarter: string
      date: string
      title: string
      summary: string
      source: string
    }[]
  }[]
}

// ── ARTICLES ──────────────────────────────────────────────────
// TODO (backend): Replace with GET /api/articles?topics=...
export const articles: Article[] = [
  {
    id: "1",
    title: "Fed Holds Rates Steady Amid Inflation Concerns",
    source: "Reuters",
    date: "05 Mar 2026",
    region: "Americas",
    topic: "Interest Rates",
    theme: "RATES HIGHER FOR LONGER",
    summary: "The Federal Reserve maintained its benchmark interest rate, citing persistent inflationary pressures and a resilient labor market. Chair Powell signaled a cautious approach to rate cuts in 2026.",
    riskImplication: "Prolonged high rates may pressure emerging market currencies and increase debt servicing costs globally.",
    heat: "Hot",
    tags: ["Federal Reserve", "rates", "inflation", "monetary policy"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "07 Mar", title: "US Jobs Report Exceeds Expectations", summary: "The US economy added 312,000 jobs in February 2026, well above the 200,000 forecast...", source: "https://reuters.com" },
          { quarter: "Q1", date: "05 Mar", title: "Fed Holds Rates Steady Amid Inflation Concerns", summary: "The Federal Reserve maintained its benchmark interest rate, citing persistent inflationary pressures...", source: "https://reuters.com" },
          { quarter: "Q1", date: "01 Mar", title: "MAS Tightens Monetary Policy Amid SGD Strength", summary: "The Monetary Authority of Singapore slightly steepened the SGD NEER policy band...", source: "https://mas.gov.sg" },
          { quarter: "Q1", date: "25 Feb", title: "Singapore Core CPI Rises to 3.1%", summary: "Singapore's core inflation accelerated to 3.1% year-on-year, driven by services inflation...", source: "https://singstat.gov.sg" },
        ],
      },
      {
        year: 2025,
        events: [
          { quarter: "Q4", date: "12 Dec", title: "Fed Cuts Rates by 25bps in December", summary: "The Federal Reserve delivered a 25 basis point rate cut, bringing the federal funds rate to 4.25–4.50%...", source: "https://federalreserve.gov" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Oil Prices Surge on OPEC+ Production Cut Extension",
    source: "CNBC",
    date: "03 Mar 2026",
    region: "Global",
    topic: "Oil Prices",
    theme: "ENERGY SUPPLY SQUEEZE",
    summary: "Crude oil jumped 4% after OPEC+ announced extension of production cuts through Q2 2026.",
    riskImplication: "Higher oil prices could reignite inflation, forcing central banks to keep rates elevated longer.",
    heat: "Hot",
    tags: ["Inflation", "energy", "OPEC", "oil"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "03 Mar", title: "OPEC+ Extends Production Cuts", summary: "OPEC+ unanimously agreed to extend production cuts of 2.2 million barrels per day through June 2026...", source: "https://cnbc.com" },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "US Inflation Drops to 3.2%, Below Expectations",
    source: "Bloomberg",
    date: "02 Mar 2026",
    region: "Americas",
    topic: "Inflation",
    theme: "INFLATION COOLING",
    summary: "Consumer prices rose less than expected in February, supporting the case for the Federal Reserve to begin easing monetary policy.",
    riskImplication: "Faster-than-expected disinflation could trigger rapid rate cuts, potentially weakening the USD.",
    heat: "Warm",
    tags: ["Inflation", "Federal Reserve", "CPI", "US economy"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "02 Mar", title: "US CPI Falls to 3.2%", summary: "Headline CPI rose 3.2% year-on-year in February, down from 3.5% in January...", source: "https://bloomberg.com" },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "European Central Bank Maintains Hawkish Stance",
    source: "ECB",
    date: "01 Mar 2026",
    region: "Europe",
    topic: "Central Bank Policy",
    theme: "ECB HOLDS FIRM",
    summary: "ECB President confirmed commitment to bringing inflation back to target, suggesting rates will remain elevated longer.",
    riskImplication: "Prolonged high ECB rates risk pushing the Eurozone into a deeper slowdown.",
    heat: "Warm",
    tags: ["Interest Rates", "ECB", "Europe", "inflation"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "01 Mar", title: "ECB Holds Rates at 3.5%", summary: "The ECB kept its deposit facility rate at 3.5%, with President Lagarde citing still-elevated services inflation...", source: "https://ecb.europa.eu" },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "US Jobs Report Shows Stronger Than Expected Hiring",
    source: "Wall Street Journal",
    date: "28 Feb 2026",
    region: "Americas",
    topic: "Labor Market",
    theme: "STRONG LABOR MARKET",
    summary: "Non-farm payrolls exceeded forecasts with 275,000 jobs added, wage growth remained moderate.",
    riskImplication: "A persistently tight labor market could keep wage inflation elevated, complicating the Fed's path to rate cuts.",
    heat: "Cool",
    tags: ["Federal Reserve", "jobs", "labor market", "US economy"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "28 Feb", title: "NFP Beats at 275K", summary: "Non-farm payrolls added 275,000 jobs in January 2026, surpassing the 200,000 consensus estimate...", source: "https://wsj.com" },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Federal Reserve Minutes Reveal Split on Rate Path",
    source: "Financial Times",
    date: "26 Feb 2026",
    region: "Americas",
    topic: "Federal Reserve",
    theme: "FED POLICY UNCERTAINTY",
    summary: "Minutes from the January FOMC meeting show deep divisions among policymakers on the timing of rate cuts, with hawks citing inflation risks and doves pointing to slowing growth.",
    riskImplication: "Policy uncertainty could increase market volatility and delay business investment decisions.",
    heat: "Hot",
    tags: ["Federal Reserve", "Interest Rates", "monetary policy", "FOMC"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "26 Feb", title: "FOMC Minutes Show Policy Split", summary: "Fed minutes revealed that several members wanted to delay cuts further while others argued for earlier easing...", source: "https://ft.com" },
        ],
      },
    ],
  },
  {
    id: "7",
    title: "China's Manufacturing PMI Contracts for Third Consecutive Month",
    source: "Bloomberg",
    date: "24 Feb 2026",
    region: "Asia",
    topic: "China Economy",
    theme: "CHINA SLOWDOWN",
    summary: "China's official manufacturing PMI fell to 48.7 in February, the third consecutive month below the 50-point expansion threshold, raising concerns about global demand.",
    riskImplication: "A sustained Chinese slowdown could drag on global commodity prices and emerging market growth.",
    heat: "Hot",
    tags: ["Inflation", "China", "manufacturing", "global trade"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "24 Feb", title: "China PMI at 48.7", summary: "Factory activity in China contracted for a third straight month, with new export orders falling sharply...", source: "https://bloomberg.com" },
        ],
      },
    ],
  },
  {
    id: "8",
    title: "Treasury Yields Hit 4-Month High on Strong Economic Data",
    source: "Reuters",
    date: "22 Feb 2026",
    region: "Americas",
    topic: "Treasury Yields",
    theme: "YIELD SURGE",
    summary: "The 10-year US Treasury yield climbed to 4.58%, its highest since October, as better-than-expected retail sales and employment data pushed back rate cut expectations.",
    riskImplication: "Rising yields increase borrowing costs for governments and corporations, potentially slowing investment and growth.",
    heat: "Warm",
    tags: ["Interest Rates", "Federal Reserve", "Treasury", "bonds"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "22 Feb", title: "10Y Treasury Hits 4.58%", summary: "Strong retail sales data pushed the 10-year yield to its highest level since October 2025...", source: "https://reuters.com" },
        ],
      },
    ],
  },
  {
    id: "9",
    title: "Inflation Expectations Rise in University of Michigan Survey",
    source: "CNBC",
    date: "20 Feb 2026",
    region: "Americas",
    topic: "Inflation",
    theme: "INFLATION EXPECTATIONS",
    summary: "One-year inflation expectations climbed to 4.3% in February according to the University of Michigan consumer sentiment survey, the highest reading in 18 months.",
    riskImplication: "Rising inflation expectations can become self-fulfilling, making it harder for the Fed to achieve its 2% target.",
    heat: "Hot",
    tags: ["Inflation", "Federal Reserve", "consumer sentiment", "US economy"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "20 Feb", title: "Michigan Survey: Inflation at 4.3%", summary: "Consumer inflation expectations surged to the highest level since August 2024 in the latest Michigan survey...", source: "https://cnbc.com" },
        ],
      },
    ],
  },
  {
    id: "10",
    title: "Federal Reserve's Waller Signals Openness to Summer Rate Cut",
    source: "Wall Street Journal",
    date: "18 Feb 2026",
    region: "Americas",
    topic: "Federal Reserve",
    theme: "RATE CUT TIMELINE",
    summary: "Fed Governor Christopher Waller said he could support a rate cut as early as summer 2026 if inflation data continues to moderate, diverging from Chair Powell's more cautious stance.",
    riskImplication: "Mixed Fed signals could create market confusion and increase short-term volatility in rate-sensitive assets.",
    heat: "Warm",
    tags: ["Federal Reserve", "Interest Rates", "monetary policy"],
    timelineEvents: [
      {
        year: 2026,
        events: [
          { quarter: "Q1", date: "18 Feb", title: "Waller Open to Summer Cut", summary: "Fed Governor Waller said two or three more months of good inflation data could justify easing policy by mid-year...", source: "https://wsj.com" },
        ],
      },
    ],
  },
]

// ── AVAILABLE TOPICS FOR STARRING ─────────────────────────────
// TODO (backend): Fetch from GET /api/topics
export const availableTopics = [
  "Federal Reserve", "Inflation", "Interest Rates", "China Economy",
  "Geopolitical Tensions", "Labor Market", "Oil Prices", "Treasury Yields",
  "Emerging Markets", "Supply Chain", "Energy Markets", "Housing Market",
  "Monetary Policy", "Global Trade", "Digital Assets", "Tech & AI",
]

// ── DEFAULT STARRED TOPICS ────────────────────────────────────
// TODO (backend): Load from GET /api/user/starred-topics
export const defaultStarredTopics = ["Federal Reserve", "Inflation", "Interest Rates"]
