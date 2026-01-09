"""
Recreate account with EXACT auth system password hashing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.models import User, Startup, Investor, UserRole
import uuid

# Import EXACT same password hashing from auth.py
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_password_hash(password):
    """Same function as in auth.py"""
    return pwd_context.hash(password)

def recreate_accounts():
    db = SessionLocal()
    
    try:
        print("\n🔧 Recreating accounts with EXACT auth method...\n")
        
        # Startup account
        startup_email = "demo@notion.so"
        password = "demo123"
        
        # Delete if exists
        existing = db.query(User).filter(User.email == startup_email).first()
        if existing:
            print(f"Deleting old {startup_email}...")
            db.query(Startup).filter(Startup.user_id == existing.id).delete()
            db.delete(existing)
            db.commit()
        
        # Create with EXACT same hashing
        hashed_password = get_password_hash(password)
        
        user = User(
            id=str(uuid.uuid4()),
            email=startup_email,
            password_hash=hashed_password,
            role=UserRole.STARTUP
        )
        db.add(user)
        db.flush()
        
        startup = Startup(
            id=str(uuid.uuid4()),
            user_id=user.id,
            name="Notion"
        )
        db.add(startup)
        db.commit()
        
        print(f"✅ Created {startup_email}")
        
        # Test the password works
        test_verify = pwd_context.verify(password, hashed_password)
        print(f"   Password verification test: {'✅ PASS' if test_verify else '❌ FAIL'}")
        
        # Investor account
        investor_email = "demo@accel.com"
        
        existing = db.query(User).filter(User.email == investor_email).first()
        if existing:
            print(f"\nDeleting old {investor_email}...")
            db.query(Investor).filter(Investor.user_id == existing.id).delete()
            db.delete(existing)
            db.commit()
        
        inv_user = User(
            id=str(uuid.uuid4()),
            email=investor_email,
            password_hash=hashed_password,  # Same password
            role=UserRole.INVESTOR
        )
        db.add(inv_user)
        db.flush()
        
        investor = Investor(
            id=str(uuid.uuid4()),
            user_id=inv_user.id,
            name="Sarah Chen"
        )
        db.add(investor)
        db.commit()
        
        print(f"✅ Created {investor_email}")
        print(f"   Password verification test: {'✅ PASS' if test_verify else '❌ FAIL'}")
        
        print("\n" + "="*70)
        print("🎉 ACCOUNTS RECREATED WITH AUTH-COMPATIBLE PASSWORDS")
        print("="*70)
        print(f"\n🚀 STARTUP:")
        print(f"   Email:    {startup_email}")
        print(f"   Password: {password}")
        print(f"\n💼 INVESTOR:")
        print(f"   Email:    {investor_email}")
        print(f"   Password: {password}")
        print("\n" + "="*70)
        print("✅ Password hashing method: pbkdf2_sha256 (SAME as auth.py)")
        print("="*70 + "\n")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    recreate_accounts()
