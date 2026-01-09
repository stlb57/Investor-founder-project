"""
Comprehensive Scoring Service
Orchestrates all three models: Readiness, Fit, and Public Review
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import json

from ml.readiness_model import get_readiness_model
from ml.fit_model import get_fit_model
from ml.public_review_model import get_public_review_model
from models.models import Startup, TimelineEvent, Investor


class ScoringService:
    """Orchestrates all scoring models"""
    
    def __init__(self):
        self.readiness_model = get_readiness_model()
        self.fit_model = get_fit_model()
        self.public_review_model = get_public_review_model()
    
    def calculate_startup_readiness(self, startup: Startup, timeline_events: List[TimelineEvent]) -> Dict:
        """Calculate current readiness estimation for a startup (signal-based evaluation)"""
        
        # Process timeline events
        event_types = {'team': 0, 'product': 0, 'traction': 0, 'capital': 0}
        for event in timeline_events:
            event_type_key = event.event_type.value
            if event_type_key in event_types:
                event_types[event_type_key] += 1
        
        # Calculate days since last event
        if timeline_events:
            last_event_date = max(e.event_date for e in timeline_events)
            days_since_last = (datetime.now().date() - last_event_date).days
        else:
            days_since_last = 999
        
        # Get legacy metrics for backward compatibility
        metrics = json.loads(startup.metrics) if startup.metrics else {}
        traction_bucket = metrics.get('users_bucket', startup.mau_range or '0-100')
        burn_bucket = metrics.get('burn_bucket', 'medium')
        
        # Extract comprehensive founder data
        founder_data = {
            'founder_role': startup.founder_role,
            'time_commitment': startup.time_commitment,
            'prev_startup_exp': startup.prev_startup_exp,
            'experience_years': startup.experience_years,
            'cofounder_count': startup.cofounder_count,
            'is_incorporated': startup.is_incorporated
        }
        
        # Extract comprehensive traction data
        traction_data = {
            'mau_range': startup.mau_range,
            'user_growth_rate': startup.user_growth_rate,
            'revenue_status': startup.revenue_status,
            'revenue_range': startup.revenue_range,
            'retention_level': startup.retention_level
        }
        
        # Extract market & business data
        market_data = {
            'customer_type': startup.customer_type,
            'market_size': startup.market_size,
            'monetization_model': startup.monetization_model,
            'competition_level': startup.competition_level
        }
        
        # Extract roadmap & intent data
        roadmap_data = {
            'next_milestone': startup.next_milestone,
            'current_bottleneck': startup.current_bottleneck,
            'fundraising_intent': startup.fundraising_intent,
            'target_raise_stage': startup.target_raise_stage
        }
        
        # Call enhanced readiness model with comprehensive data
        result = self.readiness_model.calculate_readiness(
            timeline_event_count=len(timeline_events),
            days_since_last_event=days_since_last,
            event_types=event_types,
            team_size=startup.team_size or "1-2",
            traction_bucket=traction_bucket,
            burn_bucket=burn_bucket,
            founder_data=founder_data,
            traction_data=traction_data,
            market_data=market_data,
            roadmap_data=roadmap_data
        )
        
        return result
    
    def calculate_public_review(self, startup: Startup) -> Dict:
        """Calculate public review score"""
        
        # For now, use website URL only
        # In production, would fetch articles, GitHub, app store reviews
        return self.public_review_model.calculate_public_review(
            website_url=startup.website_url,
            public_articles=None,  # Would be fetched from external sources
            github_readme=None,
            app_store_reviews=None
        )
    
    def calculate_investor_fit(
        self,
        investor: Investor,
        startup: Startup,
        startup_readiness_band: str
    ) -> float:
        """Calculate fit score between investor and startup"""
        
        # Parse investor preferences
        stage_pref = json.loads(investor.stage_focus) if investor.stage_focus else []
        sector_pref = json.loads(investor.sector_focus) if investor.sector_focus else []
        check_size_range = (investor.check_size_min, investor.check_size_max)
        
        # Get startup funding raised (would come from capital events)
        startup_funding = None  # Would calculate from timeline events
        
        return self.fit_model.calculate_fit(
            startup_stage=startup.stage or '',
            startup_sector=startup.sector or '',
            startup_readiness_band=startup_readiness_band,
            investor_stage_preference=stage_pref,
            investor_sector_preference=sector_pref,
            check_size_range=check_size_range,
            startup_funding_raised=startup_funding
        )
    
    def detect_execution_gap(self, timeline_events: List[TimelineEvent], threshold_days: int = 90) -> Optional[Dict]:
        """Detect inactivity periods > threshold"""
        
        if len(timeline_events) < 2:
            return None
        
        # Sort by date
        sorted_events = sorted(timeline_events, key=lambda e: e.event_date)
        
        gaps = []
        for i in range(1, len(sorted_events)):
            gap_days = (sorted_events[i].event_date - sorted_events[i-1].event_date).days
            if gap_days > threshold_days:
                gaps.append({
                    'start_date': sorted_events[i-1].event_date,
                    'end_date': sorted_events[i].event_date,
                    'days': gap_days
                })
        
        if gaps:
            largest_gap = max(gaps, key=lambda g: g['days'])
            return {
                'has_gap': True,
                'largest_gap_days': largest_gap['days'],
                'last_gap_start': largest_gap['start_date'].isoformat(),
                'last_gap_end': largest_gap['end_date'].isoformat()
            }
        
        return {'has_gap': False}
    
    def calculate_momentum(self, timeline_events: List[TimelineEvent]) -> int:
        """Calculate momentum score (0-100) based on execution frequency increase/decrease"""
        
        if len(timeline_events) < 2:
            return 50  # Neutral baseline
        
        # Sort by date
        sorted_events = sorted(timeline_events, key=lambda e: e.event_date)
        
        # Look at recent events vs older events
        total_events = len(sorted_events)
        recent_cutoff = max(1, total_events // 2)
        older_events = sorted_events[:-recent_cutoff]
        recent_events = sorted_events[-recent_cutoff:]
        
        # Calculate event density (events per day)
        def get_rate(events):
            if len(events) < 2: return 0.01 # Baseline
            duration = (events[-1].event_date - events[0].event_date).days
            return len(events) / max(duration, 1)

        older_rate = get_rate(older_events) if older_events else 0.01
        recent_rate = get_rate(recent_events)
        
        # Ratio of improvement
        ratio = recent_rate / older_rate
        
        # Map ratio to 0-100
        # 1.0 (no change) -> 50
        # 2.0 (doubled frequency) -> 80
        # 0.5 (halved frequency) -> 20
        import math
        score = 50 + (math.log2(ratio) * 30)
        
        return max(5, min(95, int(score)))

    def get_momentum_arrow(self, score: int) -> str:
        """Helper to get arrow symbol from score"""
        if score > 60: return '↑'
        if score < 40: return '↓'
        return '→'

