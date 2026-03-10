# 🌐 Macro Pulse — FinTech Innovator's Hackathon 2026

**Team:** Imagine Dragonz

**Problem Statement:** Macro Economics Tracker (Problem Statement 2)

**Organiser:** Schroders

🔗 **Live Demo:** https://fintech-hackathon-imagine-dragonz-lft0uzpkz-bellies7s-projects.vercel.app/

---

## 👥 Team

| Name | Role |
|---|---|
| Isabel *(Team Lead)* | Frontend, Pitch |
| Jolene | Frontend, Pitch |
| An | Backend |
| Zachary | Backend |
| Sheryl | Backend |

---

## 🎯 What are we solving?

Asset managers are continuously exposed to high volumes of market-moving news — macroeconomic releases, central bank commentary, geopolitical developments, and regulatory announcements. Today, monitoring is largely manual, fragmented across multiple platforms, and dependent on individual interpretation.

**Macro Pulse** is an AI-powered macroeconomic dashboard that cuts through the noise, surfaces what matters, and helps asset managers act faster and smarter.

---

## ✅ Addressing each requirement

| Requirement | Our Solution |
|---|---|
| **Track** how a topic evolves over time | Topic Hotness Timeline — a live line chart showing coverage intensity per topic across months, making trends immediately visible |
| **Identify** when a theme becomes "hot" or "cool" | Every article and recommendation is tagged Hot 🔥 / Warm ☀️ / Cool ❄️ based on current coverage velocity |
| **Connect** related developments across regions and asset classes | Topic Distribution chart with regional filters (Global, Singapore, Americas, Europe, Asia) — see what's trending where |
| **Maintain** institutional memory of past discussions | Expandable Timeline in every article's detail panel — grouped by year and quarter, showing the full history of a topic |
| **Provide** an intuitive dashboard | Clean dark-mode dashboard with starred topic tracking, OR/AND search logic, and a personalised "For You" feed |
| **(Bonus)** Propose risk implications | Every article surfaces a one-line Risk Implication callout — e.g. "Higher oil → Inflation persistence → Rates higher for longer" |

---

## 🚀 Key Features

### 📌 Currently Tracking
- Star topics you care about (e.g. Federal Reserve, Inflation, Interest Rates)
- Articles are automatically filtered to your starred topics
- Each article is colour-coded by heat level with a risk implication callout
- Click any article to open a full detail panel with source, tags, and expandable historical timeline

### 🔍 Smart Search
- Search across articles using **OR logic** (any topic) and **AND logic** (all topics must match)
- Powered by the **Guardian API** — searches across 50 live articles to demonstrate real search logic

### 📊 Most Talked About
- Donut chart showing the **top 5 topics by mention volume**
- Filterable by region: Global, Singapore, Americas, Europe, Asia
- Powered by the **Guardian API** for live topic frequency data

### 📈 Topic Hotness Timeline
- Multi-line SVG chart showing coverage intensity over time
- Toggle individual topics on/off to compare trends
- Directly addresses the "time is continuous" requirement — not just a snapshot

### ✨ For You
- Personalised macro theme recommendations
- Each card shows the theme, article, risk implication, and heat level
- Click through to full article detail with historical timeline

### 🗓️ Article Timeline
- Every article has a full historical timeline grouped by year and quarter
- Expandable/collapsible — maintains institutional memory of how a topic developed over time

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4 |
| Backend | Python |
| Data | Guardian API (live), mock data (demo) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
app/
  page.tsx               # Overview dashboard
  statistics/page.tsx    # Statistics and trend analysis

components/
  Navbar.tsx             # Navigation
  StatsBar.tsx           # KPI tiles
  SearchBar.tsx          # OR/AND topic search
  TopicDistribution.tsx  # Regional donut chart
  ArticleFeed.tsx        # Starred topics + article cards
  ForYouPanel.tsx        # Personalised recommendations
  NewsDetailPanel.tsx    # Article detail + timeline overlay
  TopicTimeline.tsx      # Coverage intensity line chart
  TopicHotness.tsx       # Trending/Cooling/Steady groups
  MonthlyTrends.tsx      # % change bar chart
  KeyEvents.tsx          # Key events timeline

lib/
  mock-data.ts           # Data types + placeholder data
```

---

## 🏃 Running Locally

```bash
git clone https://github.com/eyrel/imagine-dragon-hackathon.git
cd imagine-dragon-hackathon
git checkout frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
