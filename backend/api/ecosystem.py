"""
Ecosystem Aggregate Metrics API
Read-only aggregate metrics for system-level insight
NO individual startup exposure
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict

from db.database import get_db
from models.models import Startup, Introduction, VisibilityStatus, ImpactDepth, ReadinessBand, IntroductionStatus
from api.auth import get_current_user

router = APIRouter()

@router.get("/metrics")
async def get_ecosystem_metrics(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get aggregate ecosystem metrics (read-only, no individual data)
    Used for Imagine Cup impact narrative and system-level insight
    """
    
    # Total startups
    total_startups = db.query(Startup).count()
    
    # Visible startups
    visible_startups = db.query(Startup).filter(
        Startup.visibility_status == VisibilityStatus.VISIBLE
    ).count()
    
    # Impact-tagged startups gaining visibility
    impact_tagged_visible = db.query(Startup).filter(
        Startup.visibility_status == VisibilityStatus.VISIBLE,
        Startup.impact_tags.isnot(None),
        Startup.impact_tags != "[]"
    ).count()
    
    impact_visibility_rate = (
        (impact_tagged_visible / visible_startups * 100) 
        if visible_startups > 0 else 0
    )
    
    # Readiness distribution
    readiness_distribution = db.query(
        Startup.readiness_band,
        func.count(Startup.id).label('count')
    ).filter(
        Startup.readiness_band.isnot(None)
    ).group_by(Startup.readiness_band).all()
    
    readiness_dist = {
        band.value if band else "Unknown": count 
        for band, count in readiness_distribution
    }
    
    # Impact depth distribution
    impact_depth_dist = db.query(
        Startup.impact_depth,
        func.count(Startup.id).label('count')
    ).filter(
        Startup.impact_depth.isnot(None)
    ).group_by(Startup.impact_depth).all()
    
    impact_depth_distribution = {
        depth.value if depth else "Unknown": count 
        for depth, count in impact_depth_dist
    }
    
    # Regional participation (aggregate only)
    regional_breakdown = db.query(
        Startup.location,
        func.count(Startup.id).label('count')
    ).filter(
        Startup.location.isnot(None),
        Startup.visibility_status == VisibilityStatus.VISIBLE
    ).group_by(Startup.location).order_by(func.count(Startup.id).desc()).limit(10).all()
    
    regions = [
        {"location": loc, "startup_count": count}
        for loc, count in regional_breakdown
    ]
    
    # Stage bottlenecks (aggregate)
    stage_distribution = db.query(
        Startup.stage,
        func.count(Startup.id).label('count'),
        func.avg(Startup.readiness_score).label('avg_readiness')
    ).filter(
        Startup.stage.isnot(None),
        Startup.visibility_status == VisibilityStatus.VISIBLE
    ).group_by(Startup.stage).all()
    
    stage_bottlenecks = [
        {
            "stage": stage,
            "startup_count": count,
            "average_readiness": round(float(avg_readiness), 1) if avg_readiness else None
        }
        for stage, count, avg_readiness in stage_distribution
    ]
    
    # Introduction outcomes (aggregate)
    total_intros = db.query(Introduction).count()
    accepted_intros = db.query(Introduction).filter(
        Introduction.status == IntroductionStatus.ACCEPTED
    ).count()
    
    intro_acceptance_rate = (
        (accepted_intros / total_intros * 100) 
        if total_intros > 0 else 0
    )
    
    return {
        "total_startups": total_startups,
        "visible_startups": visible_startups,
        "visibility_rate": round((visible_startups / total_startups * 100) if total_startups > 0 else 0, 1),
        "impact_tagged_visible": impact_tagged_visible,
        "impact_visibility_rate": round(impact_visibility_rate, 1),
        "readiness_distribution": readiness_dist,
        "impact_depth_distribution": impact_depth_distribution,
        "regional_breakdown": regions,
        "stage_bottlenecks": stage_bottlenecks,
        "introduction_stats": {
            "total_introductions": total_intros,
            "accepted_introductions": accepted_intros,
            "acceptance_rate": round(intro_acceptance_rate, 1)
        }
    }

