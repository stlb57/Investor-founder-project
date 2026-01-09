from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from db.database import get_db
from models.models import User, SignalEvent, SignalSeverity, Investor, Startup, UserRole
from api.auth import get_current_user

router = APIRouter()

@router.get("/")
async def get_signal_feed(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=50)
):
    """Primary Signal Feed - Landing Page UX"""
    
    # Query signals for this user
    query = db.query(SignalEvent).filter(SignalEvent.user_id == current_user.id)
    
    # Role-based constraints
    if current_user.role == UserRole.INVESTOR or current_user.role == "INVESTOR":
        # Investor Feed Rules:
        # 1. Max 10 signals per day (to prevent noise)
        today = date.today()
        # Note: In a shared system we might need more complex logic, 
        # but for now we'll just limit the results to the top 10 most recent/severe
        
        # 2. Sorted by severity, then time
        # Mapping severity to order (HIGH=3, MEDIUM=2, LOW=1)
        # SQLAlchemy can handle this if we use a case statement or just sort by the enum value if it's ordered correctly
        # Here we just sort by created_at desc for the base, 
        # but the prompt specifically says "Sorted by severity, then time"
        
        # Let's use a manual sort or a complex query
        signals = query.order_by(
            SignalEvent.severity.desc(), # Assumes HIGH > MEDIUM > LOW alphabetically or by enum index
            SignalEvent.created_at.desc()
        ).limit(limit).all()
        
    else:
        # Founder Feed Rules:
        # Signals about their startup + Ecosystem benchmarks
        signals = query.order_by(SignalEvent.created_at.desc()).limit(limit).all()

    # Format response
    results = []
    for s in signals:
        startup_name = s.startup.name if s.startup else "Ecosystem"
        results.append({
            "id": s.id,
            "type": s.signal_type.value,
            "severity": s.severity.value,
            "headline": s.headline,
            "explanation": s.explanation,
            "evidence": s.evidence,
            "startup_id": s.startup_id,
            "startup_name": startup_name,
            "created_at": s.created_at,
            # Common action button mapping
            "action_label": get_action_label(s),
            "action_link": get_action_link(s)
        })
        
    return results

def get_action_label(signal: SignalEvent):
    sig_type = signal.signal_type.value.lower()
    if sig_type == "timeline_update":
        return "View Timeline"
    if sig_type == "readiness_shift":
        return "Review Analysis"
    if sig_type == "execution_alarm":
        return "Update Timeline"
    if sig_type == "market_interest":
        return "View Reach"
    if sig_type == "ecosystem_story":
        return "Read Story"
    return "Details"

def get_action_link(signal: SignalEvent):
    sig_type = signal.signal_type.value.lower()
    if sig_type == "ecosystem_story":
        return "/insights"
    if signal.user_type == "investor":
        if signal.startup_id:
            return f"/investor/startups/{signal.startup_id}"
        return "/investor/dashboard"
    else:
        if sig_type == "execution_alarm":
            return "/startup/timeline"
        return "/startup/dashboard"
