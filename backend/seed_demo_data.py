"""
Demo Data Seeder for ScaleX
Creates realistic startup and investor profiles with timelines
"""

import sqlite3
from datetime import datetime, timedelta
from passlib.context import CryptContext
import uuid
import json

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
DB_PATH = "signalfund_v2.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Demo credentials
STARTUP_EMAIL = "demo.startup@mediheal.io"
STARTUP_PASSWORD = "Demo2024!"
INVESTOR_EMAIL = "demo.investor@sequoia.com"
INVESTOR_PASSWORD = "Demo2024!"

print("Creating demo profiles...")

# Create Startup User
startup_user_id = str(uuid.uuid4())
startup_hashed_pw = pwd_context.hash(STARTUP_PASSWORD)

cursor.execute("""
    INSERT INTO users (id, email, password_hash, role, created_at)
    VALUES (?, ?, ?, 'STARTUP', datetime('now'))
""", (startup_user_id, STARTUP_EMAIL, startup_hashed_pw))

# Create Startup Profile
startup_id = str(uuid.uuid4())
cursor.execute("""
    INSERT INTO startups (
        id, user_id, name, slug, sector, stage, location, description,
        founded_date, impact_tags, impact_depth, website_url, team_size,
        metrics, readiness_score, readiness_band, visibility_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
""", (
    startup_id,
    startup_user_id,
    "MediHeal AI",
    "mediheal-ai",
    "HealthTech",
    "Series A",
    "San Francisco, CA",
    "AI-powered diagnostic platform helping physicians detect rare diseases 3x faster using computer vision and clinical data analysis.",
    "2022-03-15",
    json.dumps(["Healthcare Access", "AI/ML", "Clinical Decision Support"]),
    "CORE",
    "https://mediheal.io",
    12,
    json.dumps({"users_bucket": "10k-50k", "revenue_bucket": "$500k-$1M ARR", "burn_bucket": "$150k/mo"}),
    78,
    "HIGH",
    "VISIBLE",
))

# Create Timeline Events for Startup
events = [
    ("2022-03-15", "MILESTONE", "Company Founded", "Founded MediHeal AI with mission to democratize rare disease diagnosis", "VERIFIED", 8),
    ("2022-05-20", "FUNDING", "Pre-seed Round Closed", "Raised $500k from Y Combinator and angel investors", "VERIFIED", 9),
    ("2022-08-10", "PRODUCT", "Alpha Launch", "Launched alpha version with 3 partner hospitals", "VERIFIED", 7),
    ("2022-11-15", "MILESTONE", "First 100 Diagnoses", "Platform successfully assisted in 100+ rare disease diagnoses", "VERIFIED", 8),
    ("2023-02-20", "TEAM", "Key Hire: Head of Clinical", "Dr. Sarah Chen joined as Chief Medical Officer from Stanford Medicine", "VERIFIED", 9),
    ("2023-04-10", "FUNDING", "Seed Round - $2.5M", "Led by Khosla Ventures with participation from General Catalyst", "VERIFIED", 10),
    ("2023-07-01", "PRODUCT", "FDA Breakthrough Designation", "Received FDA Breakthrough Device designation for rare disease module", "VERIFIED", 10),
    ("2023-09-15", "MILESTONE", "10 Hospital Network", "Expanded to 10 major hospitals across US", "VERIFIED", 8),
    ("2023-12-01", "TEAM", "Team Expansion", "Grew engineering team from 4 to 12 members", "VERIFIED", 7),
    ("2024-02-10", "MILESTONE", "1000+ Diagnoses Milestone", "Crossed 1,000 successful rare disease diagnoses", "VERIFIED", 9),
    ("2024-05-15", "PRODUCT", "AI Model v2.0 Launch", "Released new model with 95% accuracy on rare diseases", "VERIFIED", 9),
    ("2024-08-20", "MILESTONE", "$1M ARR Achieved", "Reached $1M in annual recurring revenue", "VERIFIED", 10),
    ("2024-11-10", "FUNDING", "Series A - $8M", "Currently raising Series A to scale to 50 hospitals", "SELF_REPORTED", 10),
]

for event_date, event_type, title, description, confidence, impact in events:
    event_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO timeline_events (
            id, startup_id, event_date, event_type, title, description,
            confidence, impact_score, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    """, (event_id, startup_id, event_date, event_type, title, description, confidence, impact))

# Create Investor User
investor_user_id = str(uuid.uuid4())
investor_hashed_pw = pwd_context.hash(INVESTOR_PASSWORD)

cursor.execute("""
    INSERT INTO users (id, email, password_hash, role, created_at)
    VALUES (?, ?, ?, 'INVESTOR', datetime('now'))
""", (investor_user_id, INVESTOR_EMAIL, investor_hashed_pw))

# Create Investor Profile
investor_id = str(uuid.uuid4())
cursor.execute("""
    INSERT INTO investors (
        id, user_id, name, firm_name, investor_type,
        stage_focus, sector_focus, check_size_min, check_size_max, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
""", (
    investor_id,
    investor_user_id,
    "Alexandra Chen",
    "Sequoia Capital",
    "vc",
    json.dumps(["Seed", "Series A", "Series B"]),
    json.dumps(["HealthTech", "AI/ML", "Enterprise SaaS", "Biotech"]),
    2000000,  # $2M min
    15000000,  # $15M max
))

# Create some timeline events for investor
investor_events = [
    ("2020-01-15", "INVESTMENT", "Joined Sequoia Capital", "Joined as Principal focusing on healthcare and AI investments", "VERIFIED", 8),
    ("2021-06-20", "INVESTMENT", "Led Series A in HealthOS", "Led $12M Series A in HealthOS (acquired by Epic in 2023)", "VERIFIED", 10),
    ("2022-03-10", "ADVISORY", "Advisor to StartX", "Became advisory board member for Stanford's StartX accelerator", "VERIFIED", 7),
    ("2023-05-15", "INVESTMENT", "Series B in CureAI", "Participated in $25M Series B round", "VERIFIED", 9),
    ("2024-02-01", "INVESTMENT", "Seed Investment in DiagnosticX", "Led $3M seed round in AI diagnostic startup", "VERIFIED", 9),
]

for event_date, event_type, title, description, confidence, impact in investor_events:
    event_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO timeline_events (
            id, investor_id, event_date, event_type, title, description,
            confidence, impact_score, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    """, (event_id, investor_id, event_date, event_type, title, description, confidence, impact))

conn.commit()
conn.close()

print("\n✅ Demo profiles created successfully!")
print("\n" + "="*60)
print("STARTUP CREDENTIALS")
print("="*60)
print(f"Email:    {STARTUP_EMAIL}")
print(f"Password: {STARTUP_PASSWORD}")
print(f"Company:  MediHeal AI")
print(f"Sector:   HealthTech (AI-powered rare disease diagnostics)")
print(f"Stage:    Series A")
print(f"Score:    78/100 (High Readiness)")
print(f"Timeline: {len(events)} verified milestones")
print("\n" + "="*60)
print("INVESTOR CREDENTIALS")
print("="*60)
print(f"Email:    {INVESTOR_EMAIL}")
print(f"Password: {INVESTOR_PASSWORD}")
print(f"Name:     Alexandra Chen")
print(f"Firm:     Sequoia Capital")
print(f"Focus:    HealthTech, AI/ML, Enterprise SaaS")
print(f"Check:    $2M - $15M")
print(f"Timeline: {len(investor_events)} investment events")
print("="*60)
