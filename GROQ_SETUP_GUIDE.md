# Groq API Setup Guide - FAST LLM Scoring

## ✅ Why Groq?
- ⚡ **Ultra-fast** inference (10x faster than other APIs)
- 🆓 **Free tier** with generous limits
- 🎯 **Reliable** JSON responses
- 💰 **Cost-effective** for production

## Step 1: Get Your Groq API Key

1. Go to: **https://console.groq.com/**
2. Sign up (it's free!)
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy the key (starts with `gsk_...`)

## Step 2: Add to .env File

Open `backend/.env` and add:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

**Important:** 
- No quotes around the key
- No spaces
- Replace `gsk_your_api_key_here` with your actual key

## Step 3: Restart Backend

```powershell
# Stop current backend (Ctrl+C)
# Then restart:
.\venv\Scripts\python -m uvicorn main:app --reload
```

You should see in logs:
```
✅ Groq API initialized successfully
```

## Step 4: Test the Scores

1. **Log in as a startup**
2. **Go to onboarding** or edit profile
3. **Fill in details** (especially website URL and description)
4. **Save**
5. **Go to dashboard**

You should now see:
- ✅ **Readiness Score**: 0-100 with 5 sub-scores
- ✅ **Public Credibility** (Model 3): AI-generated score from Groq

---

## What Groq Analyzes:

The AI (Llama 3.3 70B) evaluates:
- ✅ Website URL and description
- ✅ Sentiment analysis
- ✅ Claim consistency
- ✅ Risk detection (hype, vague promises)
- ✅ Transparency (team, roadmap, contact info)

Scoring:
- **90-100**: Very credible
- **70-89**: Mostly credible
- **50-69**: Questionable
- **0-49**: High risk

---

## Groq Free Tier Limits:

- **30 requests/minute**
- **14,400 requests/day**
- **More than enough** for development and testing!

---

## Troubleshooting:

### Scores still not showing?

1. **Check backend logs** for:
   ```
   ✅ Groq API initialized successfully
   ```

2. **Verify API key** in `.env`:
   ```
   GROQ_API_KEY=gsk_...
   ```

3. **Check browser console** (F12):
   - Look for API errors
   - Check Network tab for failed requests

4. **Try creating a new startup account**:
   - Fresh onboarding
   - Fill all fields
   - Check dashboard

### Still not working?

Check backend logs for:
- `Groq API error: ...` → Check API key
- `Groq package not installed` → Run: `pip install groq`
- No Groq messages → API key not in `.env`

---

**Next**: Get your Groq API key from https://console.groq.com/ and add it to `.env`!

The package is installing now, then just add your key and restart!
