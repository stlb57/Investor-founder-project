import sqlite3
import uuid
from datetime import datetime, timedelta

def seed_test_signals():
    db_path = 'signalfund_v2.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get a startup and its user
    cursor.execute("SELECT id, user_id, name FROM startups LIMIT 1")
    startup = cursor.fetchone()
    if not startup:
        print("No startups found.")
        return
    startup_id = startup[0]
    founder_id = startup[1]
    startup_name = startup[2]

    # Get an investor user
    cursor.execute("SELECT id FROM users WHERE role LIKE 'investor' LIMIT 1")
    investor_user = cursor.fetchone()
    if not investor_user:
        print("No investors found.")
        return
    investor_id = investor_user[0]

    signals = [
        # Founder Signals
        {
            "id": str(uuid.uuid4()),
            "user_id": founder_id,
            "user_type": "founder",
            "startup_id": startup_id,
            "signal_type": "execution_alarm",
            "severity": "high",
            "headline": "Execution Gap Detected: 124 Days",
            "explanation": "No significant milestones have been logged for over 4 months. Tracking investors are seeing a lack of momentum.",
            "evidence": "Internal data suggests zero verified timeline updates since September.",
            "created_at": (datetime.now() - timedelta(hours=2)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": founder_id,
            "user_type": "founder",
            "startup_id": startup_id,
            "signal_type": "market_interest",
            "severity": "low",
            "headline": "Strong Inbound Market Interest",
            "explanation": "Your execution timeline is attracting significant attention from relevant sector investors.",
            "evidence": "5 unique Tier-1 profile reviews detected in the last 72 hours.",
            "created_at": (datetime.now() - timedelta(hours=5)).isoformat()
        },
        # Investor Signals
        {
            "id": str(uuid.uuid4()),
            "user_id": investor_id,
            "user_type": "investor",
            "startup_id": startup_id,
            "signal_type": "readiness_shift",
            "severity": "high",
            "headline": f"{startup_name}: Readiness band moved to HIGH",
            "explanation": f"{startup_name} has cleared all technical and traction hurdles for the next-stage funding cycle.",
            "evidence": "Readiness score increased from 72 to 89 based on 3 new verified milestones.",
            "created_at": (datetime.now() - timedelta(hours=1)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": investor_id,
            "user_type": "investor",
            "startup_id": startup_id,
            "signal_type": "momentum_change",
            "severity": "medium",
            "headline": f"{startup_name}: Velocity increase detected",
            "explanation": "This startup is shipping twice as fast as the sector average this month.",
            "evidence": "Timeline event density increased by 40% compared to previous quarter.",
            "created_at": (datetime.now() - timedelta(hours=3)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": investor_id,
            "user_type": "investor",
            "startup_id": None,
            "signal_type": "ecosystem_story",
            "severity": "low",
            "headline": "Insight: Precision Execution: The Path to High Readiness",
            "explanation": "How a Fintech startup moved from 'Early' to 'High' readiness in 4 months.",
            "evidence": "Based on cross-sector execution data analysis.",
            "created_at": (datetime.now() - timedelta(hours=4)).isoformat()
        }
    ]

    for s in signals:
        cursor.execute("""
            INSERT INTO signal_events (id, user_id, user_type, startup_id, signal_type, severity, headline, explanation, evidence, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (s['id'], s['user_id'], s['user_type'], s['startup_id'], s['signal_type'], s['severity'], s['headline'], s['explanation'], s['evidence'], s['created_at']))

    conn.commit()
    conn.close()
    print("Test signals seeded successfully.")

if __name__ == "__main__":
    seed_test_signals()
