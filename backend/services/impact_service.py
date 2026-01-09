"""
Impact Depth Classification Service
Classifies impact tags into: surface, integrated, core
"""

from typing import List
from models.models import ImpactDepth

def calculate_impact_depth(impact_tags: List[str], sector: str, description: str = "") -> ImpactDepth:
    """
    Rule-based impact depth classification:
    - core: Impact affects core product
    - integrated: Impact supports main product
    - surface: Impact is marketing-only
    """
    
    if not impact_tags:
        return ImpactDepth.SURFACE
    
    # Core impact indicators (affects core product)
    core_indicators = [
        "Climate Tech",  # Core if product is climate-focused
        "Healthcare Access",  # Core if product is healthcare
        "Financial Inclusion",  # Core if product is fintech for underserved
        "Accessibility",  # Core if product is accessibility-focused
        "Open Source"  # Core if product is open source
    ]
    
    # Check if any core indicators align with sector/description
    description_lower = (description or "").lower()
    sector_lower = (sector or "").lower()
    
    for tag in impact_tags:
        if tag in core_indicators:
            # Check if tag aligns with core product
            if tag == "Climate Tech" and any(word in description_lower or word in sector_lower 
                                              for word in ["climate", "carbon", "energy", "sustainability", "green"]):
                return ImpactDepth.CORE
            elif tag == "Healthcare Access" and any(word in description_lower or word in sector_lower 
                                                    for word in ["health", "medical", "care", "healthcare"]):
                return ImpactDepth.CORE
            elif tag == "Financial Inclusion" and any(word in description_lower or word in sector_lower 
                                                       for word in ["finance", "fintech", "banking", "payment", "financial"]):
                return ImpactDepth.CORE
            elif tag == "Accessibility" and any(word in description_lower 
                                                for word in ["accessibility", "accessible", "disability", "a11y"]):
                return ImpactDepth.CORE
            elif tag == "Open Source" and any(word in description_lower 
                                             for word in ["open source", "opensource", "oss"]):
                return ImpactDepth.CORE
    
    # Integrated indicators (supports main product)
    integrated_indicators = [
        "Environment Friendly",
        "Education",
        "Rural / Tier-2"
    ]
    
    # If tags are integrated and present, check if they support the product
    if any(tag in integrated_indicators for tag in impact_tags):
        # Check if description mentions how impact supports the product
        if any(word in description_lower for word in ["support", "enable", "help", "provide"]):
            return ImpactDepth.INTEGRATED
    
    # Default: surface (marketing-only)
    return ImpactDepth.SURFACE

