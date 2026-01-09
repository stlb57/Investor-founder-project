"""
Investor Fit Model - Model 2
Determines whether a startup should be shown to a specific investor.
Used ONLY for ranking, never shown to startups.
"""

from typing import Dict, List, Optional, Tuple
from abc import ABC, abstractmethod
import os

class FitModelInterface(ABC):
    """Interface for investor-fit scoring"""
    
    @abstractmethod
    def calculate_fit(
        self,
        startup_stage: str,
        startup_sector: str,
        startup_readiness_band: str,
        investor_stage_preference: List[str],
        investor_sector_preference: List[str],
        check_size_range: Tuple[Optional[int], Optional[int]],
        startup_funding_raised: Optional[float] = None
    ) -> float:
        """
        Returns fit score 0-1 (used only for ranking)
        """
        pass


class RuleBasedFitModel(FitModelInterface):
    """Rule-based fit scoring - always works"""
    
    def calculate_fit(
        self,
        startup_stage: str,
        startup_sector: str,
        startup_readiness_band: str,
        investor_stage_preference: List[str],
        investor_sector_preference: List[str],
        check_size_range: Tuple[Optional[int], Optional[int]],
        startup_funding_raised: Optional[float] = None
    ) -> float:
        """Calculate fit using rule-based logic with dynamic scoring"""
        
        # Start with base score
        fit_score = 0.0
        
        # Stage match (0-35 points)
        if investor_stage_preference and startup_stage:
            if startup_stage in investor_stage_preference:
                fit_score += 35  # Perfect match
            elif len(investor_stage_preference) > 0:
                # Check partial matches (e.g., "Seed" matches "Pre-Seed" nearby)
                stage_order = ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+']
                try:
                    startup_idx = stage_order.index(startup_stage)
                    pref_indices = [stage_order.index(s) for s in investor_stage_preference if s in stage_order]
                    if pref_indices:
                        min_distance = min(abs(startup_idx - idx) for idx in pref_indices)
                        if min_distance == 1:
                            fit_score += 25  # Adjacent stage
                        elif min_distance == 2:
                            fit_score += 15  # 2 stages away
                        else:
                            fit_score += 5   # Far apart but investor invests
                except ValueError:
                    fit_score += 10  # Stage not in standard list, some credit
        else:
            # No preference specified = open to all
            fit_score += 25  # Neutral - assume compatible
        
        # Sector match (0-35 points)
        if investor_sector_preference and startup_sector:
            if startup_sector in investor_sector_preference:
                fit_score += 35  # Perfect match
            else:
                # Some credit for investor having broad interests
                fit_score += 8  # Possible interest
        else:
            # No sector preference = generalist investor
            fit_score += 25  # Neutral - compatible
        
        # Readiness band weighting (0-30 points)
        # Higher readiness startups get more points
        readiness_scores = {
            'HIGH': 30,
            'MEDIUM': 20,
            'EARLY': 10
        }
        fit_score += readiness_scores.get(startup_readiness_band, 15)
        
        # Convert to 0-1 range (max 100 points possible)
        fit_score = fit_score / 100.0
        
        # Add small randomization for variety (±5%)
        import random
        variance = random.uniform(-0.05, 0.05)
        fit_score = fit_score + variance
        
        return max(0.2, min(0.95, fit_score))  # Clamp between 20-95%


class AzureMLFitModel(FitModelInterface):
    """Azure ML implementation - optional"""
    
    def __init__(self, endpoint_url: Optional[str] = None, api_key: Optional[str] = None):
        self.endpoint_url = endpoint_url or os.getenv("AZURE_ML_FIT_ENDPOINT")
        self.api_key = api_key or os.getenv("AZURE_ML_API_KEY")
        self.fallback = RuleBasedFitModel()
    
    def calculate_fit(
        self,
        startup_stage: str,
        startup_sector: str,
        startup_readiness_band: str,
        investor_stage_preference: List[str],
        investor_sector_preference: List[str],
        check_size_range: Tuple[Optional[int], Optional[int]],
        startup_funding_raised: Optional[float] = None
    ) -> float:
        """Call Azure ML endpoint if available, otherwise fallback"""
        
        if not self.endpoint_url or not self.api_key:
            return self.fallback.calculate_fit(
                startup_stage, startup_sector, startup_readiness_band,
                investor_stage_preference, investor_sector_preference,
                check_size_range, startup_funding_raised
            )
        
        try:
            import requests
            
            payload = {
                'startup_stage': startup_stage,
                'startup_sector': startup_sector,
                'startup_readiness_band': startup_readiness_band,
                'investor_stage_preference': investor_stage_preference,
                'investor_sector_preference': investor_sector_preference,
                'check_size_min': check_size_range[0],
                'check_size_max': check_size_range[1],
                'startup_funding_raised': startup_funding_raised
            }
            
            response = requests.post(
                self.endpoint_url,
                json=payload,
                headers={'Authorization': f'Bearer {self.api_key}'},
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                return float(result.get('fit_score', 0.5))
            else:
                return self.fallback.calculate_fit(
                    startup_stage, startup_sector, startup_readiness_band,
                    investor_stage_preference, investor_sector_preference,
                    check_size_range, startup_funding_raised
                )
        
        except Exception as e:
            print(f"Azure ML fit error: {e}, using fallback")
            return self.fallback.calculate_fit(
                startup_stage, startup_sector, startup_readiness_band,
                investor_stage_preference, investor_sector_preference,
                check_size_range, startup_funding_raised
            )


def get_fit_model() -> FitModelInterface:
    """Factory function - returns ML model if enabled, else rule-based"""
    use_ml = os.getenv("USE_ML_FIT", "false").lower() == "true"
    
    if use_ml:
        return AzureMLFitModel()
    else:
        return RuleBasedFitModel()

