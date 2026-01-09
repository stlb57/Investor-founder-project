"""
Gemini Public Review Model - Optional Integration
Falls back to stub if Gemini is not available
"""

import os
import json
from typing import Dict, List, Optional
from .interfaces import PublicReviewModelInterface

class GeminiPublicReviewModel(PublicReviewModelInterface):
    """Gemini-based public review model implementation (Model 3)"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = None
        
        # Try to import and initialize Gemini
        if self.api_key:
            try:
                import google.genai as genai
                self.client = genai.Client(api_key=self.api_key)
                print("✅ Gemini API initialized successfully")
            except ImportError as e:
                print(f"⚠️ Gemini package not available: {e}")
                print("   Install with: pip install google-genai")
            except Exception as e:
                print(f"⚠️ Gemini initialization error: {e}")

    def build_gemini_prompt(self, public_text: str) -> str:
        return f"""
You are a startup due-diligence analyst.

Your task is to evaluate whether a startup looks credible based on public information.

Analyze the following inputs:
- Website text
- Public articles
- App store reviews (if any)
- GitHub README (if any)

Check for:
1. Sentiment (positive / neutral / negative)
2. Consistency of claims
3. Risk phrases (hype, guaranteed returns, vague promises)
4. Transparency (team, roadmap, contact, technical clarity)

Public Content:
----------------
{public_text}
----------------

Scoring Rules:
- 90–100 → Very credible
- 70–89 → Mostly credible
- 50–69 → Questionable
- 0–49 → High risk

Return ONLY valid JSON:
{{
  "public_review_score": number,
  "sentiment": "positive | neutral | negative",
  "key_risks": [string],
  "explanation": "short clear reasoning"
}}
"""

    def calculate_public_review(
        self,
        website_url: Optional[str],
        public_articles: Optional[List[str]] = None,
        github_readme: Optional[str] = None,
        app_store_reviews: Optional[List[str]] = None
    ) -> Dict:
        if not self.client:
            return {
                'score': 50,
                'explanation': "Gemini API not available. Using baseline scoring."
            }
        
        # Format input text
        combined_text = f"WEBSITE URL: {website_url or 'N/A'}\n\n"
        
        if public_articles:
            combined_text += "ARTICLES:\n" + "\n".join(public_articles) + "\n\n"
        
        if github_readme:
            combined_text += f"GITHUB:\n{github_readme}\n\n"
            
        if app_store_reviews:
            combined_text += "REVIEWS:\n" + "\n".join(app_store_reviews) + "\n\n"

        try:
            import google.genai as genai
            
            prompt = self.build_gemini_prompt(combined_text)
            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    temperature=0.2,
                    max_output_tokens=512,
                    response_mime_type="application/json"
                )
            )
            
            result = json.loads(response.text)
            return {
                'score': result.get('public_review_score', 50),
                'explanation': result.get('explanation', "Analysis complete."),
                'sentiment': result.get('sentiment'),
                'key_risks': result.get('key_risks', [])
            }
        except Exception as e:
            print(f"Gemini evaluation error: {e}")
            return {
                'score': 50,
                'explanation': f"Gemini analysis unavailable. Using baseline."
            }
