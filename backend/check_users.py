from db.database import SessionLocal
from models.models import User, Startup

db = SessionLocal()

users = db.query(User).all()
print(f'\nTotal users: {len(users)}')
for u in users:
    print(f'  - {u.email} ({u.role})')
    startup = db.query(Startup).filter(Startup.user_id == u.id).first()
    if startup:
        print(f'     Startup: {startup.name}')
        print(f'     Readiness: {startup.readiness_score}')
        print(f'     Public Review: {startup.public_review_score}')

db.close()
