from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI()

# --- 1. DATA MODELS (Schema) ---

class NewsItem(BaseModel):
    date: str
    headline: str
    summary: str

class TopicRecommendation(BaseModel):
    id: int
    title: str
    risk_level: str  # "Hot", "Warm", "Cool"
    macro_summary: str
    is_favourited: bool
    timeline: List[NewsItem]

# --- 2. MOCK DATA (For Independent Testing) ---

# This simulates your database and AI analysis results
MOCK_TOPICS = [
    {
        "id": 1,
        "title": "US Interest Rates",
        "risk_level": "Hot",
        "macro_summary": "High volatility expected due to upcoming Fed meeting on inflation data.",
        "timeline": [
            {"date": "2026-03-01", "headline": "Fed signals pause", "summary": "Interest rates likely to stay flat."},
            {"date": "2026-03-08", "headline": "CPI Data Released", "summary": "Higher than expected inflation sparks rate hike fears."}
        ]
    },
    {
        "id": 2,
        "title": "Global Supply Chain",
        "risk_level": "Warm",
        "macro_summary": "Moderate risk as shipping routes stabilize but energy costs remain high.",
        "timeline": [
            {"date": "2026-02-15", "headline": "Port Congestion Clears", "summary": "Major hubs report 20% faster turnaround."},
        ]
    },
    {
        "id": 3,
        "title": "Tech Sector Earnings",
        "risk_level": "Cool",
        "macro_summary": "Market has largely priced in the growth; low immediate macro risk.",
        "timeline": []
    }
]

# Simulating a user's favorites (ID of topics they track)
user_favorites = [1]

# --- 3. BACKEND LOGIC ---

def get_risk_color(level: str):
    """Utility to help UI team know which colors to map."""
    mapping = {"Hot": "#FF4B2B", "Warm": "#FFA12B", "Cool": "#2BFF88"}
    return mapping.get(level, "#FFFFFF")

# --- 4. API ENDPOINTS ---

@app.get("/for-you", response_model=List[TopicRecommendation])
def get_for_you_page():
    """
    Returns personalized recommendations. 
    Logic: Prioritize topics the user hasn't favourited yet but are relevant.
    """

    recommendations = []
    for topic in MOCK_TOPICS:
        # Check if the topic ID is NOT in the user's favorites list
        if topic["id"] not in user_favorites:
            recommendations.append(TopicRecommendation(
                **topic,
                is_favourited=False  # By definition, these aren't favorited yet
            ))
    # Sort by risk level (Hot first)
    level_order = {"Hot": 0, "Warm": 1, "Cool": 2}
    return sorted(recommendations, key=lambda x: level_order.get(x.risk_level, 3))

@app.post("/favourite/{topic_id}")
def add_favourite(topic_id: int):
    if topic_id not in user_favorites:
        user_favorites.append(topic_id)
    return {"message": "Success", "current_favs": user_favorites}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)