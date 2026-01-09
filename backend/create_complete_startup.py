"""
Create COMPLETE startup profile with all data for scoring
This will ensure scores are calculated properly
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.models import User, Startup, UserRole, ReadinessBand, VisibilityStatus
from passlib.context import CryptContext
import uuid
import json
from datetime import datetime, date

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def create_complete_startup():
    db = SessionLocal()
    
    try:
        email = "demo@notion.so"
        password = "demo123"
        hashed = pwd_context.hash(password)
        
        print("\n🌱 Creating COMPLETE startup profile...\n")
        
        # Delete existing if any
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print("Deleting old account...")
            db.query(Startup).filter(Startup.user_id == existing.id).delete()
            db.delete(existing)
            db.commit()
        
        # Create user
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            password_hash=hashed,
            role=UserRole.STARTUP
        )
        db.add(user)
        db.flush()
        
        # Create COMPLETE startup profile with ALL fields
        startup = Startup(
            id=str(uuid.uuid4()),
            user_id=user.id,
            
            # Basic required fields
            name="Notion",
            
            # Section 1: Basic Profile
            sector="Productivity",
            stage="Series C",
            region="North America",
            location="San Francisco, CA",
            description="All-in-one workspace for notes, tasks, wikis, and databases. Notion combines the flexibility of documents with the structure of databases.",
            impact_tags=json.dumps(["Future of Work", "Education", "Productivity"]),
            website_url="https://www.notion.so",
            founded_date=date(2016, 1, 1),
            team_size="200+",
            
            # Section 2: Founder Signals
            founder_role="CEO",
            time_commitment="full_time",
            prev_startup_exp=True,
            experience_years="10+",
            cofounder_count=2,
            
            # Section 3: Product
            product_description="Connected workspace combining notes, docs, project management, and wikis. Block-based editor with custom databases.",
            
            # Section 4: Traction
            mau_range="100M+",
            user_growth_rate="50%+",
            revenue_status="profitable",
            revenue_range="$100M+",
            retention_level="high",
            
            # Section 5: Market & Business
            customer_type="B2B2C",
            market_size="large",
            monetization_model="freemium_subscription",
            competition_level="high",
            
            # Section 6: Roadmap
            next_milestone="Expand AI features and team collaboration",
            current_bottleneck="Scaling infrastructure for global growth",
            fundraising_intent="not_raising",
            target_raise_stage="Series C",
            
            # Legacy metrics
            metrics=json.dumps({
                'users_bucket': '100M+',
                'revenue_bucket': '$100M+',
                'burn_bucket': 'low'
            }),
            
            # Initial scores (will be recalculated)
            readiness_score=85,
            readiness_band=ReadinessBand.HIGH,
            public_review_score=75,  # Set a baseline score
            visibility_status=VisibilityStatus.VISIBLE,
            confidence_level="High",
            
            # Sub-scores (initialize with reasonable values)
            execution_score=80,
            traction_score=90,
            market_score=85,
            team_score=85,
            capital_efficiency_score=80
        )
        
        db.add(startup)
        db.commit()
        
        print("✅ Complete startup profile created!")
        print("\n" + "="*70)
        print("🎉 DEMO ACCOUNT WITH FULL DATA")
        print("="*70)
        print(f"\n📧 Email:    {email}")
        print(f"🔑 Password: {password}")
        print(f"\n📊 Scores initialized:")
        print(f"   - Readiness: {startup.readiness_score}/100")
        print(f"   - Public Review: {startup.public_review_score}/100")
        print(f"   - Execution: {startup.execution_score}/100")
        print(f"   - Traction: {startup.traction_score}/100")
        print(f"   - Market: {startup.market_score}/100")
        print(f"   - Team: {startup.team_score}/100")
        print(f"   - Capital Efficiency: {startup.capital_efficiency_score}/100")
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
    create_complete_startup()
