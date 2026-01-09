"""
Check if test accounts exist in database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.models import User, Startup, Investor

def check_accounts():
    db = SessionLocal()
    
    try:
        # Check for startup account
        startup_user = db.query(User).filter(User.email == "demo@notion.so").first()
        if startup_user:
            print("✅ Startup account EXISTS")
            print(f"   Email: demo@notion.so")
            print(f"   Password: demo123")
            
            startup = db.query(Startup).filter(Startup.user_id == startup_user.id).first()
            if startup:
                print(f"   Startup: {startup.name}")
                print(f"   Sector: {startup.sector}")
        else:
            print("❌ Startup account NOT FOUND")
        
        print()
        
        # Check for investor account  
        investor_user = db.query(User).filter(User.email == "demo@accel.com").first()
        if investor_user:
            print("✅ Investor account EXISTS")
            print(f"   Email: demo@accel.com")
            print(f"   Password: demo123")
            
            investor = db.query(Investor).filter(Investor.user_id == investor_user.id).first()
            if investor:
                print(f"   Name: {investor.name}")
                print(f"   Firm: {investor.firm_name}")
        else:
            print("❌ Investor account NOT FOUND")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_accounts()
