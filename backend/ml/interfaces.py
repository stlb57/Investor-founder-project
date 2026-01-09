from abc import ABC, abstractmethod
from typing import Dict, List, Optional

class PublicReviewModelInterface(ABC):
    """Interface for public review scoring"""
    
    @abstractmethod
    def calculate_public_review(
        self,
        website_url: Optional[str],
        public_articles: Optional[List[str]] = None,
        github_readme: Optional[str] = None,
        app_store_reviews: Optional[List[str]] = None
    ) -> Dict:
        """
        Returns:
        {
            'score': 0-100,
            'explanation': str
        }
        """
        pass
