# imagine-dragon-hackathon

## Macro Pulse — Frontend UI

Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS v4**.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Overview dashboard |
| `/statistics` | `app/statistics/page.tsx` | Statistics and trend analysis |

---

## Component Map

### Overview Page (`/`)

| Component | File | Description |
|---|---|---|
| Navbar | `components/Navbar.tsx` | Sticky top nav with logo, page links, user chip |
| StatsBar | `components/StatsBar.tsx` | 4 KPI tiles — Articles Today, Tracked Topics, Alerts, Last Updated |
| SearchBar | `components/SearchBar.tsx` | OR / AND topic search with tag inputs |
| TopicDistribution | `components/TopicDistribution.tsx` | Donut chart showing top 5 topics by region |
| ArticleFeed | `components/ArticleFeed.tsx` | Starred topic pills + filtered article cards with Hot/Warm/Cool badges |
| ForYouPanel | `components/ForYouPanel.tsx` | Personalised recommendations with pagination |
| NewsDetailPanel | `components/NewsDetailPanel.tsx` | Slide-in overlay with full article detail + expandable timeline |

### Statistics Page (`/statistics`)

| Component | File | Description |
|---|---|---|
| TopicTimeline | `components/TopicTimeline.tsx` | SVG line chart of topic coverage intensity over time |
| TopicHotness | `components/TopicHotness.tsx` | Topics grouped into Trending Up / Cooling Down / Steady |
| MonthlyTrends | `components/MonthlyTrends.tsx` | % change per topic as horizontal bar chart |
| KeyEvents | `components/KeyEvents.tsx` | Vertical timeline of major market events |

---

## Connecting the Backend

All placeholder data lives in **`lib/mock-data.ts`**. Every field that needs a real API call is marked with a `// TODO (backend):` comment — search for that string across the project to find all integration points.

Key integration points:

```
lib/mock-data.ts          ← replace mock articles, topics, starred topics
components/ArticleFeed.tsx  ← GET /api/articles?topics=...
components/ForYouPanel.tsx  ← GET /api/recommendations
components/SearchBar.tsx    ← GET /api/articles (search endpoint)
components/TopicTimeline.tsx ← GET /api/statistics/topic-timeline
```

---

## Folder Structure

```
app/
  layout.tsx           # Root layout (Navbar + global styles)
  page.tsx             # Overview page
  statistics/
    page.tsx           # Statistics page

components/            # All UI components (one file per component)

lib/
  mock-data.ts         # All placeholder data + TypeScript types

styles/
  globals.css          # Tailwind config + CSS variables (colours, fonts)
```

---

## Theming

Colours are defined as CSS variables in `styles/globals.css` under the `.dark` block. The app defaults to dark mode.

To change the purple accent colour, update:
```css
--primary: oklch(0.6 0.2 290);
```
