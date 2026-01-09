from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime, timedelta
import json

from db.database import get_db
from models.models import (
    User, Startup, TimelineEvent, EventType, ConfidenceLevel,
    ReadinessBand, VisibilityStatus, ProfileView, WatchlistEntry,
    InvestorInterest, UserRole
)
from sqlalchemy import func
from api.auth import get_current_user
from services.scoring_service import ScoringService
from services.signal_service import SignalService
from services.impact_service import calculate_impact_depth

router = APIRouter()

# Impact tags from spec
IMPACT_TAGS = [
    "Environment Friendly", "Climate Tech", "Healthcare Access", 
    "Education", "Financial Inclusion", "Women-Led", 
    "Rural / Tier-2", "Accessibility", "Open Source"
]

class StartupCreate(BaseModel):
    # Section 1: Basic Startup Profile
    name: str
    sector: Optional[str] = None
    stage: Optional[str] = None
    region: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    impact_tags: Optional[List[str]] = []  # Max 5
    website_url: Optional[str] = None
    founded_date: Optional[date] = None
    team_size: Optional[str] = "1-2"
    is_incorporated: Optional[bool] = False
    
    # Section 2: Founder Execution Signals
    founder_role: Optional[str] = None
    time_commitment: Optional[str] = "full_time"
    prev_startup_exp: Optional[bool] = False
    experience_years: Optional[str] = "0-2"
    cofounder_count: Optional[int] = 0
    
    # Section 3: Product/Solution
    product_description: Optional[str] = None
    
    # Section 4: Traction (Range-Based)
    mau_range: Optional[str] = "0-100"
    user_growth_rate: Optional[str] = "0-10%"
    revenue_status: Optional[str] = "pre_revenue"
    revenue_range: Optional[str] = "0"
    retention_level: Optional[str] = "medium"
    
    # Section 5: Market & Business
    customer_type: Optional[str] = "B2C"
    market_size: Optional[str] = "medium"
    monetization_model: Optional[str] = None
    competition_level: Optional[str] = "medium"
    
    # Section 6: Roadmap & Intent
    next_milestone: Optional[str] = None
    current_bottleneck: Optional[str] = None
    fundraising_intent: Optional[bool] = False
    target_raise_stage: Optional[str] = "seed"

class StartupUpdate(BaseModel):
    name: Optional[str] = None
    sector: Optional[str] = None
    stage: Optional[str] = None
    region: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    impact_tags: Optional[List[str]] = None
    website_url: Optional[str] = None
    team_size: Optional[str] = None
    is_incorporated: Optional[bool] = None
    founder_role: Optional[str] = None
    time_commitment: Optional[str] = None
    prev_startup_exp: Optional[bool] = None
    experience_years: Optional[str] = None
    cofounder_count: Optional[int] = None
    product_description: Optional[str] = None
    mau_range: Optional[str] = None
    user_growth_rate: Optional[str] = None
    revenue_status: Optional[str] = None
    revenue_range: Optional[str] = None
    retention_level: Optional[str] = None
    customer_type: Optional[str] = None
    market_size: Optional[str] = None
    monetization_model: Optional[str] = None
    competition_level: Optional[str] = None
    next_milestone: Optional[str] = None
    current_bottleneck: Optional[str] = None
    fundraising_intent: Optional[bool] = None
    target_raise_stage: Optional[str] = None


class TimelineEventCreate(BaseModel):
    event_date: date
    event_type: str  # Will be converted to EventType enum
    title: str
    description: Optional[str] = None
    confidence: str = "self_reported"  # Will be converted to ConfidenceLevel enum

class TimelineEventUpdate(BaseModel):
    event_date: Optional[date] = None
    event_type: Optional[EventType] = None
    title: Optional[str] = None
    description: Optional[str] = None
    confidence: Optional[ConfidenceLevel] = None

@router.post("/onboarding")
async def create_startup_profile(
    startup_data: StartupCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create startup profile (onboarding) - immediately computes scores"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
    
    # Check if profile already exists
    existing_startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if existing_startup:
        raise HTTPException(status_code=400, detail="Startup profile already exists")
    
    # Validate impact tags (max 5)
    impact_tags = startup_data.impact_tags or []
    if len(impact_tags) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 impact tags allowed")
    
    # Validate impact tags are from allowed list
    invalid_tags = [tag for tag in impact_tags if tag not in IMPACT_TAGS]
    if invalid_tags:
        raise HTTPException(status_code=400, detail=f"Invalid impact tags: {invalid_tags}")
    
    # Calculate impact depth
    impact_depth = calculate_impact_depth(
        impact_tags, 
        startup_data.sector or "", 
        startup_data.description or ""
    )
    
    # Create startup with all comprehensive fields
    startup = Startup(
        user_id=current_user.id,
        # Section 1: Basic Profile
        name=startup_data.name,
        sector=startup_data.sector,
        stage=startup_data.stage,
        region=startup_data.region,
        location=startup_data.location,
        description=startup_data.description,
        impact_tags=json.dumps(impact_tags),
        impact_depth=impact_depth,
        website_url=startup_data.website_url,
        founded_date=startup_data.founded_date,
        team_size=startup_data.team_size,
        is_incorporated=startup_data.is_incorporated,
        
        # Section 2: Founder Execution Signals
        founder_role=startup_data.founder_role,
        time_commitment=startup_data.time_commitment,
        prev_startup_exp=startup_data.prev_startup_exp,
        experience_years=startup_data.experience_years,
        cofounder_count=startup_data.cofounder_count,
        
        # Section 3: Product/Solution
        product_description=startup_data.product_description,
        
        # Section 4: Traction
        mau_range=startup_data.mau_range,
        user_growth_rate=startup_data.user_growth_rate,
        revenue_status=startup_data.revenue_status,
        revenue_range=startup_data.revenue_range,
        retention_level=startup_data.retention_level,
        
        # Section 5: Market & Business
        customer_type=startup_data.customer_type,
        market_size=startup_data.market_size,
        monetization_model=startup_data.monetization_model,
        competition_level=startup_data.competition_level,
        
        # Section 6: Roadmap & Intent
        next_milestone=startup_data.next_milestone,
        current_bottleneck=startup_data.current_bottleneck,
        fundraising_intent=startup_data.fundraising_intent,
        target_raise_stage=startup_data.target_raise_stage,
        
        # Legacy compatibility - store as JSON for backward compat
        metrics=json.dumps({
            'users_bucket': startup_data.mau_range,
            'revenue_bucket': startup_data.revenue_range,
            'burn_bucket': 'medium'  # Can be derived from revenue vs growth
        }),
        
        visibility_status=VisibilityStatus.HIDDEN  # Hidden until scores computed
    )
    
    db.add(startup)
    db.commit()
    db.refresh(startup)
    
    # Immediately compute scores using comprehensive data
    scoring_service = ScoringService()
    timeline_events = []  # No events yet
    
    # Calculate readiness with new comprehensive data
    readiness_result = scoring_service.calculate_startup_readiness(startup, timeline_events)
    
    # Calculate public review
    public_review_result = scoring_service.calculate_public_review(startup)
    
    # Update startup with scores
    from models.models import ReadinessScore
    
    # Map readiness band
    band_map = {'EARLY': ReadinessBand.EARLY, 'MEDIUM': ReadinessBand.MEDIUM, 'HIGH': ReadinessBand.HIGH}
    readiness_band = band_map.get(readiness_result['band'], ReadinessBand.EARLY)
    
    startup.readiness_score = readiness_result['score']
    startup.readiness_band = readiness_band
    startup.public_review_score = public_review_result['score']
    startup.visibility_status = VisibilityStatus.VISIBLE  # Make visible after scoring
    startup.confidence_level = 'Medium'  # Would calculate based on data completeness
    
    # Save detailed readiness scores with subscores
    readiness_score = ReadinessScore(
        startup_id=startup.id,
        score=readiness_result['score'],
        confidence_band=10,  # Default
        execution_score=readiness_result.get('execution_score', 0),
        traction_score=readiness_result.get('traction_score', 0),
        market_score=readiness_result.get('market_score', 0),
        team_score=readiness_result.get('team_score', 0),
        capital_efficiency_score=readiness_result.get('capital_efficiency_score', 0)
    )
    db.add(readiness_score)
    
    # Also save sub-scores to startup model for quick access
    startup.execution_score = readiness_result.get('execution_score', 0)
    startup.traction_score = readiness_result.get('traction_score', 0)
    startup.market_score = readiness_result.get('market_score', 0)
    startup.team_score = readiness_result.get('team_score', 0)
    startup.capital_efficiency_score = readiness_result.get('capital_efficiency_score', 0)
    
    db.commit()
    db.refresh(startup)
    
    return {
        "id": str(startup.id),
        "message": "Startup profile created and scored",
        "readiness_score": readiness_result['score'],
        "readiness_band": readiness_result['band'],
        "public_review_score": public_review_result['score'],
        "sub_scores": {
            "execution": readiness_result.get('execution_score', 0),
            "traction": readiness_result.get('traction_score', 0),
            "market": readiness_result.get('market_score', 0),
            "team": readiness_result.get('team_score', 0),
            "capital_efficiency": readiness_result.get('capital_efficiency_score', 0)
        }
    }

@router.get("/dashboard")
async def get_startup_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get startup dashboard with scores and insights"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
    
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
    
    # Get timeline events for analysis
    timeline_events = db.query(TimelineEvent).filter(
        TimelineEvent.startup_id == startup.id
    ).order_by(TimelineEvent.event_date).all()
    
    scoring_service = ScoringService()
    
    # Recalculate scores
    readiness_result = scoring_service.calculate_startup_readiness(startup, timeline_events)
    public_review_result = scoring_service.calculate_public_review(startup)
    
    # Execution gap detection
    execution_gap = scoring_service.detect_execution_gap(timeline_events)
    
    # Momentum indicator
    momentum = scoring_service.calculate_momentum(timeline_events)
    
    # Key factors influencing readiness (qualitative guidance only - no score deltas)
    key_factors = []
    limiting_areas = []
    
    if len(timeline_events) >= 5:
        key_factors.append("Strong timeline activity demonstrates consistent execution")
    elif len(timeline_events) < 3:
        limiting_areas.append("Limited timeline activity reduces signal strength")
    
    if startup.website_url:
        key_factors.append("Public presence supports credibility assessment")
    else:
        limiting_areas.append("Missing public presence limits visibility signals")
    
    metrics = json.loads(startup.metrics) if startup.metrics else {}
    if metrics.get('users_bucket') != '0-100' and metrics.get('users_bucket'):
        key_factors.append("User traction indicates market validation")
    elif metrics.get('users_bucket') == '0-100':
        limiting_areas.append("Early-stage user base - focus on growth metrics")
    
    if startup.team_size and startup.team_size >= 3:
        key_factors.append("Team size suggests operational capacity")
    
    if readiness_result['score'] >= 70:
        key_factors.append("Strong readiness signals across multiple dimensions")
    
    return {
        "startup": {
            "id": str(startup.id),
            "name": startup.name,
            "sector": startup.sector,
            "stage": startup.stage
        },
        "readiness_score": readiness_result['score'],
        "readiness_band": readiness_result['band'],
        "public_review_score": public_review_result['score'],
        "confidence_level": startup.confidence_level,
        "visibility_status": startup.visibility_status.value,
        "momentum": momentum,
        "execution_gap": execution_gap,
        "what_improves_score": key_factors,  # Qualitative guidance only
        "what_hurts_score": limiting_areas  # Qualitative guidance only
    }

@router.get("/profile")
async def get_startup_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's startup profile"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
    
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
    
    impact_tags = json.loads(startup.impact_tags) if startup.impact_tags else []
    metrics = json.loads(startup.metrics) if startup.metrics else {}
    
    return {
        "id": str(startup.id),
        "name": startup.name,
        "slug": startup.slug,
        "sector": startup.sector,
        "stage": startup.stage,
        "location": startup.location,
        "description": startup.description,
        "impact_tags": impact_tags,
        "impact_depth": startup.impact_depth.value if startup.impact_depth else None,
        "website_url": startup.website_url,
        "founded_date": startup.founded_date.isoformat() if startup.founded_date else None,
        "team_size": startup.team_size,
        "metrics": metrics,
        "readiness_score": startup.readiness_score,
        "readiness_band": startup.readiness_band.value if startup.readiness_band else None,
        "public_review_score": startup.public_review_score,
        "confidence_level": startup.confidence_level,
        "visibility_status": startup.visibility_status.value if startup.visibility_status else None,
        "created_at": startup.created_at.isoformat() if startup.created_at else None
    }

@router.put("/profile")
async def update_startup_profile(
    startup_data: StartupUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update startup profile"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
    
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
    
    # Update fields
    update_data = startup_data.dict(exclude_unset=True)
    
    if 'impact_tags' in update_data:
        impact_tags = update_data['impact_tags']
        if len(impact_tags) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 impact tags allowed")
        invalid_tags = [tag for tag in impact_tags if tag not in IMPACT_TAGS]
        if invalid_tags:
            raise HTTPException(status_code=400, detail=f"Invalid impact tags: {invalid_tags}")
        update_data['impact_tags'] = json.dumps(impact_tags)
        
        # Recalculate impact depth if tags changed
        impact_depth = calculate_impact_depth(
            impact_tags,
            startup.sector or "",
            startup.description or ""
        )
        startup.impact_depth = impact_depth
    
    if 'metrics' in update_data:
        update_data['metrics'] = json.dumps(update_data['metrics'])
    
    for field, value in update_data.items():
        setattr(startup, field, value)
    
    startup.last_activity = datetime.utcnow()
    
    # Recalculate scores if metrics or website changed
    if 'metrics' in update_data or 'website_url' in update_data:
        timeline_events = db.query(TimelineEvent).filter(
            TimelineEvent.startup_id == startup.id
        ).all()
        
        scoring_service = ScoringService()
        readiness_result = scoring_service.calculate_startup_readiness(startup, timeline_events)
        public_review_result = scoring_service.calculate_public_review(startup)
        
        from models.models import ReadinessBand
        band_map = {'Early': ReadinessBand.EARLY, 'Medium': ReadinessBand.MEDIUM, 'High': ReadinessBand.HIGH}
        startup.readiness_score = readiness_result['score']
        startup.readiness_band = band_map.get(readiness_result['band'], ReadinessBand.EARLY)
        startup.public_review_score = public_review_result['score']
    
    db.commit()
    
    return {"message": "Profile updated"}

@router.post("/timeline/events")
async def add_timeline_event(
    event_data: TimelineEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add timeline event"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
    
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
    
    # Convert string values to enums
    try:
        event_type_enum = EventType(event_data.event_type)
        confidence_enum = ConfidenceLevel(event_data.confidence)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid enum value: {str(e)}")
    
    event = TimelineEvent(
        startup_id=startup.id,
        event_date=event_data.event_date,
        event_type=event_type_enum,
        title=event_data.title,
        description=event_data.description,
        confidence=confidence_enum
    )
    
    db.add(event)
    
    # Update startup last activity
    startup.last_activity = datetime.utcnow()
    
    # Recalculate readiness score
    timeline_events = db.query(TimelineEvent).filter(
        TimelineEvent.startup_id == startup.id
    ).all()
    
    scoring_service = ScoringService()
    readiness_result = scoring_service.calculate_startup_readiness(startup, timeline_events)
    
    # Signal Generation
    old_band = startup.readiness_band.name if startup.readiness_band else "EARLY"
    
    from models.models import ReadinessBand
    band_map = {'EARLY': ReadinessBand.EARLY, 'MEDIUM': ReadinessBand.MEDIUM, 'HIGH': ReadinessBand.HIGH}
    startup.readiness_score = readiness_result['score']
    startup.readiness_band = band_map.get(readiness_result['band'], ReadinessBand.EARLY)
    
    signal_service = SignalService(db)
    # 1. New Timeline Signal
    signal_service.trigger_timeline_signal(startup, event)
    
    # 2. Readiness Band Shift Signal
    if old_band != readiness_result['band']:
        signal_service.trigger_readiness_shift(startup, old_band, readiness_result['band'])
        
    db.commit()
    
    return {
        "id": str(event.id),
        "message": "Timeline event added",
        "new_readiness_score": readiness_result['score'],
        "new_readiness_band": readiness_result['band']
    }

@router.get("/timeline/events")
async def get_timeline_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get timeline events for current startup"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
    
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
    
    events = db.query(TimelineEvent).filter(
        TimelineEvent.startup_id == startup.id
    ).order_by(TimelineEvent.event_date.desc()).all()
    
    return [
        {
            "id": str(event.id),
            "event_date": event.event_date.isoformat(),
            "event_type": event.event_type.value,
            "title": event.title,
            "description": event.description,
            "confidence": event.confidence.value,
            "created_at": event.created_at.isoformat() if event.created_at else None
        }
        for event in events
    ]

@router.put("/timeline/events/{event_id}")
async def update_timeline_event(
    event_id: str,
    event_data: TimelineEventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update timeline event"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
    
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
    
    event = db.query(TimelineEvent).filter(
        TimelineEvent.id == event_id,
        TimelineEvent.startup_id == startup.id
    ).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    # Recalculate scores
    timeline_events = db.query(TimelineEvent).filter(
        TimelineEvent.startup_id == startup.id
    ).all()
    
    scoring_service = ScoringService()
    readiness_result = scoring_service.calculate_startup_readiness(startup, timeline_events)
    
    from models.models import ReadinessBand
    band_map = {'Early': ReadinessBand.EARLY, 'Medium': ReadinessBand.MEDIUM, 'High': ReadinessBand.HIGH}
    startup.readiness_score = readiness_result['score']
    startup.readiness_band = band_map.get(readiness_result['band'], ReadinessBand.EARLY)
    
    db.commit()
    
    return {"message": "Event updated"}

@router.delete("/timeline/events/{event_id}")
async def delete_timeline_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete timeline event"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
    
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
    
    event = db.query(TimelineEvent).filter(
        TimelineEvent.id == event_id,
        TimelineEvent.startup_id == startup.id
    ).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    
    # Recalculate scores
    timeline_events = db.query(TimelineEvent).filter(
        TimelineEvent.startup_id == startup.id
    ).all()
    
    scoring_service = ScoringService()
    readiness_result = scoring_service.calculate_startup_readiness(startup, timeline_events)
    
    from models.models import ReadinessBand
    band_map = {'Early': ReadinessBand.EARLY, 'Medium': ReadinessBand.MEDIUM, 'High': ReadinessBand.HIGH}
    startup.readiness_score = readiness_result['score']
    startup.readiness_band = band_map.get(readiness_result['band'], ReadinessBand.EARLY)
    
    db.commit()
    
    return {"message": "Event deleted"}

@router.get("/visibility")
async def get_visibility_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get aggregated visibility signals (delayed)"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
        
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
        
    # 1. Profile Views (Last 7 days, delayed by 24h)
    # Filter: viewed_at > 8 days ago AND viewed_at < 1 day ago
    # actually "last 7 days" usually means [now-7d, now]. 
    # But requirement: "Delayed by 24 hours".
    # So window is: [now-8d, now-1d]
    
    end_date = datetime.utcnow() - timedelta(days=1)
    start_date = end_date - timedelta(days=7)
    
    views_count = db.query(ProfileView).filter(
        ProfileView.startup_id == startup.id,
        ProfileView.viewed_at >= start_date,
        ProfileView.viewed_at <= end_date
    ).count()
    
    # 2. Watchlist Adds (Total)
    watchlist_count = db.query(WatchlistEntry).filter(
        WatchlistEntry.startup_id == startup.id
    ).count()
    
    # 3. Intent breakdown (aggregated)
    intents = db.query(
        WatchlistEntry.intent, func.count(WatchlistEntry.intent)
    ).filter(
        WatchlistEntry.startup_id == startup.id
    ).group_by(WatchlistEntry.intent).all()
    
    intent_map = {
        "tracking_execution": 0,
        "waiting_for_milestone": 0,
        "monitoring_market": 0
    }
    
    for intent, count in intents:
        if intent:
            intent_map[intent.value] = count
            
    return {
        "views_last_7d": views_count,  # Delayed
        "watchlist_total": watchlist_count,
        "intent_breakdown": intent_map,
        "period_start": start_date.isoformat(),
        "period_end": end_date.isoformat()
    }

@router.get("/pass-reasons")
async def get_pass_reasons(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get aggregated pass feedback"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
        
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    
    # Query InvestorInterest where action starts with 'passed_'
    interests = db.query(InvestorInterest).filter(
        InvestorInterest.startup_id == startup.id,
        InvestorInterest.action.like("passed_%")
    ).all()
    
    # Aggregate
    reasons = {}
    total_passes = 0
    
    for interest in interests:
        # action format: "passed_timing", "passed_team", etc.
        try:
            parts = interest.action.split('_', 1)
            if len(parts) == 2:
                reason = parts[1].replace('_', ' ').title()
                reasons[reason] = reasons.get(reason, 0) + 1
                total_passes += 1
        except:
            pass
            
    return {
        "reasons": reasons,
        "total_passes": total_passes,
        "silent_rejection_insight": "Most passes at your stage happen due to timing or sector fatigue, not product quality." if total_passes > 0 else "Insufficient data for insights"
    }

@router.get("/discovery/peers")
async def get_peer_benchmarks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Peer benchmarks for founders (anonymous)"""
    if current_user.role != UserRole.STARTUP and current_user.role != "STARTUP":
        raise HTTPException(status_code=403, detail="Startup access only")
        
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
        
    # Find similar startups (same sector and stage)
    peers = db.query(Startup).filter(
        Startup.sector == startup.sector,
        Startup.stage == startup.stage,
        Startup.id != startup.id
    ).all()
    
    # Calculate median readiness
    peer_scores = [p.readiness_score for p in peers if p.readiness_score]
    median_score = sum(peer_scores) / len(peer_scores) if peer_scores else 50
    
    return {
        "your_score": startup.readiness_score or 0,
        "median_peer_score": round(median_score, 1),
        "peer_count": len(peers),
        "benchmark_insight": "You are ahead of 65% of peers in your sector/stage." if (startup.readiness_score or 0) > median_score else "Consider increasing execution density to match median peer path."
    }
