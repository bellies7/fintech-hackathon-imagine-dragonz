from fastapi import Query, HTTPException, FastAPI
from typing import Optional

app = FastAPI()

# --- 1. EXTENDED MOCK DATA ---
# A "Master List" of all news events for the timeline
GLOBAL_TIMELINE_NEWS = [
    {"id": 101, "topic": "US Interest Rates", "date": "2026-01-15", "headline": "Fed Minutes Released", "summary": "Fed members expressed concerns over sticky service inflation."},
    {"id": 102, "topic": "Global Supply Chain", "date": "2026-02-01", "headline": "Suez Canal Traffic Up", "summary": "Freight costs drop as transit numbers return to 2024 levels."},
    {"id": 103, "topic": "US Interest Rates", "date": "2026-02-10", "headline": "Unemployment Hits 4.1%", "summary": "Cooling labor market suggests a potential rate cut in June."},
    {"id": 104, "topic": "Tech Sector Earnings", "date": "2026-03-05", "headline": "AI Chips Demand Surges", "summary": "Leading manufacturers report record-breaking Q1 revenue projections."},
]

# --- 2. THE TIMELINE ENDPOINT ---

@app.get("/timeline")
def get_news_timeline(
    topic: Optional[str] = Query(None, description="Filter news by a specific topic name"),
    sort: str = Query("desc", pattern="^(asc|desc)$", description="Sort by date: 'asc' or 'desc'")
):
    """
    Returns a chronological list of news. 
    Can be filtered by topic (e.g., /timeline?topic=US Interest Rates)
    """
    results = GLOBAL_TIMELINE_NEWS

    # Logic: Filter by topic if provided
    if topic:
        results = [n for n in results if n["topic"].lower() == topic.lower()]
        if not results:
            raise HTTPException(status_code=404, detail=f"No news found for topic: {topic}")

    # Logic: Sort by date
    # (In a real app, you'd convert strings to datetime objects first)
    reverse_order = True if sort == "desc" else False
    sorted_results = sorted(results, key=lambda x: x["date"], reverse=reverse_order)

    return {
        "count": len(sorted_results),
        "filter_applied": topic,
        "news": sorted_results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)