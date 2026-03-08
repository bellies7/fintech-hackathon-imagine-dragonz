# imagine-dragon-hackathon
For You Page	GET	/for-you	Returns all topics with macro risk levels and short summaries.
Global Timeline	GET	/timeline	A chronological archive. Supports filtering by topic.
Action: Favourite POST /favourite/{id} Adds a topic ID to the user's tracking list.

Hot and Cool
Hot: Critical volatility/immediate risk.
Warm: Moderate movement/monitor closely.
Cool: Stable/low macro impact.

Every news item returned by the API follows this standard JSON format:
JSON
{
  "date": "2026-03-09",
  "headline": "Example Headline",
  "summary": "Short 1-2 sentence macro implication.",
  "topic": "US Interest Rates"
}

The Global Timeline supports query parameters. This is essential for the "Filter by Topic" UI component.
All News: GET /timeline
Filtered: GET /timeline?topic=US+Interest+Rates
Sorted (Oldest First): GET /timeline?sort=asc

Run for testing use:
pip install fastapi uvicorn

Currently, user_favorites is stored in-memory (it resets when the server restarts). In the next phase, we will connect this to the PostgreSQL/MongoDB instance.