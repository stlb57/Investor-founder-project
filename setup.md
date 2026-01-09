# SignalFund Setup Guide

## Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL 12+

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials:
# DATABASE_URL=postgresql://username:password@localhost/signalfund
# SECRET_KEY=your-secret-key-here

# Create PostgreSQL database
createdb signalfund

# Start the API server
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Project Structure

```
signalfund/
├── backend/                 # FastAPI application
│   ├── api/                # API routes (auth, investors, startups, scoring)
│   ├── models/             # Database models
│   ├── ml/                 # ML scoring logic
│   └── main.py             # Application entry point
├── frontend/               # Next.js application
│   ├── components/         # React components (timeline, scoring)
│   ├── pages/              # Next.js pages
│   ├── lib/                # Utilities (auth, API client)
│   └── styles/             # Tailwind CSS
└── database/               # SQL schema
```

## Key Features Implemented

### Core Intelligence
- ✅ Startup Readiness Score (SRS) with explainable components
- ✅ Investor Fit Score (IFS) for private matching
- ✅ Timeline visualization system
- ✅ Rule-based scoring with confidence bands

### Responsible AI
- ✅ Explainable decision components
- ✅ Confidence bands for uncertainty
- ✅ Bias mitigation through regional normalization
- ✅ No black-box ML models

### User Experience
- ✅ Role-locked authentication (investor vs startup)
- ✅ Clean, minimal UI with desktop-first design
- ✅ Card-based layout system
- ✅ No search/browsing - curated experience only

### API Endpoints
- ✅ Authentication & user management
- ✅ Startup profile & timeline management
- ✅ Investor profile & preferences
- ✅ Scoring system with ML backend
- ✅ Introduction request system

## Development Notes

### TypeScript Configuration
The frontend uses TypeScript with relaxed settings for rapid development. To enable strict type checking:

1. Change `"strict": false` to `"strict": true` in `tsconfig.json`
2. Fix type errors as they appear

### Database Schema
The database schema is automatically created when the FastAPI app starts. For production:

1. Use proper database migrations (Alembic)
2. Set up database connection pooling
3. Add proper indexes for performance

### Environment Variables
Required environment variables:

**Backend (.env):**
```
DATABASE_URL=postgresql://username:password@localhost/signalfund
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Next Steps for Production

1. **Enhanced ML Models**
   - Train pattern similarity models on real data
   - Implement regional normalization
   - Add more sophisticated deal-breaker logic

2. **Advanced Features**
   - Blind evaluation mode
   - Ecosystem health metrics
   - Advanced timeline analytics

3. **Security & Performance**
   - Rate limiting
   - Input validation
   - Database optimization
   - Caching layer

4. **Monitoring & Analytics**
   - User behavior tracking
   - Score accuracy monitoring
   - Bias detection metrics

## Architecture Decisions

- **Explainable AI**: All ML models use interpretable algorithms (logistic regression, gradient boosting)
- **Role Separation**: Complete separation between investor and startup experiences
- **No Social Features**: Deliberately excludes feeds, search, messaging to focus on decision support
- **Progress Tracking**: Timeline events as the core data structure for measuring execution
- **Confidence Modeling**: Every score includes uncertainty bounds

## Troubleshooting

### Common Issues

1. **Module not found errors**: Run `npm install` in the frontend directory
2. **Database connection errors**: Check PostgreSQL is running and credentials are correct
3. **CORS errors**: Ensure the Next.js proxy is configured correctly in `next.config.js`
4. **TypeScript errors**: Set `"strict": false` in `tsconfig.json` for development

### Development Tips

1. Use `npm run type-check` to check TypeScript without building
2. API documentation available at `http://localhost:8000/docs`
3. Database admin tools: pgAdmin or similar for PostgreSQL management