from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.models import Startup
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

engine = create_engine("sqlite:///./signalfund_v2.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    startups = db.query(Startup).filter(Startup.slug == None).all()
    print(f"Found {len(startups)} startups without slugs.")
    
    for startup in startups:
        base_slug = slugify(startup.name)
        slug = base_slug
        counter = 1
        while db.query(Startup).filter(Startup.slug == slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        startup.slug = slug
        print(f"Generated slug '{slug}' for startup '{startup.name}'")
    
    db.commit()
    print("Successfully updated slugs.")
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
