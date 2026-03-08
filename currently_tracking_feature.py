# search_feature.py

# ============================
# DUMMY DATA (FOR TESTING ONLY)
# ============================

articles = [
    {
        "title": "US inflation rises again",
        "topics": ["inflation", "US"],
        "source": "Financial Times",
        "date": "2026-03-05",
        "url": "https://example.com/us-inflation"
    },
    {
        "title": "Oil prices surge after tensions",
        "topics": ["energy", "geopolitics"],
        "source": "Financial Times",
        "date": "2026-03-04",
        "url": "https://example.com/oil-prices"
    },
    {
        "title": "China property crisis deepens",
        "topics": ["china", "real estate"],
        "source": "Financial Times",
        "date": "2026-03-03",
        "url": "https://example.com/china-property"
    },
    {
        "title": "Fed hints at interest rate hike",
        "topics": ["US", "interest_rates", "central_bank"],
        "source": "Financial Times",
        "date": "2026-03-06",
        "url": "https://example.com/fed-hike"
    }
]

# ============================
# FUNCTION: search_articles
# Returns articles filtered by main topics (union) and add-topic bar (intersection)
# Output only includes: title, source, date, topics
# ============================

def search_articles(articles, main_topics, add_topics=None):
    """
    articles: list of dicts
    main_topics: set of topics in the main search bar
    add_topics: set of topics in the add-topic bar (optional)
    """

    results = []

    for article in articles:
        article_topics = set(article["topics"])

        # Main bar: union logic
        if not article_topics.intersection(main_topics):
            continue

        # Add topic bar: intersection logic
        if add_topics:
            if not add_topics.issubset(article_topics):
                continue

        # Only include required fields
        results.append({
            "title": article["title"],
            "source": article["source"],
            "date": article["date"],
            "topics": article["topics"]
        })

    return results

# ============================
# TEST SECTION
# ============================

if __name__ == "__main__":
    main_topics = {"US", "inflation"}        # Example main bar topics
    add_topics = {"central_bank"}            # Example add-topic bar

    results = search_articles(articles, main_topics, add_topics)

    print("=== Search Results ===")
    for r in results:
        print(f"Title: {r['title']}")
        print(f"Source: {r['source']}")
        print(f"Date: {r['date']}")
        print(f"Topics: {r['topics']}")
        print("------")

# ============================
# HOW TO LOAD REAL DATA LATER
# ============================
"""
# Uncomment and use this when extraction dataset is ready

import json

with open("data/articles.json") as f:
    articles = json.load(f)

# If CSV:
# import csv
# articles = []
# with open("data/articles.csv", newline='') as f:
#     reader = csv.DictReader(f)
#     for row in reader:
#         row["topics"] = row["topics"].split(";")  # convert topics to list
#         articles.append(row)
"""