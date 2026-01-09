import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
def build_gemini_prompt(public_text):
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
def gemini_public_review(public_text):
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = build_gemini_prompt(public_text)

    response = model.generate_content(
        prompt,
        generation_config={
            "temperature": 0.2,
            "max_output_tokens": 512
        }
    )

    return response.text
def public_review_model_gemini(
    website_text="",
    articles_text="",
    reviews_text="",
    github_text=""
):
    combined_text = f"""
WEBSITE:
{website_text}

ARTICLES:
{articles_text}

REVIEWS:
{reviews_text}

GITHUB:
{github_text}
"""
    return gemini_public_review(combined_text)

