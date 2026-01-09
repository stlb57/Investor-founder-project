# Azure Infrastructure Setup for SignalFund

## Overview
SignalFund uses Azure services for hosting and ML capabilities.

## Required Azure Services

### 1. Azure App Service
- Hosts both frontend (Next.js) and backend (FastAPI)
- **Setup Steps:**
  1. Create App Service Plan (Linux, Standard tier)
  2. Create Web App for backend API
  3. Configure environment variables (see `.env.example`)
  4. Enable HTTPS
  5. Configure CORS for frontend domain

### 2. Azure PostgreSQL Database
- Production database (replaces SQLite)
- **Setup Steps:**
  1. Create PostgreSQL server
  2. Create database: `signalfund`
  3. Configure firewall rules (allow Azure services)
  4. Update `DATABASE_URL` in App Service config

### 3. Azure Machine Learning (Optional)
- Hosts ML models (Readiness and Fit models)
- **Setup Steps:**
  1. Create ML Workspace
  2. Deploy models as REST endpoints
  3. Configure authentication (API keys)
  4. Update environment variables:
     - `USE_ML_READINESS=true`
     - `AZURE_ML_READINESS_ENDPOINT=<endpoint_url>`
     - `AZURE_ML_API_KEY=<key>`
     - `USE_ML_FIT=true`
     - `AZURE_ML_FIT_ENDPOINT=<endpoint_url>`

### 4. Azure Cognitive Services (Optional)
- Powers Public Review scoring
- **Setup Steps:**
  1. Create Text Analytics resource
  2. Get endpoint URL and API key
  3. Update environment variables:
     - `USE_AZURE_COGNITIVE=true`
     - `AZURE_COGNITIVE_ENDPOINT=<endpoint_url>`
     - `AZURE_COGNITIVE_API_KEY=<key>`

## Environment Variables

See `.env.example` for complete list.

## Deployment

### Backend Deployment
```bash
cd backend
az webapp up --name signalfund-api --resource-group <resource-group>
```

### Frontend Deployment
Build and deploy static site:
```bash
cd frontend
npm run build
# Deploy to Azure Static Web Apps or App Service
```

## Database Migration

Run migrations on first deployment:
```bash
# Connect to Azure PostgreSQL and run schema.sql
psql -h <server>.postgres.database.azure.com -U <user> -d signalfund -f database/schema.sql
```

## Monitoring

- Application Insights for backend monitoring
- Log Analytics for frontend logs
- Set up alerts for errors and performance

