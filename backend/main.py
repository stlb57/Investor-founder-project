from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from db.database import get_db, engine
from api import auth, investors, startups, scoring, introductions, ecosystem, feed, insights
from models import models

load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ScaleX API",
    description="AI Decision Support for Startup Funding",
    version="1.0.0"
)

# CORS middleware
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(investors.router, prefix="/api/investors", tags=["investors"])
app.include_router(startups.router, prefix="/api/startups", tags=["startups"])
app.include_router(scoring.router, prefix="/api/scoring", tags=["scoring"])
app.include_router(introductions.router, prefix="/api/introductions", tags=["introductions"])
app.include_router(ecosystem.router, prefix="/api/ecosystem", tags=["ecosystem"])
app.include_router(feed.router, prefix="/api/feed", tags=["feed"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])

@app.get("/")
async def root():
    return {"message": "ScaleX API - Funding Signal Intelligence Layer"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "scalex-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)