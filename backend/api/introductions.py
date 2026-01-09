from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from db.database import get_db
from models.models import (
    User, Investor, Startup, Introduction,
    IntroductionStatus, IntroductionOutcome, UserRole, VisibilityStatus
)
from api.auth import get_current_user

router = APIRouter()

class IntroductionRequest(BaseModel):
    startup_id: str
    intro_message: Optional[str] = None  # Single message from investor to startup

class IntroductionResponse(BaseModel):
    introduction_id: str
    response: str  # 'accepted' or 'declined'

class OutcomeUpdate(BaseModel):
    outcome: str  # 'meeting', 'pass', 'invested'
    notes: Optional[str] = None

@router.post("/request")
async def request_introduction(
    request_data: IntroductionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Investor requests introduction to startup with a single message"""
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor profile not found")
    
    startup = db.query(Startup).filter(Startup.id == request_data.startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    if startup.visibility_status != VisibilityStatus.VISIBLE:
        raise HTTPException(status_code=403, detail="Startup not available for introductions")
    
    # Check for existing introduction
    existing = db.query(Introduction).filter(
        Introduction.investor_id == investor.id,
        Introduction.startup_id == startup.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Introduction already requested")
    
    introduction = Introduction(
        investor_id=investor.id,
        startup_id=startup.id,
        status=IntroductionStatus.REQUESTED,
        intro_message=request_data.intro_message  # Single message, no back-and-forth
    )
    
    db.add(introduction)
    db.commit()
    db.refresh(introduction)
    
    return {
        "id": str(introduction.id),
        "message": "Introduction requested",
        "startup_name": startup.name
    }

@router.get("/requests")
async def get_introduction_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get introduction requests (for startups)"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
    
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
    
    requests = db.query(Introduction, Investor.name).join(
        Investor, Introduction.investor_id == Investor.id
    ).filter(
        Introduction.startup_id == startup.id,
        Introduction.status == IntroductionStatus.REQUESTED
    ).order_by(Introduction.requested_at.desc()).all()
    
    return [
        {
            "id": str(introduction.id),
            "investor_name": investor_name,
            "intro_message": introduction.intro_message,  # Show the single message
            "requested_at": introduction.requested_at.isoformat() if introduction.requested_at else None,
            "status": introduction.status.value
        }
        for introduction, investor_name in requests
    ]

@router.post("/respond")
async def respond_to_introduction(
    response_data: IntroductionResponse,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Startup responds to introduction request"""
    if current_user.role != UserRole.STARTUP:
        raise HTTPException(status_code=403, detail="Startup access only")
    
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
    
    introduction = db.query(Introduction).filter(
        Introduction.id == response_data.introduction_id,
        Introduction.startup_id == startup.id,
        Introduction.status == IntroductionStatus.REQUESTED
    ).first()
    
    if not introduction:
        raise HTTPException(status_code=404, detail="Introduction request not found")
    
    # Set status based on response
    if response_data.response.lower() == 'accepted':
        introduction.status = IntroductionStatus.ACCEPTED
    else:
        introduction.status = IntroductionStatus.DECLINED
    
    introduction.responded_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Introduction {response_data.response}"}

@router.get("/status")
async def get_introduction_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get introduction status for current user"""
    if current_user.role == UserRole.INVESTOR or current_user.role == "INVESTOR":
        investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
        if not investor:
            raise HTTPException(status_code=404, detail="Investor profile not found")
        
        introductions = db.query(Introduction, Startup.name).join(
            Startup, Introduction.startup_id == Startup.id
        ).filter(
            Introduction.investor_id == investor.id
        ).order_by(Introduction.requested_at.desc()).all()
        
        return [
            {
                "id": str(introduction.id),
                "startup_name": startup_name,
                "intro_message": introduction.intro_message,
                "status": introduction.status.value if introduction.status else None,
                "requested_at": introduction.requested_at.isoformat() if introduction.requested_at else None,
                "responded_at": introduction.responded_at.isoformat() if introduction.responded_at else None,
                "outcome": introduction.outcome.value if introduction.outcome else None
            }
            for introduction, startup_name in introductions
        ]
    
    elif current_user.role == UserRole.STARTUP or current_user.role == "STARTUP":
        startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
        if not startup:
            raise HTTPException(status_code=404, detail="Startup profile not found")
        
        introductions = db.query(Introduction, Investor.name).join(
            Investor, Introduction.investor_id == Investor.id
        ).filter(
            Introduction.startup_id == startup.id
        ).order_by(Introduction.requested_at.desc()).all()
        
        return [
            {
                "id": str(introduction.id),
                "investor_name": investor_name,
                "intro_message": introduction.intro_message,
                "status": introduction.status.value if introduction.status else None,
                "requested_at": introduction.requested_at.isoformat() if introduction.requested_at else None,
                "responded_at": introduction.responded_at.isoformat() if introduction.responded_at else None,
                "outcome": introduction.outcome.value if introduction.outcome else None
            }
            for introduction, investor_name in introductions
        ]

@router.post("/outcome/{introduction_id}")
async def update_outcome(
    introduction_id: str,
    outcome_data: OutcomeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update introduction outcome (both parties can update)"""
    introduction = db.query(Introduction).filter(
        Introduction.id == introduction_id
    ).first()
    
    if not introduction:
        raise HTTPException(status_code=404, detail="Introduction not found")
    
    # Verify user has access to this introduction
    if current_user.role == UserRole.INVESTOR or current_user.role == "INVESTOR":
        investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
        if not investor or introduction.investor_id != investor.id:
            raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == UserRole.STARTUP or current_user.role == "STARTUP":
        startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
        if not startup or introduction.startup_id != startup.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    # Map outcome string to enum
    outcome_map = {
        'meeting': IntroductionOutcome.MEETING,
        'pass': IntroductionOutcome.PASS,
        'invested': IntroductionOutcome.INVESTED
    }
    
    outcome = outcome_map.get(outcome_data.outcome.lower())
    if not outcome:
        raise HTTPException(status_code=400, detail="Invalid outcome. Must be: meeting, pass, or invested")
    
    introduction.outcome = outcome
    introduction.outcome_notes = outcome_data.notes
    
    db.commit()
    
    return {"message": "Outcome updated"}
