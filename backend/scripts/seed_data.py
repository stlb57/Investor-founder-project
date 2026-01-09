import sqlite3
import uuid
import random
import re
from datetime import datetime, timedelta

db_path = 'signalfund_v2.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

SECTORS = ["Fintech", "Healthtech", "Edtech", "SaaS", "AI / ML", "GreenTech", "Logistics", "Web3", "Ecommerce", "Cybersecurity", "Agritech"]
STAGES = ["Pre-seed", "Seed", "Series A", "Series B"]
LOCATIONS = ["San Francisco, CA", "New York, NY", "London, UK", "Berlin, Germany", "Singapore", "Bangalore, India", "Tel Aviv, Israel", "Austin, TX", "Toronto, Canada"]
IMPACT_TAGS_POOL = ["Environment Friendly", "Climate Tech", "Healthcare Access", "Education", "Financial Inclusion", "Women-Led", "Rural / Tier-2", "Accessibility", "Open Source"]

STARTUP_NAMES = [
    "Nexus", "Quantum", "Apex", "Flow", "Sync", "Orbit", "Pulse", "Zenith", "Core", "Vortex",
    "Lumina", "Stellar", "Nova", "Ignite", "Aether", "Prism", "Flux", "Catalyst", "Velocity", "Summit",
    "Echo", "Rift", "Drift", "Shift", "Grid", "Matrix", "Node", "Link", "Edge", "Horizon",
    "Cloud", "Stream", "Peak", "Valley", "Ridge", "Coast", "Ocean", "River", "Forest", "Stone",
    "Iron", "Gold", "Silver", "Neon", "Argon", "Krypton", "Xenon", "Helium", "Hydrogen", "Oxygen"
]
SUFFIXES = ["Labs", "Systems", "Technologies", "Corp", "Inc", "Partners", "Dynamics", "Intelligence", "Security", "Health"]

def generate_random_startup(index):
    base_name = f"{random.choice(STARTUP_NAMES)} {random.choice(SUFFIXES)}"
    name = f"{index + 1}. {base_name}" # Guaranteed unique name
    
    sector = random.choice(SECTORS)
    stage = random.choice(STAGES)
    location = random.choice(LOCATIONS)
    readiness = random.randint(10, 95)
    
    # Impact tags (1-3)
    tags = random.sample(IMPACT_TAGS_POOL, random.randint(1, 3))
    
    return {
        "name": name,
        "slug": slugify(name),
        "sector": sector,
        "stage": stage,
        "location": location,
        "readiness_score": readiness,
        "description": f"Next-generation {sector} platform focusing on {location} market with innovative {stage} execution.",
        "impact_tags": tags
    }

try:
    print(f"Seeding 120 startups...")
    
    for i in range(120):
        data = generate_random_startup(i)
        user_id = str(uuid.uuid4())
        startup_id = str(uuid.uuid4())
        email = f"founder_{i}_{random.randint(1000,9999)}@example.com"
        
        # 1. Create User
        cursor.execute(
            "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)",
            (user_id, email, "hashed_password", "startup")
        )
        
        # 2. Create Startup
        import json
        cursor.execute(
            """INSERT INTO startups 
               (id, user_id, name, slug, sector, stage, location, description, visibility_status, readiness_score, impact_tags, metrics) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                startup_id, user_id, data['name'], data['slug'], data['sector'], 
                data['stage'], data['location'], data['description'], 
                'VISIBLE', data['readiness_score'], json.dumps(data['impact_tags']),
                json.dumps({'users_bucket': '1k-10k', 'revenue_bucket': '0-10k', 'burn_bucket': 'low'})
            )
        )
        
        # 3. Create 3-5 Timeline Events for each
        num_events = random.randint(3, 7)
        base_date = datetime.now() - timedelta(days=200)
        
        for j in range(num_events):
            event_id = str(uuid.uuid4())
            event_date = base_date + timedelta(days=j*30 + random.randint(1,15))
            event_type = random.choice(['MILESTONE', 'PRODUCT', 'TEAM', 'FUNDING'])
            
            cursor.execute(
                """INSERT INTO timeline_events 
                   (id, startup_id, investor_id, event_date, event_type, title, description, confidence, impact_score) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    event_id, startup_id, None, event_date.date().isoformat(), event_type, 
                    f"{event_type.capitalize()} Goal {j+1}", 
                    f"Successfully achieved significant progress in {event_type.lower()}.",
                    'VERIFIED', random.randint(5, 10)
                )
            )

    # 4. Seed a test investor profile and timeline if they don't exist
    # (Optional, but helps for testing the new timeline feature)
    # Finding a user with investor role
    cursor.execute("SELECT id FROM users WHERE role = 'investor' LIMIT 1")
    investor_user = cursor.fetchone()
    if investor_user:
        user_id = investor_user[0]
        cursor.execute("SELECT id FROM investors WHERE user_id = ?", (user_id,))
        investor = cursor.fetchone()
        if investor:
            investor_id = investor[0]
            # Add some investor events
            for i in range(3):
                cursor.execute(
                    """INSERT INTO timeline_events (id, investor_id, event_date, event_type, title, description)
                       VALUES (?, ?, ?, ?, ?, ?)""",
                    (str(uuid.uuid4()), investor_id, (datetime.now() - timedelta(days=i*60)).date().isoformat(), 
                     'INVESTMENT', f"Portfolio Investment #{i+1}", f"Invested in a high-growth startup during their {random.choice(STAGES)} round.")
                )

    conn.commit()
    print(f"Successfully seeded 120 startups and refreshed investor data.")

except Exception as e:
    print(f"Error during seeding: {e}")
    conn.rollback()
finally:
    conn.close()
