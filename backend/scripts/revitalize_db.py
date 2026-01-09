import sqlite3
import random
import uuid
import json
from datetime import datetime, timedelta

def randomize_and_populate():
    db_path = 'signalfund_v2.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("Randomizing startup metrics...")
    
    # Get all startups
    cursor.execute("SELECT id, name, user_id FROM startups")
    startups = cursor.fetchall()

    revenue_buckets = ["$0 - $10k", "$10k - $50k", "$50k - $200k", "$200k - $1M", "$1M+"]
    user_buckets = ["0 - 100", "100 - 1k", "1k - 10k", "10k - 100k", "100k+"]
    stages = ["Pre-seed", "Seed", "Series A", "Series B"]
    bands = ["EARLY", "MEDIUM", "HIGH"]

    for s_id, s_name, u_id in startups:
        # Randomize metrics
        team_size = random.randint(2, 50)
        users = random.choice(user_buckets)
        revenue = random.choice(revenue_buckets)
        stage = random.choice(stages)
        score = random.randint(40, 95)
        band = random.choice(bands)
        
        metrics_json = json.dumps({
            "users_bucket": users,
            "revenue_bucket": revenue,
            "burn_bucket": random.choice(["low", "medium", "high"])
        })
        
        cursor.execute("""
            UPDATE startups 
            SET team_size = ?, metrics = ?, stage = ?, readiness_score = ?, readiness_band = ?
            WHERE id = ?
        """, (team_size, metrics_json, stage, score, band, s_id))

    print("Cleaning old signals to start fresh...")
    cursor.execute("DELETE FROM signal_events")

    print("Generating high-density signals for all users...")
    
    # Get all users
    cursor.execute("SELECT id, role FROM users")
    users = cursor.fetchall()
    
    signal_types = [
        ("MOMENTUM_CHANGE", "MEDIUM", "Velocity increase detected", "This startup is shipping twice as fast as the sector average this month.", "Timeline event density increased by 40%."),
        ("READINESS_SHIFT", "HIGH", "Readiness band moved up", "Significant execution consistency has pushed this startup into a higher readiness tier.", "Score increased by 15 points based on 3 new milestones."),
        ("MARKET_INTEREST", "LOW", "Surge in Market Interest", "High-fit investors are increasingly tracking this startup's execution path.", "8 unique discovery actions detected in the last 48 hours."),
        ("TIMELINE_UPDATE", "LOW", "Major Product Milestone", "A critical technical milestone was verified, reducing execution risk.", "Verification status: AUDITED. Impact score: 9/10."),
        ("EXECUTION_ALARM", "HIGH", "Critical Execution Gap", "No significant milestones have been logged for over 90 days.", "Internal monitor detected zero verified updates since last quarter.")
    ]

    for u_id, role in users:
        # Generate 5-8 random signals for EVERY user to ensure feed is full
        num_signals = random.randint(5, 10)
        
        # Determine signals based on role
        if role.lower() == 'investor':
            # Investors see signals from many startups
            for _ in range(num_signals):
                s = random.choice(startups)
                sig = random.choice([st for st in signal_types if st[0] != 'execution_alarm'])
                
                cursor.execute("""
                    INSERT INTO signal_events (id, user_id, user_type, startup_id, signal_type, severity, headline, explanation, evidence, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(uuid.uuid4()), u_id, 'investor', s[0], 
                    sig[0], sig[1], f"{s[1]}: {sig[2]}", sig[3], sig[4],
                    (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat()
                ))
        else:
            # Founders see signals about THEIR startup and ecosystem
            # Find their startup id
            cursor.execute("SELECT id, name FROM startups WHERE user_id = ?", (u_id,))
            my_startup = cursor.fetchone()
            if my_startup:
                for _ in range(num_signals):
                    sig = random.choice(signal_types)
                    cursor.execute("""
                        INSERT INTO signal_events (id, user_id, user_type, startup_id, signal_type, severity, headline, explanation, evidence, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        str(uuid.uuid4()), u_id, 'founder', my_startup[0], 
                        sig[0], sig[1], sig[2], sig[3], sig[4],
                        (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat()
                    ))
            
            # Add some ecosystem insights to everyone's feed
            cursor.execute("SELECT id, title, summary FROM stories LIMIT 2")
            stories = cursor.fetchall()
            for story in stories:
                 u_type = 'investor' if role.upper() == 'INVESTOR' else 'founder'
                 cursor.execute("""
                    INSERT INTO signal_events (id, user_id, user_type, startup_id, signal_type, severity, headline, explanation, evidence, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(uuid.uuid4()), u_id, u_type, None, 
                    'ECOSYSTEM_STORY', 'LOW', f"Insight: {story[1]}", story[2], "Based on cross-sector data.",
                    (datetime.now() - timedelta(hours=random.randint(1, 24))).isoformat()
                ))

    conn.commit()
    conn.close()
    print("Database successfully revitalized with random data and full feeds!")

if __name__ == "__main__":
    randomize_and_populate()
