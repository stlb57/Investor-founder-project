"""
Migration script to add comprehensive onboarding fields to the database
Run this to update your database schema with new columns
"""

import sqlite3
import os

# Get database path
db_path = os.path.join(os.path.dirname(__file__), '..', 'signalfund_v2.db')

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Starting migration to add comprehensive onboarding fields...")

# Get existing columns
cursor.execute("PRAGMA table_info(startups)")
existing_cols = [col[1] for col in cursor.fetchall()]

# Startup table migrations
startup_migrations = [
    # Section 1: Basic Profile enhancements
    ("region", "ALTER TABLE startups ADD COLUMN region VARCHAR(100)"),
    ("is_incorporated", "ALTER TABLE startups ADD COLUMN is_incorporated BOOLEAN DEFAULT 0"),
    
    # Section 2: Founder Execution Signals
    ("founder_role", "ALTER TABLE startups ADD COLUMN founder_role VARCHAR(100)"),
    ("time_commitment", "ALTER TABLE startups ADD COLUMN time_commitment VARCHAR(20)"),
    ("prev_startup_exp", "ALTER TABLE startups ADD COLUMN prev_startup_exp BOOLEAN"),
    ("experience_years", "ALTER TABLE startups ADD COLUMN experience_years VARCHAR(20)"),
    ("cofounder_count", "ALTER TABLE startups ADD COLUMN cofounder_count INTEGER DEFAULT 0"),
    
    # Section 3: Product/Solution
    ("product_description", "ALTER TABLE startups ADD COLUMN product_description TEXT"),
    
    # Section 4: Traction (Range-Based)
    ("mau_range", "ALTER TABLE startups ADD COLUMN mau_range VARCHAR(50)"),
    ("user_growth_rate", "ALTER TABLE startups ADD COLUMN user_growth_rate VARCHAR(50)"),
    ("revenue_status", "ALTER TABLE startups ADD COLUMN revenue_status VARCHAR(50)"),
    ("revenue_range", "ALTER TABLE startups ADD COLUMN revenue_range VARCHAR(50)"),
    ("retention_level", "ALTER TABLE startups ADD COLUMN retention_level VARCHAR(20)"),
    
    # Section 5: Market & Business
    ("customer_type", "ALTER TABLE startups ADD COLUMN customer_type VARCHAR(10)"),
    ("market_size", "ALTER TABLE startups ADD COLUMN market_size VARCHAR(20)"),
    ("monetization_model", "ALTER TABLE startups ADD COLUMN monetization_model VARCHAR(100)"),
    ("competition_level", "ALTER TABLE startups ADD COLUMN competition_level VARCHAR(20)"),
    
    # Section 6: Roadmap & Intent
    ("next_milestone", "ALTER TABLE startups ADD COLUMN next_milestone TEXT"),
    ("current_bottleneck", "ALTER TABLE startups ADD COLUMN current_bottleneck VARCHAR(100)"),
    ("fundraising_intent", "ALTER TABLE startups ADD COLUMN fundraising_intent BOOLEAN DEFAULT 0"),
    ("target_raise_stage", "ALTER TABLE startups ADD COLUMN target_raise_stage VARCHAR(50)"),
    
    # Detailed readiness sub-scores
    ("execution_score", "ALTER TABLE startups ADD COLUMN execution_score INTEGER"),
    ("traction_score", "ALTER TABLE startups ADD COLUMN traction_score INTEGER"),
    ("market_score", "ALTER TABLE startups ADD COLUMN market_score INTEGER"),
    ("team_score", "ALTER TABLE startups ADD COLUMN team_score INTEGER"),
    ("capital_efficiency_score", "ALTER TABLE startups ADD COLUMN capital_efficiency_score INTEGER"),
]

# Modify team_size type (SQLite limitation: can't directly alter column type)
# We'll handle this in the application layer by allowing string values

# Execute startup migrations
for col_name, sql in startup_migrations:
    if col_name not in existing_cols:
        print(f"Adding column: {col_name}")
        cursor.execute(sql)
    else:
        print(f"Column already exists: {col_name}")

# Get existing investor columns
cursor.execute("PRAGMA table_info(investors)")
existing_investor_cols = [col[1] for col in cursor.fetchall()]

# Investor table migrations
investor_migrations = [
    ("region_focus", "ALTER TABLE investors ADD COLUMN region_focus TEXT"),
    ("investment_thesis", "ALTER TABLE investors ADD COLUMN investment_thesis TEXT"),
    ("portfolio_companies", "ALTER TABLE investors ADD COLUMN portfolio_companies TEXT"),
]

# Execute investor migrations
for col_name, sql in investor_migrations:
    if col_name not in existing_investor_cols:
        print(f"Adding investor column: {col_name}")
        cursor.execute(sql)
    else:
        print(f"Investor column already exists: {col_name}")

conn.commit()
conn.close()

print("Migration completed successfully!")
print("Note: team_size now accepts string values like '1-2', '3-5', etc.")
print("Existing integer values will still work in the application layer.")
