# ☁️ Azure Deployment Guide for ScaleX

This guide maps out how to deploy your full stack application to Azure. Use this for your Imagine Cup submission.

## 🏗️ Architecture Overview

- **Frontend**: Azure Static Web Apps (Next.js)
- **Backend**: Azure Web App for Python (FastAPI)
- **Database**: Azure Database for PostgreSQL (Recommended)
- **AI**: Gemini/Groq API Keys (Environment Variables)

---

## 1️⃣ Database Setup (Azure PostgreSQL)

*Switching to PostgreSQL is highly recommended for production/cloud deployment as SQLite files reset on Azure App Service restarts.*

1. **Create Resource**: Go to Azure Portal -> Create "Azure Database for PostgreSQL - Flexible Server".
   - **Performance**: Select "Burstable (B1ms)" (Free tier eligible).
   - **Auth**: Set a username/password.
   - **Networking**: Allow public access from Azure services.
2. **Get Connection String**:
   - Format: `postgresql://username:password@hostname:5432/dbname`
   - Save this for later.

---

## 2️⃣ Backend Deployment (Azure Web App)

1. **Prepare Code**:
   - Ensure `requirements.txt` is updated (Run `pip freeze > requirements.txt` if needed).
   - *Important*: Add `psycopg2-binary` to `requirements.txt` for PostgreSQL support.
   - Commit `backend/startup.sh`.

2. **Create Web App**:
   - **Resource**: "Web App"
   - **Publish**: "Code"
   - **Runtime Stack**: "Python 3.10" (or 3.11)
   - **OS**: "Linux"
   - **Pricing Plan**: "F1" (Free) or "B1" (Basic - recommended).

3. **Configure Settings (Environment Variables)**:
   - Go to **Settings > Environment variables** in your Web App.
   - Add the keys:
     - `DATABASE_URL`: *(Your PostgreSQL connection string)*
     - `GEMINI_API_KEY`: *(Your Gemini Key)*
     - `GROQ_API_KEY`: *(Your Groq Key)*
     - `SECRET_KEY`: *(Generate a random string)*
     - `ALGORITHM`: `HS256`

4. **Startup Command**:
   - Go to **Settings > Configuration > General Settings**.
   - **Startup Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`
   - *Alternate*: `python -m uvicorn main:app --host 0.0.0.0`

5. **Deploy Code**:
   - Use **VS Code Azure Tools** extension (easiest):
     1. Right click `backend` folder.
     2. "Deploy to Web App...".
     3. Select your created Web App.

---

## 3️⃣ Frontend Deployment (Azure Static Web Apps)

1. **Prepare Code**:
   - Ensure your code is pushed to GitHub.

2. **Create Static Web App**:
   - Go to Azure Portal -> "Static Web Apps".
   - **Plan Type**: "Free".
   - **Deployment Details**: Link your GitHub repo.
   - **Build Presets**: Select "Next.js".
   - **App Location**: `/frontend`
   - **Api Location**: (Leave empty, we use a separate Python backend).
   - **Output Location**: (Leave default).

3. **Configure Environment Variables**:
   - In Azure Portal -> Static Web App -> **Environment variables**.
   - Add:
     - `NEXT_PUBLIC_API_URL`: `https://<YOUR-BACKEND-APP-NAME>.azurewebsites.net/api`
     - *(IMPORTANT: No trailing slash generally, but check your code logic)*.

---

## 4️⃣ Connecting the Pieces

1. **CORS on Backend**:
   - Go to your **Backend Web App** -> **API** -> **CORS**.
   - Add the URL of your **Frontend Static Web App** (e.g., `https://calm-sky-01234.azurestaticapps.net`).
   - Check "Enable Access-Control-Allow-Credentials".

2. **Run Migrations**:
   - Once backend is deployed, you need to create the tables in the new PostgreSQL DB.
   - You can use SSH into the Web App: `https://<YOUR-APP-NAME>.scm.azurewebsites.net/webssh/host`.
   - Run: `python migrate_database.py` (ensure this script supports remote DBs).

---

## 🚀 Troubleshooting

- **500 Errors on Backend**: Check "Log Stream" in Azure Portal.
- **Frontend can't reach Backend**: Check Browser Console (F12) Network tab. Usually CORS or incorrect `NEXT_PUBLIC_API_URL`.
