"""
Database Migration Script
Adds missing columns to existing database schema

Run this if you have an existing database that needs to be updated.
For fresh installs, just delete signalfund.db and recreate it.
"""

import sqlite3
import os

DB_PATH = "signalfund_v2.db"

if not os.path.exists(DB_PATH):
    print("Database file not found. Run the normal initialization instead.")
    exit(1)

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

print("Migrating database schema...")

try:
    # Check and add investors.type column
    cursor.execute("PRAGMA table_info(investors)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'type' not in columns:
        print("Adding 'type' column to investors table...")
        cursor.execute("ALTER TABLE investors ADD COLUMN type VARCHAR(50)")
    
    # Check and add startups.impact_depth column
    cursor.execute("PRAGMA table_info(startups)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'impact_depth' not in columns:
        print("Adding 'impact_depth' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN impact_depth VARCHAR(50)")
    
    # Check and add startups.description column
    if 'description' not in columns:
        print("Adding 'description' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN description TEXT")
    
    # Check and add startups.founded_date column
    if 'founded_date' not in columns:
        print("Adding 'founded_date' column to startups table...")
        # Since SQLite ALTER TABLE has limited support for adding DATE columns,
        # we'll add it as existing type constraints allow. Date columns are typically stored
        # as strings or numbers in SQLite.
        cursor.execute("ALTER TABLE startups ADD COLUMN founded_date DATE")
    
    # Check and add startups.location column
    if 'location' not in columns:
        print("Adding 'location' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN location VARCHAR(100)")
    
    # Check and add startups.website_url column
    if 'website_url' not in columns:
        print("Adding 'website_url' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN website_url VARCHAR(500)")
    
    # Check and add startups.readiness_score column
    if 'readiness_score' not in columns:
        print("Adding 'readiness_score' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN readiness_score INTEGER")
    
    # Check and add startups.readiness_band column
    if 'readiness_band' not in columns:
        print("Adding 'readiness_band' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN readiness_band VARCHAR(50)")
    
    # Check and add startups.public_review_score column
    if 'public_review_score' not in columns:
        print("Adding 'public_review_score' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN public_review_score INTEGER")
    
    # Check and add startups.confidence_level column
    if 'confidence_level' not in columns:
        print("Adding 'confidence_level' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN confidence_level VARCHAR(50)")
    
    # Check and add startups.visibility_status column
    if 'visibility_status' not in columns:
        print("Adding 'visibility_status' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN visibility_status VARCHAR(50) DEFAULT 'hidden'")
    
    # Check and add startups.metrics column
    if 'metrics' not in columns:
        print("Adding 'metrics' column to startups table...")
        cursor.execute("ALTER TABLE startups ADD COLUMN metrics TEXT")
    
    # Check and add introductions.intro_message column
    cursor.execute("PRAGMA table_info(introductions)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'intro_message' not in columns:
        print("Adding 'intro_message' column to introductions table...")
        cursor.execute("ALTER TABLE introductions ADD COLUMN intro_message TEXT")
    
    conn.commit()
    print("Migration completed successfully!")
    
except sqlite3.Error as e:
    print(f"Migration error: {e}")
    conn.rollback()
finally:
    conn.close()



