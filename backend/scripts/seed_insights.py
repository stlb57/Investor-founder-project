import sqlite3
import json
import uuid
from datetime import datetime

def seed_insights():
    db_path = 'signalfund_v2.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    stories = [
        {
            "id": str(uuid.uuid4()),
            "slug": "precision-execution-the-path-to-high-readiness",
            "title": "Precision Execution: The Path to High Readiness",
            "type": "DECISION_STORY",
            "summary": "How a Fintech startup moved from 'Early' to 'High' readiness in 4 months through rigorous timeline adherence.",
            "content": json.dumps([
                {"type": "h3", "text": "The Challenge"},
                {"type": "p", "text": "The startup was struggling with a 120-day execution gap. Investors were losing interest due to lack of verified momentum."},
                {"type": "h3", "text": "The Signal Shift"},
                {"type": "p", "text": "By shifting to weekly 'Micro-Milestones'—verified by product shipping logs—the startup increased their velocity signal by 300%."},
                {"type": "h3", "text": "The Outcome"},
                {"type": "p", "text": "The system automatically generated a 'Readiness Shift: High' signal, resulting in 14 introduction requests within 48 hours."}
            ]),
            "related_tags": json.dumps(["Fintech", "Readiness", "Velocity"]),
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "q1-2026-saas-efficiency-benchmarks",
            "title": "Q1 2026 SaaS Efficiency Benchmarks",
            "type": "ECOSYSTEM_INSIGHT",
            "summary": "Analysis of capital efficiency signals across 200+ Seed-stage SaaS companies.",
            "content": json.dumps([
                {"type": "h3", "text": "Market Context"},
                {"type": "p", "text": "Average burn multi has dropped 0.2x across the SignalFund ecosystem as founders prioritize unit economics over raw growth."},
                {"type": "h3", "text": "Performance Clusters"},
                {"type": "p", "text": "Top decile startups are logging 1.4x more Product milestones than Team milestones compared to 2025 data."},
                {"type": "h3", "text": "Signal Implication"},
                {"type": "p", "text": "Investors are currently overweighting 'Product Reliability' signals over 'Aggressive Hiring' signals."}
            ]),
            "related_tags": json.dumps(["SaaS", "Efficiency", "Benchmarks"]),
            "created_at": datetime.now().isoformat()
        }
    ]

    for s in stories:
        cursor.execute("""
            INSERT OR IGNORE INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (s['id'], s['slug'], s['title'], s['type'], s['summary'], s['content'], s['related_tags'], s['created_at']))

    conn.commit()
    conn.close()
    print("Stories seeded successfully.")

if __name__ == "__main__":
    seed_insights()
