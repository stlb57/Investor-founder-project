"""
Quick script to recreate the database with the updated schema
Run this from the backend directory: python recreate_db.py
"""

import os
from db.database import engine
from models.models import Base

# Delete old database if it exists
db_path = "signalfund.db"
if os.path.exists(db_path):
    os.remove(db_path)
    print(f"Deleted old database: {db_path}")

# Recreate all tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

print("✅ Database recreated successfully with updated schema!")
print("You can now restart your server: uvicorn main:app --reload")



