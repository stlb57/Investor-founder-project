# SignalFund - AI Decision Support for Startup Funding

SignalFund is a decision-support website for startup investing. It connects investors with execution-ready startups through explainable AI scoring and bias-aware matching.

## 🎯 Core Philosophy

- **Investors have more power than startups** - Investors never see all startups
- **Startups cannot contact investors first** - Only investors can request introductions
- **No infinite feeds** - Curated 2-5 startups per investor
- **Progress > storytelling** - Timeline-based scoring over pitch decks
- **Everything must be explainable** - No black-box ML

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

**Backend:**
- FastAPI (Python)
- PostgreSQL (production) / SQLite (development)
- JWT authentication
- Role-based access control

**ML Models (Pluggable):**
- Startup Readiness Model (rule-based v1, Azure ML v2)
- Investor Fit Model (rule-based v1, Azure ML v2)
- Public Review Model (stub v1, Azure Cognitive Services v2)

**Infrastructure:**
- Azure App Service (hosting)
- Azure Machine Learning (optional ML)
- Azure Cognitive Services (optional public review)

## 📁 Project Structure

```
signalfund/
├── backend/              # FastAPI backend
│   ├── api/             # API routes
│   ├── models/          # Database models
│   ├── ml/              # ML model interfaces
│   ├── services/        # Business logic
│   └── db/              # Database setup
├── frontend/            # Next.js frontend
│   ├── pages/           # Next.js pages
│   ├── components/      # React components
│   └── lib/             # Utilities
├── database/            # SQL schemas
└── infra/               # Infrastructure docs
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL (or SQLite for development)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations (SQLite)
python -c "from db.database import engine; from models.models import Base; Base.metadata.create_all(bind=engine)"

# Start backend
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📝 Key Features

### For Startups

1. **Onboarding** - Create profile with impact tags and metrics
2. **Dashboard** - View readiness score, public review score, insights
3. **Timeline** - Add events (team/product/traction/capital)
4. **Introductions** - Manage investor introduction requests

### For Investors

1. **Onboarding** - Set preferences (stage, sector, check size)
2. **Dashboard** - View 2-5 curated startups (no search, no filters)
3. **Startup Deep View** - Full details, timeline, scores
4. **Introduction Flow** - Request intro, chat after acceptance

### ML Models

All models are **pluggable** and work with or without ML:

- **Readiness Model**: Scores startup investability (0-100)
- **Fit Model**: Matches startups to investors (0-1, never shown to startups)
- **Public Review Model**: Assesses public credibility using Azure Cognitive Services

## 🔐 Authentication & Roles

- Role-based access control (Investor or Startup)
- Role is locked at signup and cannot be changed
- JWT tokens for API authentication

## 🎨 Impact Tags

Startups can select up to 5 impact tags:
- Environment Friendly
- Climate Tech
- Healthcare Access
- Education
- Financial Inclusion
- Women-Led
- Rural / Tier-2
- Accessibility
- Open Source

## 🔍 Blind Screening Mode

Investors can enable blind screening to hide:
- Founder names
- Education backgrounds
- Network cues

Still shows: Timeline, Metrics, Tags, Scores

## 📊 Scoring System

### Readiness Score (0-100)
- Based on timeline events, team size, traction, burn rate
- Band: Early / Medium / High
- Immediately computed on onboarding and after timeline changes

### Public Review Score (0-100)
- Based on website, articles, GitHub, app store reviews
- Assesses public credibility
- Can cap risk but cannot inflate readiness

### Fit Score (0-1, hidden)
- Matches startups to investor preferences
- Used only for ranking in investor dashboard
- Never shown to startups

## 🔄 Introduction Flow

1. Investor views startup and clicks "Request Intro"
2. Startup receives notification
3. Startup accepts or declines
4. If accepted → Limited chat opens
5. Outcome logged (meeting/pass/invested)

## 🚫 What SignalFund is NOT

- ❌ Social network
- ❌ Marketplace
- ❌ Pitch deck hosting
- ❌ Chat app (chat only after intro accepted)
- ❌ Fund admin system
- ❌ Startup search/browse
- ❌ Investor directory

## 🌐 Azure Deployment

See `infra/azure-setup.md` for detailed Azure deployment instructions.

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📚 API Documentation

API docs available at `http://localhost:8000/docs` when backend is running.

## 🤝 Contributing

This is a production-style application built for Imagine Cup. Follow the core philosophy and rules strictly.

## 📄 License

Copyright 2024 SignalFund
