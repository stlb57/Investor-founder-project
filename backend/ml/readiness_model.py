"""
Enhanced Startup Readiness Model - Model 1 (Improved)
Determines if a startup is investable right now using comprehensive data.
Now uses all the rich onboarding data for accurate sub-scores.
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from abc import ABC, abstractmethod
import os

class ReadinessModelInterface(ABC):
    """Interface for readiness scoring - ML or rule-based"""
    
    @abstractmethod
    def calculate_readiness(
        self,
        timeline_event_count: int,
        days_since_last_event: int,
        event_types: Dict[str, int],
        team_size: str,  # Now string range
        traction_bucket: str,
        burn_bucket: str,
        # New comprehensive fields
        founder_data: Optional[Dict] = None,
        traction_data: Optional[Dict] = None,
        market_data: Optional[Dict] = None,
        roadmap_data: Optional[Dict] = None
    ) -> Dict:
        """
        Returns:
        {
            'score': 0-100,
            'band': 'EARLY' | 'MEDIUM' | 'HIGH',
            'explanation': str,
            'execution_score': 0-100,
            'traction_score': 0-100,
            'market_score': 0-100,
            'team_score': 0-100,
            'capital_efficiency_score': 0-100
        }
        """
        pass


class EnhancedReadinessModel(ReadinessModelInterface):
    """Enhanced rule-based implementation with comprehensive scoring"""
    
    def calculate_readiness(
        self,
        timeline_event_count: int,
        days_since_last_event: int,
        event_types: Dict[str, int],
        team_size: str,
        traction_bucket: str,
        burn_bucket: str,
        founder_data: Optional[Dict] = None,
        traction_data: Optional[Dict] = None,
        market_data: Optional[Dict] = None,
        roadmap_data: Optional[Dict] = None
    ) -> Dict:
        """Comprehensive rule-based scoring with sub-scores"""
        
        founder_data = founder_data or {}
        traction_data = traction_data or {}
        market_data = market_data or {}
        roadmap_data = roadmap_data or {}
        
        # ==== SUB-SCORE 1: EXECUTION SCORE (0-100) ====
        execution_score = self._calculate_execution_score(
            timeline_event_count,
            days_since_last_event,
            event_types,
            founder_data,
            roadmap_data
        )
        
        # ==== SUB-SCORE 2: TRACTION SCORE (0-100) ====
        traction_score = self._calculate_traction_score(
            traction_data,
            traction_bucket
        )
        
        # ==== SUB-SCORE 3: MARKET SCORE (0-100) ====
        market_score = self._calculate_market_score(
            market_data,
            traction_data
        )
        
        # ==== SUB-SCORE 4: TEAM SCORE (0-100) ====
        team_score = self._calculate_team_score(
            team_size,
            founder_data
        )
        
        # ==== SUB-SCORE 5: CAPITAL EFFICIENCY SCORE (0-100) ====
        capital_efficiency_score = self._calculate_capital_efficiency_score(
            traction_data,
            burn_bucket
        )
        
        # ==== WEIGHTED OVERALL SCORE ====
        # Weights: Execution 30%, Traction 30%, Market 15%, Team 15%, Capital Efficiency 10%
        final_score = int(
            execution_score * 0.30 +
            traction_score * 0.30 +
            market_score * 0.15 +
            team_score * 0.15 +
            capital_efficiency_score * 0.10
        )
        final_score = max(0, min(100, final_score))
        
        # Determine band
        if final_score >= 70:
            band = 'HIGH'
        elif final_score >= 40:
            band = 'MEDIUM'
        else:
            band = 'EARLY'
        
        explanation = f"Comprehensive score based on execution ({execution_score}/100), "
        explanation += f"traction ({traction_score}/100), market ({market_score}/100), "
        explanation += f"team ({team_score}/100), and capital efficiency ({capital_efficiency_score}/100)"
        
        return {
            'score': final_score,
            'band': band,
            'explanation': explanation,
            'execution_score': execution_score,
            'traction_score': traction_score,
            'market_score': market_score,
            'team_score': team_score,
            'capital_efficiency_score': capital_efficiency_score
        }
    
    def _calculate_execution_score(
        self,
        timeline_count: int,
        days_since_last: int,
        event_types: Dict,
        founder_data: Dict,
        roadmap_data: Dict
    ) -> int:
        """Calculate execution score (0-100)"""
        score = 0
        
        # Timeline activity (0-35 points)
        score += min(35, timeline_count * 4)
        
        # Recency bonus/penalty (0-20 points)
        if days_since_last < 30:
            score += 20
        elif days_since_last < 60:
            score += 15
        elif days_since_last < 90:
            score += 10
        elif days_since_last < 180:
            score += 5
        
        # Event diversity (0-15 points)
        diversity = len([v for v in event_types.values() if v > 0])
        score += min(15, diversity * 5)
        
        # Founder commitment (0-15 points)
        if founder_data.get('time_commitment') == 'full_time':
            score += 15
        else:
            score += 7
        
        # Has clear next milestone (0-10 points)
        if roadmap_data.get('next_milestone'):
            score += 10
        
        # Incorporated (0-5 points)
        if founder_data.get('is_incorporated'):
            score += 5
        
        return min(100, score)
    
    def _calculate_traction_score(
        self,
        traction_data: Dict,
        legacy_traction: str
    ) -> int:
        """Calculate traction score (0-100)"""
        score = 0
        
        # User base (0-30 points)
        mau_range = traction_data.get('mau_range', legacy_traction)
        mau_scores = {
            '0-100': 5,
            '100-1k': 12,
            '1k-10k': 18,
            '10k-100k': 25,
            '100k+': 30
        }
        score += mau_scores.get(mau_range, 5)
        
        # Growth rate (0-25 points)
        growth = traction_data.get('user_growth_rate', '0-10%')
        growth_scores = {
            '0-10%': 5,
            '10-25%': 12,
            '25-50%': 18,
            '50%+': 25
        }
        score += growth_scores.get(growth, 5)
        
        # Revenue (0-25 points)
        revenue_range = traction_data.get('revenue_range', '0')
        revenue_scores = {
            '0': 5,
            '0-5k': 10,
            '5k-25k': 15,
            '25k-100k': 20,
            '100k+': 25
        }
        score += revenue_scores.get(revenue_range, 5)
        
        # Retention (0-20 points)
        retention = traction_data.get('retention_level', 'medium')
        retention_scores = {
            'low': 7,
            'medium': 13,
            'high': 20
        }
        score += retention_scores.get(retention, 10)
        
        return min(100, score)
    
    def _calculate_market_score(
        self,
        market_data: Dict,
        traction_data: Dict
    ) -> int:
        """Calculate market score (0-100)"""
        score = 0
        
        # Market size (0-30 points)
        market_size = market_data.get('market_size', 'medium')
        if market_size == 'large':
            score += 30
        elif market_size == 'medium':
            score += 20
        else:
            score += 10
        
        # Competition level (0-25 points) - Inverse scoring: lower competition = higher score
        competition = market_data.get('competition_level', 'medium')
        if competition == 'low':
            score += 25
        elif competition == 'medium':
            score += 15
        else:
            score += 8
        
        # Clear monetization model (0-20 points)
        if market_data.get('monetization_model'):
            score += 20
        
        # Revenue status (0-15 points)
        revenue_status = traction_data.get('revenue_status', 'pre_revenue')
        if revenue_status == 'profitable':
            score += 15
        elif revenue_status == 'early_revenue':
            score += 10
        else:
            score += 3
        
        # Product-market fit indicator (B2B bonus) (0-10 points)
        if market_data.get('customer_type') == 'B2B' and traction_data.get('revenue_range', '0') != '0':
            score += 10
        elif market_data.get('customer_type') == 'B2C' and traction_data.get('mau_range') not in ['0-100', '100-1k']:
            score += 7
        
        return min(100, score)
    
    def _calculate_team_score(
        self,
        team_size: str,
        founder_data: Dict
    ) -> int:
        """Calculate team score (0-100)"""
        score = 0
        
        # Team size (0-25 points)
        size_scores = {
            '1-2': 10,
            '3-5': 18,
            '6-10': 23,
            '11-20': 25,
            '20+': 22  # Slight penalty for too large before product-market fit
        }
        score += size_scores.get(team_size, 10)
        
        # Founder experience (0-30 points)
        experience_years = founder_data.get('experience_years', '0-2')
        exp_scores = {
            '0-2': 10,
            '3-5': 18,
            '6-10': 25,
            '10+': 30
        }
        score += exp_scores.get(experience_years, 10)
        
        # Previous startup experience (0-20 points)
        if founder_data.get('prev_startup_exp'):
            score += 20
        else:
            score += 5
        
        # Co-founders (0-15 points)
        cofounder_count = founder_data.get('cofounder_count', 0)
        if cofounder_count >= 2:
            score += 15
        elif cofounder_count == 1:
            score += 10
        else:
            score += 3
        
        # Clear founder role (0-10 points)
        if founder_data.get('founder_role'):
            score += 10
        
        return min(100, score)
    
    def _calculate_capital_efficiency_score(
        self,
        traction_data: Dict,
        burn_bucket: str
    ) -> int:
        """Calculate capital efficiency score (0-100)"""
        score = 50  # Neutral baseline
        
        # Revenue to burn ratio (0-40 points)
        revenue_range = traction_data.get('revenue_range', '0')
        revenue_status = traction_data.get('revenue_status', 'pre_revenue')
        
        if revenue_status == 'profitable':
            score += 40
        elif revenue_status == 'early_revenue':
            score += 25
        elif revenue_range != '0':
            score += 15
        else:
            score += 5
        
        # User growth vs burn (0-30 points)
        growth = traction_data.get('user_growth_rate', '0-10%')
        if burn_bucket == 'low':
            if growth in ['25-50%', '50%+']:
                score += 30  # Great efficiency
            elif growth in ['10-25%']:
                score += 20
            else:
                score += 10
        elif burn_bucket == 'medium':
            if growth in ['50%+']:
                score += 25
            elif growth in ['25-50%']:
                score += 15
            else:
                score += 8
        else:  # high or critical burn
            if growth in ['50%+']:
                score += 15
            else:
                score += 5
        
        # Fundraising readiness (0-20 points)
        # If they have a clear plan and need funding, that's actually good
        # If they're burning without a plan, that's bad
        
        # Early-stage pre-revenue is acceptable (15 points)
        mau_range = traction_data.get('mau_range', '0-100')
        if revenue_range == '0' and mau_range in ['0-100', '100-1k']:
            score += 10  # Expected at early stage
        
        return min(100, max(0, score))


class AzureMLReadinessModel(ReadinessModelInterface):
    """Azure ML implementation (v2) - optional"""
    
    def __init__(self, endpoint_url: Optional[str] = None, api_key: Optional[str] = None):
        self.endpoint_url = endpoint_url or os.getenv("AZURE_ML_READINESS_ENDPOINT")
        self.api_key = api_key or os.getenv("AZURE_ML_API_KEY")
        self.fallback = EnhancedReadinessModel()
    
    def calculate_readiness(
        self,
        timeline_event_count: int,
        days_since_last_event: int,
        event_types: Dict[str, int],
        team_size: str,
        traction_bucket: str,
        burn_bucket: str,
        founder_data: Optional[Dict] = None,
        traction_data: Optional[Dict] = None,
        market_data: Optional[Dict] = None,
        roadmap_data: Optional[Dict] = None
    ) -> Dict:
        """Call Azure ML endpoint if available, otherwise fallback"""
        
        if not self.endpoint_url or not self.api_key:
            # Fallback to enhanced rule-based
            return self.fallback.calculate_readiness(
                timeline_event_count, days_since_last_event, event_types,
                team_size, traction_bucket, burn_bucket,
                founder_data, traction_data, market_data, roadmap_data
            )
        
        try:
            import requests
            
            payload = {
                'timeline_event_count': timeline_event_count,
                'days_since_last_event': days_since_last_event,
                'event_types': event_types,
                'team_size': team_size,
                'traction_bucket': traction_bucket,
                'burn_bucket': burn_bucket,
                'founder_data': founder_data,
                'traction_data': traction_data,
                'market_data': market_data,
                'roadmap_data': roadmap_data
            }
            
            response = requests.post(
                self.endpoint_url,
                json=payload,
                headers={'Authorization': f'Bearer {self.api_key}'},
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'score': result.get('score', 50),
                    'band': result.get('band', 'MEDIUM'),
                    'explanation': result.get('explanation', 'ML-generated score'),
                    'execution_score': result.get('execution_score', 0),
                    'traction_score': result.get('traction_score', 0),
                    'market_score': result.get('market_score', 0),
                    'team_score': result.get('team_score', 0),
                    'capital_efficiency_score': result.get('capital_efficiency_score', 0)
                }
            else:
                # Fallback on error
                return self.fallback.calculate_readiness(
                    timeline_event_count, days_since_last_event, event_types,
                    team_size, traction_bucket, burn_bucket,
                    founder_data, traction_data, market_data, roadmap_data
                )
        
        except Exception as e:
            # Fallback on exception
            print(f"Azure ML error: {e}, using fallback")
            return self.fallback.calculate_readiness(
                timeline_event_count, days_since_last_event, event_types,
                team_size, traction_bucket, burn_bucket,
                founder_data, traction_data, market_data, roadmap_data
            )


def get_readiness_model() -> ReadinessModelInterface:
    """Factory function - returns ML model if enabled, else enhanced rule-based"""
    use_ml = os.getenv("USE_ML_READINESS", "false").lower() == "true"
    
    if use_ml:
        return AzureMLReadinessModel()
    else:
        return EnhancedReadinessModel()
