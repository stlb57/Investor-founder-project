# Gemini API Integration - Setup Guide

## Status: ✅ CONFIGURED

Your Gemini API key has been added, and the code has been updated to use the new `google-genai` package.

## What Was Fixed:

1. ✅ **Updated Package**: Switched from deprecated `google-generativeai` to `google-genai`
2. ✅ **Updated Code**: `backend/ml/gemini_public_review.py` now uses new API syntax
3. ✅ **API Key**: Already in `.env` file

## Next Steps:

### 1. Restart Backend Server
The backend server needs to be restarted for changes to take effect:

```powershell
# Stop the current backend (Ctrl+C in the backend terminal)
# Then restart:
cd backend
uvicorn main:app --reload
```

### 2. Test the Scores

#### For Startup Users:
1. Log in as a startup
2. Go to onboarding (if not done) or edit profile
3. Fill in comprehensive details:
   - Website URL
   - Description
   - All onboarding fields
4. Save and go to dashboard
5. You should see:
   - **Readiness Score** (0-100) with sub-scores
   - **Public Credibility Score** (Model 3) powered by Gemini

#### For Testing Gemini Specifically:
The Public Credibility score will show:
- Score based on website analysis
- Sentiment analysis
- Risk identification
- Credibility assessment

## How It Works:

### Readiness Score (Enhanced)
- Uses the new comprehensive onboarding data
- 5 sub-scores: Execution, Traction, Market, Team, Capital Efficiency
- Weighted combination for overall score

### Public Credibility (Gemini)
- Analyzes website URL and public information
- Uses Gemini 1.5 Flash model
- Provides score 0-100 with explanation
- Identifies risks and sentiment

## Troubleshooting:

### If scores still don't show:

1. **Check API Key Format**:
   ```
   GEMINI_API_KEY=AIzaSyC5o7NWhvJMA2ffPKg2XXodk34e4gls5cc
   ```
   - No quotes
   - No spaces

2. **Check Backend Logs**:
   - Look for "Gemini evaluation error" messages
   - Check if package imported successfully

3. **Verify Package Installation**:
   ```powershell
   pip list | findstr genai
   ```
   Should show: `google-genai`

4. **Create New Startup Profile**:
   - Sometimes existing profiles need to be re-scored
   - Try creating a new startup account and onboarding

5. **Check Browser Console**:
   - F12 → Console tab
   - Look for any API errors
   - Check Network tab for failed requests

## Expected Behavior:

✅ **Working Correctly**:
- Readiness score shows with 5 sub-scores
- Public credibility shows 0-100 score
- Both update when profile is edited
- Scores display on dashboard

❌ **Not Working**:
- Scores show as 0 or null
- "Gemini API key not configured" message
- Error 500 from backend
- Scores don't update after editing

## API Costs:

Gemini 1.5 Flash is very cost-effective:
- ~$0.000075 per 1K input tokens
- ~$0.0003 per 1K output tokens
- For typical startup evaluation: < $0.01 per request

## Technical Details:

### Model Used: `gemini-1.5-flash`
- Fast and cost-effective
- JSON mode for structured output
- Temperature: 0.2 (consistent results)
- Max tokens: 512

### Scoring Criteria:
- Sentiment analysis
- Claim consistency
- Risk phrase detection
- Transparency score
- Team/roadmap clarity

---

**Next**: Restart the backend and test by creating a startup profile or editing an existing one!
