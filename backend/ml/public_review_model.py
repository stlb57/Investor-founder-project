"""
Public Review Model - Model 3
Assesses public credibility of a startup using publicly available summaries only.

Analysis includes:
- Website text (if provided)
- Public article summaries (if provided)
- Headline-level signals

DOES NOT:
- Crawl personal accounts
- Scrape GitHub activity
- Monitor app store reviews
- Perform behavioral surveillance
- Claim success prediction

This is signal-based evaluation only, not prediction.
"""

from typing import Dict, List, Optional
from .interfaces import PublicReviewModelInterface
import os
from .gemini_public_review import GeminiPublicReviewModel



class AzureCognitiveServicesModel(PublicReviewModelInterface):
    """Azure Cognitive Services implementation"""
    
    def __init__(self, endpoint_url: Optional[str] = None, api_key: Optional[str] = None):
        self.endpoint_url = endpoint_url or os.getenv("AZURE_COGNITIVE_ENDPOINT")
        self.api_key = api_key or os.getenv("AZURE_COGNITIVE_API_KEY")
        self.fallback = StubPublicReviewModel()
    
    def calculate_public_review(
        self,
        website_url: Optional[str],
        public_articles: Optional[List[str]] = None,
        github_readme: Optional[str] = None,
        app_store_reviews: Optional[List[str]] = None
    ) -> Dict:
        """
        Analyze publicly available summaries only (not active scraping).
        Uses Azure Cognitive Services for sentiment analysis of provided content.
        """
        
        if not self.endpoint_url or not self.api_key:
            return self.fallback.calculate_public_review(
                website_url, public_articles, github_readme, app_store_reviews
            )
        
        try:
            import requests
            
            # Combine all text sources
            text_to_analyze = []
            if github_readme:
                text_to_analyze.append(github_readme[:5000])  # Limit length
            
            if app_store_reviews:
                text_to_analyze.extend(app_store_reviews[:10])  # Limit reviews
            
            if public_articles:
                text_to_analyze.extend(public_articles[:5])  # Limit articles
            
            if not text_to_analyze:
                return {
                    'score': 50,
                    'explanation': 'No public content available for review'
                }
            
            # Call Azure Text Analytics for sentiment analysis
            documents = [
                {'id': str(i), 'text': text[:5000]}
                for i, text in enumerate(text_to_analyze)
            ]
            
            response = requests.post(
                f"{self.endpoint_url}/text/analytics/v3.1/sentiment",
                json={'documents': documents},
                headers={
                    'Ocp-Apim-Subscription-Key': self.api_key,
                    'Content-Type': 'application/json'
                },
                timeout=10
            )
            
            if response.status_code == 200:
                results = response.json()
                
                # Calculate average sentiment
                sentiments = [
                    doc['confidenceScores']['positive']
                    for doc in results.get('documents', [])
                ]
                
                avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0.5
                
                # Convert to 0-100 score
                score = int(avg_sentiment * 100)
                
                # Presence bonus (having any public content is positive)
                presence_bonus = min(20, len(text_to_analyze) * 5)
                score = min(100, score + presence_bonus)
                
                explanation = f"Public sentiment: {score}/100 based on {len(text_to_analyze)} content sources"
                
                return {
                    'score': score,
                    'explanation': explanation
                }
            else:
                return self.fallback.calculate_public_review(
                    website_url, public_articles, github_readme, app_store_reviews
                )
        
        except Exception as e:
            print(f"Azure Cognitive Services error: {e}, using fallback")
            return self.fallback.calculate_public_review(
                website_url, public_articles, github_readme, app_store_reviews
            )


class StubPublicReviewModel(PublicReviewModelInterface):
    """Stub implementation when Azure is not available"""
    
    def calculate_public_review(
        self,
        website_url: Optional[str],
        public_articles: Optional[List[str]] = None,
        github_readme: Optional[str] = None,
        app_store_reviews: Optional[List[str]] = None
    ) -> Dict:
        """
        Simple stub that checks for presence of publicly available content.
        Does not crawl or scrape - only analyzes what is provided.
        """
        
        sources_found = 0
        if website_url:
            sources_found += 1
        if public_articles:
            sources_found += len(public_articles[:3])
        if github_readme:
            sources_found += 1
        if app_store_reviews:
            sources_found += 1
        
        # Base score from presence
        if sources_found >= 3:
            score = 70
            explanation = "Good public presence across multiple channels"
        elif sources_found >= 2:
            score = 55
            explanation = "Moderate public presence"
        elif sources_found >= 1:
            score = 40
            explanation = "Limited public presence"
        else:
            score = 25
            explanation = "Minimal public information available"
        
        return {
            'score': score,
            'explanation': explanation
        }


def get_public_review_model() -> PublicReviewModelInterface:
    """Factory function - returns Groq if key exists, else Gemini, else Azure, else stub"""
    
    # Check for Groq API key first (fastest and most reliable)
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        from .groq_public_review import GroqPublicReviewModel
        return GroqPublicReviewModel(groq_key)
    
    # Check for Gemini API key
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        return GeminiPublicReviewModel(gemini_key)
        
    # Check for Azure
    use_azure = os.getenv("USE_AZURE_COGNITIVE", "false").lower() == "true"
    if use_azure:
        return AzureCognitiveServicesModel()
    
    # Fallback to stub
    return StubPublicReviewModel()

