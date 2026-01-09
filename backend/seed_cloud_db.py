import os
import uuid
import json
import random
from datetime import date, datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from models import models
from models.models import (
    UserRole, InvestorType, ImpactDepth, ReadinessBand, VisibilityStatus,
    EventType, ConfidenceLevel, SignalType, SignalSeverity, StoryType
)
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL or "postgres" not in DATABASE_URL:
    print("ERROR: DATABASE_URL is missing or likely incorrect (sqlite?).")
    print("Please set DATABASE_URL environment variable.")
    exit(1)

print(f"Connecting to: {DATABASE_URL.split('@')[-1]}")

try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    print(f"Connection failed: {e}")
    exit(1)

# Use pbkdf2_sha256 to match backend config
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed():
    db = SessionLocal()
    try:
        print("--- Starting Comprehensive Seeding ---")
        
        # Optional: Clear data (Uncomment if needed, but risky in prod)
        # db.query(models.SignalEvent).delete()
        # db.query(models.Story).delete()
        # db.query(models.TimelineEvent).delete()
        # db.query(models.Startup).delete()
        # db.query(models.Investor).delete()
        # db.query(models.User).delete()
        # db.commit()

        # --- INVESTORS ---
        print("Seeding Investors...")
        investors_data = [
            {
                "email": "sarah.ventures@example.com",
                "name": "Sarah Chen",
                "firm": "Apex Ventures",
                "type": InvestorType.VC,
                "thesis": "Backing AI-native vertical SaaS and deep tech infrastructure.",
                "check_min": 500000, "check_max": 2000000,
                "stage": ["Seed", "Series A"], "sector": ["AI", "SaaS"]
            },
            {
                "email": "mike.angel@example.com",
                "name": "Mike Ross",
                "firm": "Independent Angel",
                "type": InvestorType.ANGEL,
                "thesis": "Former founder investing in early-stage consumer social and marketplaces.",
                "check_min": 10000, "check_max": 50000,
                "stage": ["Pre-Seed"], "sector": ["Consumer", "Marketplace"]
            },
            {
                "email": "green.fund@example.com",
                "name": "Elena Rodriguez",
                "firm": "Gaia Impact Capital",
                "type": InvestorType.VC,
                "thesis": "Climate tech and sustainable supply chain solutions.",
                "check_min": 1000000, "check_max": 5000000,
                "stage": ["Series A", "Series B"], "sector": ["ClimateTech", "Energy"]
            },
            {
                "email": "corp.dev@techgiant.com",
                "name": "David Kim",
                "firm": "TechGiant Ventures",
                "type": InvestorType.CVC,
                "thesis": "Strategic investments in cloud infrastructure and cybersecurity.",
                "check_min": 2000000, "check_max": 10000000,
                "stage": ["Series B", "Growth"], "sector": ["Cybersecurity", "Cloud"]
            },
            {
                "email": "early.bird@accelerator.com",
                "name": "Jessica Lee",
                "firm": "Launchpad YC",
                "type": InvestorType.ACCELERATOR,
                "thesis": "High-velocity pre-seed startups across all sectors.",
                "check_min": 125000, "check_max": 500000,
                "stage": ["Pre-Seed"], "sector": ["Generalist"]
            }
        ]

        for inv in investors_data:
            existing = db.query(models.User).filter(models.User.email == inv["email"]).first()
            if not existing:
                user = models.User(email=inv["email"], password_hash=get_password_hash("password123"), role=UserRole.INVESTOR)
                db.add(user)
                db.commit()
                db.refresh(user)
                investor = models.Investor(
                    user_id=user.id, name=inv["name"], firm_name=inv["firm"], investor_type=inv["type"],
                    investment_thesis=inv["thesis"], check_size_min=inv["check_min"], check_size_max=inv["check_max"],
                    stage_focus=json.dumps(inv["stage"]), sector_focus=json.dumps(inv["sector"])
                )
                db.add(investor)
        db.commit()

        # --- STARTUPS (High Quality Data) ---
        print("Seeding Startups...")
        startups_list = [
            {
                "name": "NeuralFlow", "sector": "AI Infrastructure", "stage": "Seed", "web": "https://neuralflow.ai",
                "desc": "Optimized GPU orchestration for LLM inference at scale.",
                "team": "3-5", "rev_status": "early_revenue", "rev_range": "$10k-$50k", "growth": "10-20%",
                "founder": "Alex Zhang", "role": "CEO (ex-NVIDIA)", "exp": "6-10", "commit": "full_time"
            },
            {
                "name": "DataScribe", "sector": "Enterprise AI", "stage": "Series A", "web": "https://datascribe.health",
                "desc": "Automated medical transcription and coding for hospital systems.",
                "team": "10-20", "rev_status": "scaling", "rev_range": "$100k-$500k", "growth": "20-50%",
                "founder": "Dr. Emily Chen", "role": "CEO (MD/PhD)", "exp": "10+", "commit": "full_time"
            },
            {
                "name": "Visionary", "sector": "Generative AI", "stage": "Pre-Seed", "web": "https://visionary.io",
                "desc": "Text-to-video generation for marketing teams.",
                "team": "1-2", "rev_status": "pre_revenue", "rev_range": "$0", "growth": "0%",
                "founder": "Sam Altman (Not that one)", "role": "CTO", "exp": "3-5", "commit": "full_time"
            },
            {
                "name": "VaultX", "sector": "Fintech", "stage": "Series A", "web": "https://vaultx.crypto",
                "desc": "Secure, multi-sig crypto custody for family offices.",
                "team": "15-30", "rev_status": "scaling", "rev_range": "$500k-$1M", "growth": "100%+",
                "founder": "Crypto King", "role": "CEO", "exp": "6-10", "commit": "full_time"
            },
            {
                "name": "AgriSense", "sector": "AgTech", "stage": "Series A", "web": "https://agrisense.com",
                "desc": "Drone analytics for crop yield maximization using multispectral imaging.",
                "team": "15", "rev_status": "scaling", "rev_range": "$200k-$500k", "growth": "15-25%",
                "founder": "Farmer John", "role": "CEO", "exp": "10+", "commit": "full_time"
            },
            {
                "name": "BioSynthetix", "sector": "Biotech", "stage": "Series A", "web": "https://biosynthetix.bio",
                "desc": "AI-driven protein folding for rapid drug discovery.",
                "team": "12", "rev_status": "pre_revenue", "rev_range": "$0", "growth": "N/A",
                "founder": "Sarah PhD", "role": "CSO", "exp": "10+", "commit": "full_time"
            },
            {
                "name": "RetailOS", "sector": "RetailTech", "stage": "Seed", "web": "https://retailos.store",
                "desc": "Inventory management and POS for independent boutiques.",
                "team": "5", "rev_status": "early_revenue", "rev_range": "$5k-$20k", "growth": "5-10%",
                "founder": "Shop Keeper", "role": "CEO", "exp": "3-5", "commit": "full_time"
            },
             {
                "name": "EcoHome", "sector": "Consumer", "stage": "Series A", "web": "https://ecohome.iot",
                "desc": "Smart home hub for energy efficiency optimization and grid balancing.",
                "team": "10", "rev_status": "scaling", "rev_range": "$50k-$100k", "growth": "30%",
                "founder": "Green Guy", "role": "CEO", "exp": "6-10", "commit": "full_time"
            },
            {
                "name": "PetConnect", "sector": "PetTech", "stage": "Pre-Seed", "web": "https://petconnect.app",
                "desc": "Uber for dog walking with vet tele-health included.",
                "team": "2", "rev_status": "pre_revenue", "rev_range": "$0", "growth": "0%",
                "founder": "Dog Lover", "role": "CEO", "exp": "0-2", "commit": "full_time"
            },
            {
                "name": "CleanOcean", "sector": "ClimateTech", "stage": "Pre-Seed", "web": "https://cleanocean.org",
                "desc": "Autonomous drones for plastic waste collection in harbors.",
                "team": "3", "rev_status": "pre_revenue", "rev_range": "$0", "growth": "N/A",
                "founder": "Captain Planet", "role": "CEO", "exp": "3-5", "commit": "full_time"
            },
            {
                "name": "GameGuild", "sector": "Gaming", "stage": "Seed", "web": "https://gameguild.gg",
                "desc": "Coaching platform for esports aspirants.",
                "team": "4", "rev_status": "early_revenue", "rev_range": "$2k-$10k", "growth": "20%",
                "founder": "Pro Gamer", "role": "CEO", "exp": "3-5", "commit": "full_time"
            },
            {
                "name": "LegalEagle", "sector": "LegalTech", "stage": "Pre-Seed", "web": "https://legaleagle.ai",
                "desc": "Contract review automation for SMBs.",
                "team": "2", "rev_status": "pre_revenue", "rev_range": "$0", "growth": "0%",
                "founder": "Lawyer X", "role": "CEO", "exp": "6-10", "commit": "part_time"
            },
            {
                "name": "WorkSync", "sector": "HR Tech", "stage": "Series A", "web": "https://worksync.io",
                "desc": "Async collaboration tool for remote engineering teams.",
                "team": "15", "rev_status": "scaling", "rev_range": "$100k+", "growth": "40%",
                "founder": "Remote Worker", "role": "CTO", "exp": "10+", "commit": "full_time"
            },
             {
                "name": "LogiChain", "sector": "Supply Chain", "stage": "Seed", "web": "https://logichain.io",
                "desc": "Real-time container tracking using satellite data.",
                "team": "8", "rev_status": "early_revenue", "rev_range": "$10k", "growth": "10%",
                "founder": "Supply Chain Guru", "role": "COO", "exp": "6-10", "commit": "full_time"
            }
        ]
        
        # Multiply to get ~30
        startups_list = startups_list * 2 + startups_list[:2]
        
        created_startups = []
        for i, s_data in enumerate(startups_list):
            slug = f"{s_data['name'].lower().replace(' ', '-')}-{i}"
            email = f"founder{i}@{slug}.com"
            
            existing = db.query(models.User).filter(models.User.email == email).first()
            if not existing:
                user = models.User(email=email, password_hash=get_password_hash("password123"), role=UserRole.STARTUP)
                db.add(user)
                db.commit()
                db.refresh(user)

                # Correlated scores to fix 'vertical line' issue
                # Higher execution often correlates with higher traction and readiness
                base_competence = random.randint(40, 95)
                exec_score = min(100, max(0, base_competence + random.randint(-10, 10)))
                market_score = min(100, max(0, base_competence + random.randint(-20, 20)))
                
                # Traction depends heavily on stage
                if s_data["stage"] in ["Series A", "Series B"]:
                    traction_score = random.randint(70, 95)
                    readiness_band = ReadinessBand.HIGH
                elif s_data["stage"] == "Seed":
                    traction_score = random.randint(30, 60)
                    readiness_band = ReadinessBand.MEDIUM
                else: # Pre-seed
                    traction_score = random.randint(10, 40)
                    readiness_band = ReadinessBand.EARLY

                readiness_score = int((exec_score * 0.3) + (market_score * 0.2) + (traction_score * 0.3) + (base_competence * 0.2))

                startup = models.Startup(
                    user_id=user.id,
                    name=s_data["name"] if i < 14 else f"{s_data['name']} {i}", # Unique names
                    slug=slug,
                    sector=s_data["sector"],
                    stage=s_data["stage"],
                    website_url=s_data["web"],
                    description=s_data["desc"],
                    team_size=s_data["team"],
                    
                    # Founder Signals
                    founder_role=s_data["role"],
                    experience_years=s_data["exp"],
                    time_commitment=s_data["commit"],
                    prev_startup_exp=bool(random.getrandbits(1)),
                    
                    # Traction
                    revenue_status=s_data["rev_status"],
                    revenue_range=s_data["rev_range"],
                    user_growth_rate=s_data["growth"],
                    
                    region="North America",
                    visibility_status=VisibilityStatus.VISIBLE,
                    
                    readiness_score=readiness_score,
                    execution_score=exec_score,
                    market_score=market_score,
                    traction_score=traction_score,
                    readiness_band=readiness_band,
                    public_review_score=random.randint(60, 95)
                )
                db.add(startup)
                db.commit()
                db.refresh(startup)
                created_startups.append(startup)
                
                # --- TIMELINE EVENTS ---
                # Add funding history or milestones
                events = []
                if s_data["stage"] != "Pre-Seed":
                     # Funding Event
                     events.append(models.TimelineEvent(
                         startup_id=startup.id,
                         event_date=date.today() - timedelta(days=random.randint(100, 365)),
                         event_type=EventType.FUNDING,
                         title=f"Closed {s_data['stage']} Round",
                         description=f"Raised capital to accelerate {s_data['sector']} growth.",
                         confidence=ConfidenceLevel.VERIFIED,
                         impact_score=8
                     ))
                
                # Product Launch
                events.append(models.TimelineEvent(
                     startup_id=startup.id,
                     event_date=date.today() - timedelta(days=random.randint(30, 90)),
                     event_type=EventType.PRODUCT,
                     title="V1 Product Launch",
                     description="Initial release to beta customers.",
                     confidence=ConfidenceLevel.SELF_REPORTED,
                     impact_score=6
                ))
                
                for ev in events:
                    db.add(ev)

        db.commit()

        # --- INSIGHTS / STORIES ---
        print("Seeding Stories/Insights...")
        stories = [
            {
                "title": "The Rise of Vertical AI in Healthcare",
                "slug": "vertical-ai-healthcare-2024",
                "type": StoryType.ECOSYSTEM_INSIGHT,
                "summary": "Why specialized models like DataScribe are outperforming generalized LLMs in clinical settings.",
                "content": json.dumps({"blocks": [{"type": "paragraph", "text": "Vertical AI is eating the world..."}]}),
                "tags": json.dumps(["AI", "Healthcare", "Trends"])
            },
            {
                "title": "Market Momentum: Fintech Infrastructure",
                "slug": "fintech-infra-momentum",
                "type": StoryType.ECOSYSTEM_INSIGHT,
                "summary": "Infrastructure plays like VaultX are seeing 3x higher deal flow than consumer fintech apps this quarter.",
                "content": json.dumps({"blocks": [{"type": "paragraph", "text": "Investors are fleeing to safety..."}]}),
                "tags": json.dumps(["Fintech", "Infrastructure"])
            },
             {
                "title": "Decision Memo: Why We Passed on Visionary",
                "slug": "decision-memo-visionary",
                "type": StoryType.DECISION_STORY,
                "summary": "A deep dive into the competitive landscape of generative video and why execution speed matters more than the model.",
                "content": json.dumps({"blocks": [{"type": "paragraph", "text": "Visionary has great tech but..."}]}),
                "tags": json.dumps(["GenAI", "Decision Memo"])
            }
        ]
        
        for s in stories:
            existing_story = db.query(models.Story).filter(models.Story.slug == s["slug"]).first()
            if not existing_story:
                story = models.Story(
                    title=s["title"], slug=s["slug"], type=s["type"],
                    summary=s["summary"], content=s["content"], related_tags=s["tags"]
                )
                db.add(story)
        
        db.commit()
        print("--- Seeding Complete! ---")

    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
