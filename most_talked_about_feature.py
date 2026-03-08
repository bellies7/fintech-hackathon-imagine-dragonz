# most_talked_about_feature.py

from collections import Counter

# ============================
# DUMMY DATA (FOR TESTING ONLY)
# ============================

articles = [
    {
        "title": "US inflation rises again",
        "topics": ["inflation", "US"],
        "region": "Global"
    },
    {
        "title": "Oil prices surge after tensions",
        "topics": ["energy", "geopolitics"],
        "region": "Global"
    },
    {
        "title": "China property crisis deepens",
        "topics": ["china", "real estate"],
        "region": "Asia"
    },
    {
        "title": "Singapore GDP grows",
        "topics": ["economy", "Singapore"],
        "region": "Singapore"
    }
]

# ============================
# FUNCTION: compute_topic_popularity
# Counts articles per topic, optionally filters by region
# Treats 'All' or 'Global' as the same
# ============================

def compute_topic_popularity(articles, region=None):
    """
    articles: list of dicts
    region: 'Singapore', 'Asia', 'Global', 'All' or None
    returns dict {topic: percentage}
    """

    counter = Counter()
    
    # Treat 'All' or 'Global' as no filtering
    filtered_articles = articles
    if region and region not in ['All', 'Global']:
        filtered_articles = [a for a in articles if a.get("region") == region]

    for article in filtered_articles:
        for topic in article["topics"]:
            counter[topic] += 1

    total = sum(counter.values())
    percentages = {topic: round(count / total * 100, 2) for topic, count in counter.items()}

    return percentages

# ============================
# TEST SECTION
# ============================

if __name__ == "__main__":
    print("=== Most Talked About Topics ===\n")

    # Test Global
    print("Global:", compute_topic_popularity(articles, region="Global"))

    # Test Singapore
    print("Singapore:", compute_topic_popularity(articles, region="Singapore"))

    # Test Asia
    print("Asia:", compute_topic_popularity(articles, region="Asia"))

    # Test without region filter (should be same as Global)
    print("No filter:", compute_topic_popularity(articles))

# ============================
# HOW TO LOAD REAL DATA LATER
# ============================
"""
# Uncomment when extraction dataset is ready

import json

with open("data/articles.json") as f:
    articles = json.load(f)

# If CSV:
# import csv
# articles = []
# with open("data/articles.csv", newline='') as f:
#     reader = csv.DictReader(f)
#     for row in reader:
#         row["topics"] = row["topics"].split(";")
#         row["region"] = row["region"]
#         articles.append(row)
"""