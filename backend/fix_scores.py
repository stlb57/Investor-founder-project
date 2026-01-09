"""
Simple fix: Just update the existing account to have scores
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from db.database import SessionLocal
import json

def fix_startup_scores():
    db = SessionLocal()
    
    try:
        email = "demo@notion.so"
        
        print("\n🔧 Updating startup profile with scores...\n")
        
        # Update startup with scores using raw SQL to avoid type issues
        db.execute(text("""
            UPDATE startups 
            SET 
                readiness_score = 85,
                readiness_band = 'HIGH',
                public_review_score = 75,
                execution_score = 80,
                traction_score = 90,
                market_score = 85,
                team_score = 85,
                capital_efficiency_score = 80,
                sector = 'Productivity',
                stage = 'Series C',
                location = 'San Francisco, CA',
                description = 'All-in-one workspace for notes, tasks, wikis, and databases',
                website_url = 'https://www.notion.so',
                team_size = '200+',
                visibility_status = 'VISIBLE',
                metrics = :metrics
            WHERE user_id = (SELECT id FROM users WHERE email = :email)
        """), {
            "email": email,
            "metrics": json.dumps({
                'users_bucket': '100M+',
                'revenue_bucket': '$100M+',
                'burn_bucket': 'low'
            })
        })
        
        db.commit()
        
        print("✅ Startup profile updated with scores!")
        print("\n" + "="*70)
        print("📊 SCORES SET:")
        print("="*70)
        print("   - Readiness Score: 85/100")
        print("   - Public Review: 75/100")
        print("   - Execution: 80/100")
        print("   - Traction: 90/100")
        print("   - Market: 85/100")
        print("   - Team: 85/100")
        print("   - Capital Efficiency: 80/100")
        print("\n" + "="*70)
        print("✅ Login and check your dashboard NOW!")
        print(f"📧 Email: {email}")
        print("🔑 Password: demo123")
        print("🌐 URL: http://localhost:3001/auth/login")
        print("="*70 + "\n")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    fix_startup_scores()
