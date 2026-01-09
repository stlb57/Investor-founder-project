"""
Groq Public Review Model - Fast LLM API
Uses Groq's ultra-fast inference for startup credibility scoring
"""

import os
import json
from typing import Dict, List, Optional
from .interfaces import PublicReviewModelInterface

class GroqPublicReviewModel(PublicReviewModelInterface):
    """Groq-based public review model implementation (Model 3)"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        self.client = None
        
        if self.api_key:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
                print("✅ Groq API initialized successfully")
            except ImportError:
                print("⚠️ Groq package not installed. Run: pip install groq")
            except Exception as e:
                print(f"⚠️ Groq initialization error: {e}")

    def build_prompt(self, public_text: str) -> str:
        return f"""You are a startup due-diligence analyst.

Your task is to evaluate whether a startup looks credible based on public information.

Analyze the following:
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

Return ONLY valid JSON with this exact structure:
{{
  "public_review_score": 75,
  "sentiment": "positive",
  "key_risks": ["example risk"],
  "explanation": "Brief reasoning"
}}"""

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
                'explanation': "Groq API not configured. Using baseline scoring."
            }
        
        # Format input text
        combined_text = f"WEBSITE URL: {website_url or 'N/A'}\n\n"
        
        if public_articles:
            combined_text += "ARTICLES:\n" + "\n".join(public_articles[:3]) + "\n\n"
        
        if github_readme:
            combined_text += f"GITHUB:\n{github_readme[:1000]}\n\n"
            
        if app_store_reviews:
            combined_text += "REVIEWS:\n" + "\n".join(app_store_reviews[:5]) + "\n\n"

        try:
            prompt = self.build_prompt(combined_text)
            
            # Call Groq API
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a startup analyst. Always return valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",  # Fast and accurate
                temperature=0.2,
                max_tokens=512,
                response_format={"type": "json_object"}
            )
            
            response_text = chat_completion.choices[0].message.content
            result = json.loads(response_text)
            
            return {
                'score': result.get('public_review_score', 50),
                'explanation': result.get('explanation', "Analysis complete."),
                'sentiment': result.get('sentiment', 'neutral'),
                'key_risks': result.get('key_risks', [])
            }
            
        except json.JSONDecodeError as e:
            print(f"Groq JSON parse error: {e}")
            return {
                'score': 50,
                'explanation': "Could not parse AI response. Using baseline."
            }
        except Exception as e:
            print(f"Groq API error: {e}")
            return {
                'score': 50,
                'explanation': f"AI analysis unavailable: {str(e)[:100]}"
            }
