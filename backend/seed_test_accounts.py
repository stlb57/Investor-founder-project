"""
Create demo login credentials - COMPATIBLE VERSION
Uses same password hashing as auth system
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db.database import SessionLocal
from models.models import User, Startup, Investor, UserRole
from passlib.context import CryptContext
import uuid

# Use SAME password context as auth.py
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def create_accounts():
    db = SessionLocal()
    
    try:
        # Credentials
        startup_email = "demo@notion.so"
        password = "demo123"
        investor_email = "demo@accel.com"
        
        # Hash password using SAME method as auth system
        hashed = pwd_context.hash(password)
        
        print("\n🌱 Creating accounts...\n")
        
        # Check for existing startup
        existing = db.query(User).filter(User.email == startup_email).first()
        if not existing:
            # Create startup user
            startup_user = User(
                id=str(uuid.uuid4()),
                email=startup_email,
                password_hash=hashed,
                role=UserRole.STARTUP
            )
            db.add(startup_user)
            db.flush()
            
            # Create startup profile  
            startup = Startup(
                id=str(uuid.uuid4()),
                user_id=startup_user.id,
                name="Notion"
            )
            db.add(startup)
            db.commit()
            print("✅ Startup account created")
        else:
            print("⚠️  Startup already exists - DELETING and recreating...")
            # Delete old password-incompatible account
            db.query(Startup).filter(Startup.user_id == existing.id).delete()
            db.delete(existing)
            db.commit()
            
            # Create new one
            startup_user = User(
                id=str(uuid.uuid4()),
                email=startup_email,
                password_hash=hashed,
                role=UserRole.STARTUP
            )
            db.add(startup_user)
            db.flush()
            
            startup = Startup(
                id=str(uuid.uuid4()),
                user_id=startup_user.id,
                name="Notion"
            )
            db.add(startup)
            db.commit()
            print("✅ Startup account recreated with correct password hash")
        
        # Check for existing investor
        existing = db.query(User).filter(User.email == investor_email).first()
        if not existing:
            # Create investor user
            investor_user = User(
                id=str(uuid.uuid4()),
                email=investor_email,
                password_hash=hashed,
                role=UserRole.INVESTOR
            )
            db.add(investor_user)
            db.flush()
            
            # Create investor profile
            investor = Investor(
                id=str(uuid.uuid4()),
                user_id=investor_user.id,
                name="Sarah Chen"
            )
            db.add(investor)
            db.commit()
            print("✅ Investor account created")
        else:
            print("⚠️  Investor already exists - DELETING and recreating...")
            db.query(Investor).filter(Investor.user_id == existing.id).delete()
            db.delete(existing)
            db.commit()
            
            investor_user = User(
                id=str(uuid.uuid4()),
                email=investor_email,
                password_hash=hashed,
                role=UserRole.INVESTOR
            )
            db.add(investor_user)
            db.flush()
            
            investor = Investor(
                id=str(uuid.uuid4()),
                user_id=investor_user.id,
                name="Sarah Chen"
            )
            db.add(investor)
            db.commit()
            print("✅ Investor account recreated with correct password hash")
        
        print("\n" + "="*70)
        print("🎉 DEMO CREDENTIALS (PASSWORD HASH FIXED!)")
        print("="*70)
        print("\n🚀 STARTUP:")
        print(f"   Email:    {startup_email}")
        print(f"   Password: {password}")
        print("\n💼 INVESTOR:")
        print(f"   Email:    {investor_email}")
        print(f"   Password: {password}")
        print("\n" + "="*70)
        print("Login at: http://localhost:3001/auth/login")
        print("="*70 + "\n")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    create_accounts()
