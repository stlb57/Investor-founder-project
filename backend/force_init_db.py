
import os
import sys

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db.database import engine, Base
from models.models import User, Investor, Startup, TimelineEvent, ReadinessScore, InvestorFitScore, Introduction, InvestorInterest, ProfileView, WatchlistEntry

print("Creating database tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
    print(f"Database URL: {engine.url}")
except Exception as e:
    print(f"Error creating tables: {e}")
