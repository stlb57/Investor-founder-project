from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import json

from db.database import get_db
from models.models import (
    User, Investor, Startup, InvestorFitScore, InvestorType, 
    VisibilityStatus, TimelineEvent, WatchlistEntry, WatchIntent,
    ProfileView, UserRole
)
from api.auth import get_current_user
from services.scoring_service import ScoringService
from services.signal_service import SignalService

router = APIRouter()

class InvestorCreate(BaseModel):
    name: str
    firm_name: Optional[str] = None
    type: InvestorType  # angel, vc, accelerator, etc.
    stage_preference: Optional[List[str]] = []
    sector_interests: Optional[List[str]] = []
    region_focus: Optional[List[str]] = []  # Geographic preferences
    check_size_min: Optional[int] = None
    check_size_max: Optional[int] = None
    investment_thesis: Optional[str] = None  # Free-text thesis
    past_investments: Optional[List[str]] = []  # Portfolio companies

class InvestorUpdate(BaseModel):
    name: Optional[str] = None
    firm_name: Optional[str] = None
    type: Optional[InvestorType] = None
    stage_preference: Optional[List[str]] = None
    sector_interests: Optional[List[str]] = None
    region_focus: Optional[List[str]] = None
    check_size_min: Optional[int] = None
    check_size_max: Optional[int] = None
    investment_thesis: Optional[str] = None
    past_investments: Optional[List[str]] = None

@router.post("/onboarding")
async def create_investor_profile(
    investor_data: InvestorCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create investor profile (onboarding)"""
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    # Check if profile already exists
    existing_investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    if existing_investor:
        raise HTTPException(status_code=400, detail="Investor profile already exists")
    
    investor = Investor(
        user_id=current_user.id,
        name=investor_data.name,
        firm_name=investor_data.firm_name,
        investor_type=investor_data.type,
        stage_focus=json.dumps(investor_data.stage_preference),
        sector_focus=json.dumps(investor_data.sector_interests),
        region_focus=json.dumps(investor_data.region_focus),
        check_size_min=investor_data.check_size_min,
        check_size_max=investor_data.check_size_max,
        investment_thesis=investor_data.investment_thesis,
        portfolio_companies=json.dumps(investor_data.past_investments)
    )
    
    db.add(investor)
    db.commit()
    db.refresh(investor)
    
    return {"id": str(investor.id), "message": "Investor profile created"}

@router.get("/profile")
async def get_investor_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's investor profile"""
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor profile not found")
    
    return {
        "id": str(investor.id),
        "name": investor.name,
        "type": investor.investor_type.value if investor.investor_type else None,
        "stage_preference": json.loads(investor.stage_focus) if investor.stage_focus else [],
        "sector_interests": json.loads(investor.sector_focus) if investor.sector_focus else [],
        "check_size_min": investor.check_size_min,
        "check_size_max": investor.check_size_max,
        "created_at": investor.created_at.isoformat() if investor.created_at else None
    }

@router.put("/profile")
async def update_investor_profile(
    investor_data: InvestorUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update investor profile"""
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor profile not found")
    
    # Update fields
    update_data = investor_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field in ['stage_preference', 'sector_interests', 'past_investments'] and value is not None:
            setattr(investor, field, json.dumps(value))
        else:
            setattr(investor, field, value)
    
    db.commit()
    
    return {"message": "Profile updated"}

@router.get("/curated-startups")
async def get_curated_startups(
    blind_mode: bool = False,  # Optional blind screening mode
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get curated startups for investor (2-5 max)
    Based on readiness score × fit score
    NO SEARCH, NO FILTERS - just curated matches
    """
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor profile not found")
    
    # Get all visible startups
    visible_startups = db.query(Startup).filter(
        Startup.visibility_status == VisibilityStatus.VISIBLE
    ).all()
    
    if not visible_startups:
        return []
    
    scoring_service = ScoringService()
    
    # Calculate fit scores for all startups
    startup_scores = []
    for startup in visible_startups:
        # Get readiness band
        readiness_band = startup.readiness_band.value if startup.readiness_band else 'Early'
        
        # Calculate fit score (0-1)
        fit_score = scoring_service.calculate_investor_fit(
            investor, startup, readiness_band
        )
        
        # Combined score (readiness * fit)
        readiness_score = startup.readiness_score or 0
        combined_score = readiness_score * fit_score
        
        startup_scores.append({
            'startup': startup,
            'fit_score': fit_score,
            'combined_score': combined_score
        })
    
    # Sort by combined score and take top 2-5
    startup_scores.sort(key=lambda x: x['combined_score'], reverse=True)
    top_startups = startup_scores[:5]  # Max 5
    
    # Build response
    curated_startups = []
    for item in top_startups:
        startup = item['startup']
        
        # Get metrics
        metrics = json.loads(startup.metrics) if startup.metrics else {}
        
        # Determine one risk to show
        risks = []
        if startup.readiness_score and startup.readiness_score < 40:
            risks.append("Low readiness score")
        if startup.public_review_score and startup.public_review_score < 40:
            risks.append("Limited public presence")
        if metrics.get('burn_bucket') == 'critical':
            risks.append("High burn rate")
        
        visible_risk = risks[0] if risks else "No significant risks identified"
        
        # Apply blind mode if enabled
        # Blind mode ONLY hides: founder name, education, network cues
        # Blind mode MUST STILL SHOW: location, sector, stage, timeline, metrics, impact tags, scores
        # "Why This Was Shown" logic
        match_reasons = []
        if startup.readiness_score and startup.readiness_score >= 70:
            match_reasons.append("High readiness score")
        if startup.sector in (json.loads(investor.sector_focus) if investor.sector_focus else []):
            match_reasons.append(f"Strong fit for {startup.sector}")
        if startup.readiness_score and startup.readiness_score > 80:
            match_reasons.append("Top-tier execution vs peers")
        
        match_reason = match_reasons[0] if match_reasons else "Aligned with your profile"

        startup_data = {
            "id": str(startup.id),
            "name": startup.name if not blind_mode else "[Hidden Name]",
            "slug": startup.slug,
            "sector": startup.sector,
            "stage": startup.stage,
            "location": startup.location,
            "impact_tags": json.loads(startup.impact_tags) if startup.impact_tags else [],
            "impact_depth": startup.impact_depth.value if startup.impact_depth else None,
            "readiness_band": startup.readiness_band.value if startup.readiness_band else None,
            "public_review_band": _score_to_band(startup.public_review_score) if startup.public_review_score else None,
            "visible_risk": visible_risk,
            "match_reason": match_reason,
            "final_match_score": item['fit_score'],
            "readiness_band": startup.readiness_band.value if startup.readiness_band else "Early"
        }
        
        curated_startups.append(startup_data)
    
    return curated_startups

def _score_to_band(score: Optional[int]) -> str:
    """Convert score (0-100) to band"""
    if not score:
        return None
    if score >= 70:
        return "High"
    elif score >= 40:
        return "Medium"
    else:
        return "Low"

@router.get("/startup/{startup_id}")
async def get_startup_details(
    startup_id: str,
    blind_mode: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Startup deep view - with full details"""
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor profile not found")
    
    startup = db.query(Startup).filter((Startup.id == startup_id) | (Startup.slug == startup_id)).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    if startup.visibility_status != VisibilityStatus.VISIBLE:
        raise HTTPException(status_code=403, detail="Startup not available")
    
    # Get timeline events (read-only for investors)
    timeline_events = db.query(TimelineEvent).filter(
        TimelineEvent.startup_id == startup.id
    ).order_by(TimelineEvent.event_date).all()
    
    # Get readiness breakdown
    scoring_service = ScoringService()
    readiness_result = scoring_service.calculate_startup_readiness(startup, timeline_events)
    
    metrics = json.loads(startup.metrics) if startup.metrics else {}
    
    # Execution gap detection
    execution_gap = scoring_service.detect_execution_gap(timeline_events)
    
    # Momentum
    momentum = scoring_service.calculate_momentum(timeline_events)
    
    # Risk Surfacing: "What would kill this startup?"
    # Logic: Execution gaps, market mismatch, founder overextension patterns
    risks = []
    if execution_gap and "No significant" not in execution_gap:
        risks.append({
            "risk": "Execution Stall Risk",
            "evidence": "Recent timeline gaps vs category norms",
            "mitigation": "Increase execution density in next 60 days"
        })
    if startup.readiness_score and startup.readiness_score < 40:
        risks.append({
            "risk": "Market Mismatch Risk",
            "evidence": "Low readiness signals in core sector metrics",
            "mitigation": "Validate product-market fit with pilot data"
        })
    if not timeline_events or len(timeline_events) < 3:
         risks.append({
            "risk": "Information Gap Risk",
            "evidence": "Limited execution history available for analysis",
            "mitigation": "Backfill timeline with verified milestones"
        })
    
    # Blind mode ONLY hides: founder name, education, network cues
    # Blind mode MUST STILL SHOW: location, sector, stage, timeline, metrics, impact tags, scores
    return {
        "id": str(startup.id),
        "name": startup.name if not blind_mode else "[Hidden Name]",
        "description": startup.description,
        "sector": startup.sector,
        "stage": startup.stage,
        "location": startup.location,
        "impact_tags": json.loads(startup.impact_tags) if startup.impact_tags else [],
        "impact_depth": startup.impact_depth.value if startup.impact_depth else None,
        "team_size": startup.team_size,
        "metrics": metrics,
        "timeline": [
            {
                "event_date": event.event_date.isoformat(),
                "event_type": event.event_type.value,
                "title": event.title,
                "description": event.description
            }
            for event in timeline_events
        ],
        "readiness_score": startup.readiness_score,
        "readiness_band": startup.readiness_band.value if startup.readiness_band else None,
        "readiness_breakdown": readiness_result.get('explanation', ''),
        "public_review_score": startup.public_review_score,
        "public_review_explanation": "Public sentiment analysis based on available online presence",
        "execution_gap": execution_gap,
        "momentum": momentum,
        "risks": risks[:3]  # Top 3 risks
    }

@router.post("/interests/{startup_id}")
async def track_interest(
    startup_id: str,
    request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Track investor interest in startup"""
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor profile not found")
    
    startup = db.query(Startup).filter((Startup.id == startup_id) | (Startup.slug == startup_id)).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    action = request.get('action', 'viewed')
    
    from models.models import InvestorInterest
    interest = InvestorInterest(
        investor_id=investor.id,
        startup_id=startup.id,
        action=action
    )
    
    db.add(interest)
    db.commit()
    
    # Trigger Market Interest Signal (Aggregated/Anonymized)
    signal_service = SignalService(db)
    signal_service.trigger_market_interest(startup.id)
    
    return {"message": f"Interest tracked: {action}"}

class SearchFilters(BaseModel):
    keyword: Optional[str] = None
    sector: Optional[str] = None
    stage: Optional[str] = None
    impact_tags: Optional[List[str]] = None
    region: Optional[str] = None
    momentum: Optional[str] = None  # 'improving', 'stable', 'declining'

@router.post("/search")
async def investor_search(
    filters: SearchFilters,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Constrained search within quality pool"""
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    # 1. Base Quality Filter (The "Pool")
    # Only visible startups with Readiness >= threshold
    query = db.query(Startup).filter(
        Startup.visibility_status == VisibilityStatus.VISIBLE,
        Startup.readiness_score >= 0  # Set to 0 for maximum visibility during development
    )
    
    # 2. Apply Search Filters
    # If search is by ID or Slug (exact match), we bypass quality filters
    if filters.keyword:
        # Check if keyword looks like a UUID or Slug (exact match, case-insensitive)
        startup_by_id = db.query(Startup).filter(
            (Startup.id == filters.keyword) | 
            (Startup.slug.ilike(filters.keyword))
        ).first()
        
        if startup_by_id:
            # Bypass all filters for direct ID search
            startups = [startup_by_id]
        else:
            # Regular Keyword Search (ilike)
            query = query.filter(
                (Startup.name.ilike(f"%{filters.keyword}%")) | 
                (Startup.description.ilike(f"%{filters.keyword}%")) |
                (Startup.slug.ilike(f"%{filters.keyword}%"))
            )
            
            # Apply other filters if present
            if filters.sector:
                query = query.filter(Startup.sector == filters.sector)
            if filters.stage:
                query = query.filter(Startup.stage == filters.stage)
            if filters.region:
                query = query.filter(Startup.location.contains(filters.region))
                
            startups = query.all()
    else:
        # No keyword, apply standard filters
        if filters.sector:
            query = query.filter(Startup.sector == filters.sector)
        if filters.stage:
            query = query.filter(Startup.stage == filters.stage)
        if filters.region:
            query = query.filter(Startup.location.contains(filters.region))
            
        startups = query.all()
    
    # 3. Post-processing filters (Tags, Momentum)
    results = []
    scoring_service = ScoringService()
    for startup in startups:
        # Filter by impact tags
        if filters.impact_tags:
            startup_tags = json.loads(startup.impact_tags) if startup.impact_tags else []
            if not any(tag in startup_tags for tag in filters.impact_tags):
                continue
                
        # Get timeline events for momentum
        timeline_events = db.query(TimelineEvent).filter(
            TimelineEvent.startup_id == startup.id
        ).all()
        
        # Filter by momentum
        momentum_score = scoring_service.calculate_momentum(timeline_events)
        momentum_arrow = scoring_service.get_momentum_arrow(momentum_score)
        
        # Map arrows to categories for filtering
        momentum_cat = 'stable'
        if momentum_arrow == '↑': momentum_cat = 'improving'
        if momentum_arrow == '↓': momentum_cat = 'declining'
        
        if filters.momentum:
            if momentum_cat != filters.momentum:
                continue
        
        # "Why This Was Shown" Chip logic
        match_reasons = []
        if startup.readiness_score and startup.readiness_score >= 70:
            match_reasons.append("High readiness score")
        if momentum_arrow == '↑':
            match_reasons.append("Strong execution momentum")
        if getattr(filters, 'sector', None):
            match_reasons.append(f"Leader in {filters.sector}")
        
        match_reason = match_reasons[0] if match_reasons else "Matches quality threshold"
        
        results.append({
            "id": str(startup.id),
            "name": startup.name,
            "slug": startup.slug,
            "sector": startup.sector,
            "stage": startup.stage,
            "readiness_score": startup.readiness_score,
            "momentum": momentum_arrow,
            "match_reason": match_reason,
            "explanation": f"Matches search for {getattr(filters, 'sector', 'startups')} in {getattr(filters, 'stage', 'any stage')}",
            "final_match_score": 0.8, # Placeholder for search results for now
            "readiness_band": startup.readiness_band.value if startup.readiness_band else "Early"
        })
        
    return results

@router.get("/discovery-map")
async def discovery_map(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get data for 2D Discovery Map (Readiness vs Momentum)"""
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
        
    # Same quality pool constraints
    startups = db.query(Startup).filter(
        Startup.visibility_status == VisibilityStatus.VISIBLE,
        Startup.readiness_score >= 0  # Lowered for development
    ).all()
    
    scoring_service = ScoringService()
    map_data = []
    
    for startup in startups:
        timeline_events = db.query(TimelineEvent).filter(
            TimelineEvent.startup_id == startup.id
        ).all()
        momentum_score = scoring_service.calculate_momentum(timeline_events)
        
        map_data.append({
            "id": str(startup.id),
            "name": startup.name,
            "slug": startup.slug,
            "sector": startup.sector,
            "stage": startup.stage,
            "x_momentum": momentum_score,  # X-axis (Number 0-100)
            "y_readiness": startup.readiness_score,  # Y-axis
            "shape": startup.stage,  # Viz encoding
            "color_tag": json.loads(startup.impact_tags)[0] if startup.impact_tags else "General"
        })
        
    return map_data

class WatchlistAdd(BaseModel):
    intent: WatchIntent

@router.post("/watchlist/{startup_id}")
async def add_to_watchlist(
    startup_id: str,
    data: WatchlistAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add to watchlist with intent"""
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
        
    # Resolve startup first
    startup = db.query(Startup).filter((Startup.id == startup_id) | (Startup.slug == startup_id)).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
        
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    
    # Check if already in watchlist
    existing = db.query(WatchlistEntry).filter(
        WatchlistEntry.investor_id == investor.id,
        WatchlistEntry.startup_id == startup.id
    ).first()
    
    if existing:
        existing.intent = data.intent
        db.commit()
        return {"message": "Watchlist intent updated"}
        
    entry = WatchlistEntry(
        investor_id=investor.id,
        startup_id=startup.id,
        intent=data.intent
    )
    db.add(entry)
    db.commit()
    
    # Trigger Market Interest Signal (Aggregated/Anonymized)
    signal_service = SignalService(db)
    signal_service.trigger_market_interest(startup.id)
    
    return {"message": "Added to watchlist"}

@router.get("/watchlist")
async def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
        
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    entries = db.query(WatchlistEntry).filter(WatchlistEntry.investor_id == investor.id).all()
    
    results = []
    for entry in entries:
        startup = entry.startup
        results.append({
            "id": startup.id,
            "name": startup.name,
            "sector": startup.sector,
            "stage": startup.stage,
            "intent": entry.intent.value,
            "added_at": entry.created_at
        })
    return results

# Investor's own timeline
class InvestorTimelineCreate(BaseModel):
    event_date: str
    event_type: str
    title: str
    description: Optional[str] = None

@router.get("/timeline")
async def get_investor_timeline(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    events = db.query(TimelineEvent).filter(TimelineEvent.investor_id == investor.id).order_by(TimelineEvent.event_date.desc()).all()
    
    return events

@router.post("/timeline")
async def add_investor_timeline(
    data: InvestorTimelineCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    
    from datetime import datetime
    event = TimelineEvent(
        investor_id=investor.id,
        event_date=datetime.strptime(data.event_date, '%Y-%m-%d').date(),
        event_type=data.event_type,
        title=data.title,
        description=data.description
    )
    
    db.add(event)
    db.commit()
    return {"message": "Event added"}

@router.delete("/timeline/{event_id}")
async def delete_investor_timeline(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.INVESTOR and current_user.role != "INVESTOR":
        raise HTTPException(status_code=403, detail="Investor access only")
    
    investor = db.query(Investor).filter(Investor.user_id == current_user.id).first()
    event = db.query(TimelineEvent).filter(
        TimelineEvent.id == event_id,
        TimelineEvent.investor_id == investor.id
    ).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    db.delete(event)
    db.commit()
    return {"message": "Event deleted"}
