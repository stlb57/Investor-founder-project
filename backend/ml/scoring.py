"""
SignalFund ML Scoring System
Explainable, rule-based scoring with confidence bands
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression
import logging

logger = logging.getLogger(__name__)

class StartupReadinessScorer:
    """
    Startup Readiness Score (SRS): 0-100 investability score
    Rule-based with ML enhancement for pattern recognition
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = None
        self.feature_weights = {
            'execution_consistency': 0.25,
            'traction_velocity': 0.25,
            'market_clarity': 0.20,
            'team_stability': 0.15,
            'capital_efficiency': 0.15
        }
    
    def calculate_execution_score(self, timeline_events: List[Dict]) -> Tuple[int, Dict]:
        """
        Execution consistency: Regular progress, milestone achievement
        Returns: (score 0-100, explanation)
        """
        if not timeline_events:
            return 0, {"reason": "No execution history", "confidence": "low"}
        
        # Sort events by date
        events = sorted(timeline_events, key=lambda x: x['event_date'])
        
        # Calculate consistency metrics
        product_events = [e for e in events if e['event_type'] == 'product_execution']
        
        if len(product_events) < 2:
            return 30, {"reason": "Limited product execution history", "confidence": "low"}
        
        # Time gaps between product milestones
        gaps = []
        for i in range(1, len(product_events)):
            gap = (product_events[i]['event_date'] - product_events[i-1]['event_date']).days
            gaps.append(gap)
        
        avg_gap = np.mean(gaps) if gaps else 365
        consistency_score = max(0, 100 - (avg_gap / 30) * 10)  # Penalize gaps > 30 days
        
        # Recent activity bonus
        last_event = max(events, key=lambda x: x['event_date'])
        days_since_last = (datetime.now().date() - last_event['event_date']).days
        
        if days_since_last > 180:  # 6 months
            consistency_score *= 0.3  # Heavy penalty for inactivity
        elif days_since_last > 90:  # 3 months
            consistency_score *= 0.7
        
        return min(100, int(consistency_score)), {
            "avg_milestone_gap": f"{avg_gap:.0f} days",
            "days_since_last_activity": days_since_last,
            "product_milestones": len(product_events)
        }
    
    def calculate_traction_score(self, timeline_events: List[Dict], 
                               revenue_bucket: str, users_bucket: str) -> Tuple[int, Dict]:
        """
        Traction velocity: Growth rate, user acquisition, revenue progress
        """
        traction_events = [e for e in timeline_events if e['event_type'] == 'traction']
        
        # Base score from current metrics
        revenue_scores = {
            '0': 10, '1k-10k': 25, '10k-100k': 50, '100k-1m': 75, '1m+': 90
        }
        user_scores = {
            '0-100': 10, '100-1k': 30, '1k-10k': 50, '10k-100k': 70, '100k+': 85
        }
        
        base_score = (revenue_scores.get(revenue_bucket, 0) + 
                     user_scores.get(users_bucket, 0)) / 2
        
        # Velocity bonus from timeline
        if len(traction_events) >= 3:
            # Look for acceleration pattern
            recent_events = traction_events[-3:]
            velocity_bonus = len(recent_events) * 5  # Up to 15 points
            base_score += velocity_bonus
        
        return min(100, int(base_score)), {
            "revenue_bucket": revenue_bucket,
            "users_bucket": users_bucket,
            "traction_milestones": len(traction_events)
        }
    
    def calculate_team_score(self, timeline_events: List[Dict], team_size: int) -> Tuple[int, Dict]:
        """
        Team stability: Founder retention, key hires, advisor additions
        """
        team_events = [e for e in timeline_events if e['event_type'] == 'founder_team']
        
        # Base score from team size
        size_score = min(80, team_size * 15)  # Optimal around 3-5 people
        
        # Stability analysis
        founder_exits = len([e for e in team_events if 'exit' in e['title'].lower()])
        key_hires = len([e for e in team_events if 'hire' in e['title'].lower()])
        
        stability_penalty = founder_exits * 20  # Heavy penalty for founder churn
        growth_bonus = min(20, key_hires * 5)  # Bonus for strategic hires
        
        final_score = max(0, size_score - stability_penalty + growth_bonus)
        
        return min(100, int(final_score)), {
            "team_size": team_size,
            "founder_exits": founder_exits,
            "key_hires": key_hires
        }
    
    def calculate_capital_efficiency_score(self, timeline_events: List[Dict]) -> Tuple[int, Dict]:
        """
        Capital efficiency: Funding milestones, burn rate indicators
        """
        capital_events = [e for e in timeline_events if e['event_type'] == 'capital']
        
        if not capital_events:
            return 60, {"reason": "Bootstrapped - no external funding data"}
        
        # Analyze funding progression
        funding_rounds = len(capital_events)
        
        # Look for reasonable progression (not too frequent)
        if funding_rounds > 3:
            efficiency_score = 40  # Too many rounds suggests inefficiency
        elif funding_rounds == 1:
            efficiency_score = 80  # Single round suggests efficiency
        else:
            efficiency_score = 70  # Multiple rounds but reasonable
        
        return efficiency_score, {
            "funding_rounds": funding_rounds,
            "latest_round": capital_events[-1]['title'] if capital_events else None
        }
    
    def calculate_readiness_score(self, startup_data: Dict) -> Dict:
        """
        Main SRS calculation with explainable components
        """
        timeline_events = startup_data.get('timeline_events', [])
        
        # Calculate component scores
        execution_score, execution_explanation = self.calculate_execution_score(timeline_events)
        traction_score, traction_explanation = self.calculate_traction_score(
            timeline_events, 
            startup_data.get('revenue_bucket', '0'),
            startup_data.get('users_bucket', '0-100')
        )
        market_score = startup_data.get('market_clarity_score', 50)
        team_score, team_explanation = self.calculate_team_score(
            timeline_events, 
            startup_data.get('team_size', 1)
        )
        capital_score, capital_explanation = self.calculate_capital_efficiency_score(timeline_events)
        
        # Hard constraints (visibility locks)
        if startup_data.get('visibility_locked', False):
            return {
                'score': 0,
                'confidence_band': 0,
                'explanation': 'Visibility locked due to inactivity or other constraints',
                'components': {}
            }
        
        # Weighted final score
        final_score = (
            execution_score * self.feature_weights['execution_consistency'] +
            traction_score * self.feature_weights['traction_velocity'] +
            market_score * self.feature_weights['market_clarity'] +
            team_score * self.feature_weights['team_stability'] +
            capital_score * self.feature_weights['capital_efficiency']
        )
        
        # Confidence band based on data completeness
        data_completeness = sum([
            1 if timeline_events else 0,
            1 if startup_data.get('revenue_bucket') != '0' else 0,
            1 if startup_data.get('market_clarity_score', 0) > 0 else 0,
            1 if startup_data.get('team_size', 0) > 1 else 0
        ]) / 4
        
        confidence_band = int(20 * (1 - data_completeness))  # ±0 to ±20
        
        return {
            'score': int(final_score),
            'confidence_band': confidence_band,
            'components': {
                'execution': {'score': execution_score, 'explanation': execution_explanation},
                'traction': {'score': traction_score, 'explanation': traction_explanation},
                'market': {'score': market_score, 'explanation': 'Market clarity assessment'},
                'team': {'score': team_score, 'explanation': team_explanation},
                'capital': {'score': capital_score, 'explanation': capital_explanation}
            },
            'strengths': self._identify_strengths(execution_score, traction_score, market_score, team_score, capital_score),
            'weaknesses': self._identify_weaknesses(execution_score, traction_score, market_score, team_score, capital_score),
            'improvements': self._suggest_improvements(execution_score, traction_score, market_score, team_score, capital_score)
        }
    
    def _identify_strengths(self, execution: int, traction: int, market: int, team: int, capital: int) -> List[str]:
        """Identify top performing areas"""
        scores = {
            'Consistent execution': execution,
            'Strong traction': traction,
            'Clear market understanding': market,
            'Stable team': team,
            'Capital efficient': capital
        }
        return [area for area, score in scores.items() if score >= 70]
    
    def _identify_weaknesses(self, execution: int, traction: int, market: int, team: int, capital: int) -> List[str]:
        """Identify areas needing improvement"""
        scores = {
            'Execution consistency': execution,
            'Traction growth': traction,
            'Market clarity': market,
            'Team stability': team,
            'Capital efficiency': capital
        }
        return [area for area, score in scores.items() if score < 50]
    
    def _suggest_improvements(self, execution: int, traction: int, market: int, team: int, capital: int) -> List[str]:
        """Actionable improvement suggestions"""
        suggestions = []
        
        if execution < 50:
            suggestions.append("Establish regular product release cadence")
        if traction < 50:
            suggestions.append("Focus on user acquisition and retention metrics")
        if market < 50:
            suggestions.append("Clarify target market and value proposition")
        if team < 50:
            suggestions.append("Strengthen team with key hires or reduce founder churn")
        if capital < 50:
            suggestions.append("Improve capital efficiency or funding strategy")
            
        return suggestions


class InvestorFitScorer:
    """
    Investor Fit Score (IFS): 0-1 multiplier for startup-investor matching
    NEVER shown to founders
    """
    
    def calculate_fit_score(self, investor_profile: Dict, startup_data: Dict) -> Dict:
        """
        Calculate how well a startup fits an investor's preferences
        """
        stage_match = self._calculate_stage_match(
            investor_profile.get('stage_focus', []),
            startup_data.get('stage', '')
        )
        
        sector_match = self._calculate_sector_match(
            investor_profile.get('sector_focus', []),
            startup_data.get('sector', '')
        )
        
        # Deal breakers check
        deal_breaker_penalty = self._check_deal_breakers(
            investor_profile.get('deal_breakers', []),
            startup_data
        )
        
        # Pattern similarity (simplified - would use ML in production)
        pattern_similarity = 0.7  # Placeholder for ML-based similarity
        
        # Weighted final score
        fit_multiplier = (
            stage_match * 0.4 +
            sector_match * 0.3 +
            pattern_similarity * 0.3
        ) * (1 - deal_breaker_penalty)
        
        return {
            'fit_multiplier': round(fit_multiplier, 2),
            'stage_match_score': int(stage_match * 100),
            'sector_match_score': int(sector_match * 100),
            'pattern_similarity_score': int(pattern_similarity * 100),
            'deal_breaker_triggered': deal_breaker_penalty > 0
        }
    
    def _calculate_stage_match(self, investor_stages: List[str], startup_stage: str) -> float:
        """Stage preference matching"""
        if not investor_stages or not startup_stage:
            return 0.5  # Neutral if no data
        
        return 1.0 if startup_stage in investor_stages else 0.2
    
    def _calculate_sector_match(self, investor_sectors: List[str], startup_sector: str) -> float:
        """Sector preference matching"""
        if not investor_sectors or not startup_sector:
            return 0.5  # Neutral if no data
        
        return 1.0 if startup_sector in investor_sectors else 0.3
    
    def _check_deal_breakers(self, deal_breakers: List[str], startup_data: Dict) -> float:
        """Check for investor deal breakers"""
        # Simplified deal breaker logic
        # In production, this would be more sophisticated
        
        penalty = 0.0
        
        for breaker in deal_breakers:
            if 'no_revenue' in breaker.lower() and startup_data.get('revenue_bucket') == '0':
                penalty = 1.0  # Complete elimination
            elif 'team_size' in breaker.lower() and startup_data.get('team_size', 0) < 2:
                penalty = 0.8  # Heavy penalty
        
        return min(1.0, penalty)