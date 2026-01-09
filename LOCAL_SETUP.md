# SignalFund - Local Development Setup Guide

This guide will help you run SignalFund locally on your Windows machine.

## 📋 Prerequisites

Before starting, ensure you have:

- **Python 3.9+** - Check: `python --version`
- **Node.js 18+** - Check: `node --version`
- **npm** (comes with Node.js) - Check: `npm --version`
- **Git** (if cloning from repository)

## 🔧 Step 1: Backend Setup

### 1.1 Navigate to Backend Directory
```bash
cd backend
```

### 1.2 Create Virtual Environment
```bash
python -m venv venv
```

### 1.3 Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt when activated.

### 1.4 Install Dependencies
```bash
pip install -r requirements.txt
```

### 1.5 Create Environment File

Create a `.env` file in the `backend` directory with the following content:

```env
# Database (SQLite for local development)
DATABASE_URL=sqlite:///./signalfund.db

# Authentication
SECRET_KEY=your-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ML Configuration (optional - defaults to rule-based)
USE_ML_READINESS=false
USE_ML_FIT=false
USE_AZURE_COGNITIVE=false

# CORS (for frontend)
CORS_ORIGINS=http://localhost:3000
```

### 1.6 Initialize Database

Create the database tables:

```bash
python -c "from db.database import engine; from models.models import Base; Base.metadata.create_all(bind=engine)"
```

This will create `signalfund.db` in your `backend` directory.

### 1.7 Start Backend Server

```bash
uvicorn main:app --reload
```

✅ Backend should now be running at: **http://localhost:8000**

- API docs: **http://localhost:8000/docs**
- Health check: **http://localhost:8000/health**

Keep this terminal window open.

---

## 🎨 Step 2: Frontend Setup

Open a **NEW terminal window** (keep backend running).

### 2.1 Navigate to Frontend Directory
```bash
cd frontend
```

### 2.2 Install Dependencies
```bash
npm install
```

This may take a few minutes the first time.

### 2.3 Create Environment File

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2.4 Start Frontend Development Server

```bash
npm run dev
```

✅ Frontend should now be running at: **http://localhost:3000**

---

## 🚀 Step 3: Verify Everything Works

1. **Open your browser** and go to: http://localhost:3000

2. You should see the SignalFund landing page with:
   - "I'm an Investor" button
   - "I'm a Startup" button

3. **Test the API** by visiting: http://localhost:8000/docs
   - This is the interactive API documentation
   - You can test endpoints directly from here

---

## 📝 Quick Test Flow

### Create a Startup Account:
1. Click "I'm a Startup" on the landing page
2. Sign up with email/password
3. Complete onboarding with:
   - Startup name
   - Sector, stage
   - Impact tags (max 5)
   - Metrics
4. View your dashboard with scores

### Create an Investor Account:
1. Click "I'm an Investor" on the landing page
2. Sign up with a different email/password
3. Complete onboarding with:
   - Investor type (Angel/VC)
   - Stage preferences
   - Sector interests
   - Check size range
4. View curated startups (2-5 shown)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError` or import errors
- **Solution:** Make sure virtual environment is activated and dependencies are installed
  ```bash
  pip install -r requirements.txt
  ```

**Problem:** `Address already in use` on port 8000
- **Solution:** Kill the process using port 8000 or change the port:
  ```bash
  uvicorn main:app --reload --port 8001
  ```
  Then update frontend `.env.local` to use port 8001

**Problem:** Database errors
- **Solution:** Delete `backend/signalfund.db` and re-run the database initialization command

### Frontend Issues

**Problem:** `Cannot connect to API` or CORS errors
- **Solution:** 
  1. Ensure backend is running on port 8000
  2. Check `.env.local` has correct API URL
  3. Restart both frontend and backend

**Problem:** `npm install` fails
- **Solution:**
  ```bash
  # Clear npm cache
  npm cache clean --force
  # Delete node_modules and reinstall
  rm -rf node_modules package-lock.json
  npm install
  ```

**Problem:** Port 3000 already in use
- **Solution:** Kill the process or use a different port:
  ```bash
  npm run dev -- -p 3001
  ```

### General Issues

**Problem:** Changes not reflecting
- **Solution:** Restart both servers (Ctrl+C and restart)

**Problem:** Authentication not working
- **Solution:** Clear browser cookies and try again

---

## 📁 Project Structure

```
Imagine cup project/
├── backend/
│   ├── venv/              # Virtual environment (created by you)
│   ├── signalfund.db      # SQLite database (created automatically)
│   ├── .env               # Environment variables (you create this)
│   ├── main.py            # FastAPI app entry point
│   ├── api/               # API routes
│   ├── models/            # Database models
│   ├── services/          # Business logic
│   └── requirements.txt   # Python dependencies
│
├── frontend/
│   ├── node_modules/      # npm packages (created by npm install)
│   ├── .env.local         # Frontend environment (you create this)
│   ├── pages/             # Next.js pages
│   ├── components/        # React components
│   └── package.json       # Node dependencies
│
└── README.md
```

---

## 🔄 Daily Development Workflow

1. **Start Backend:**
   ```bash
   cd backend
   .\venv\Scripts\activate
   uvicorn main:app --reload
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Make changes** - Both servers auto-reload on file changes

4. **Stop servers:** Press `Ctrl+C` in each terminal

---

## 📚 Additional Resources

- **Backend API Docs:** http://localhost:8000/docs
- **Backend Health:** http://localhost:8000/health
- **Frontend:** http://localhost:3000

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Can access API docs at /docs
- [ ] Can create startup account
- [ ] Can create investor account
- [ ] Database file (`signalfund.db`) exists
- [ ] No errors in terminal

---

## 🎯 Next Steps

Once everything is running:

1. Create test accounts (both investor and startup)
2. Add timeline events as a startup
3. Request an introduction as an investor
4. Explore the ecosystem metrics endpoint: `/api/ecosystem/metrics`

Happy coding! 🚀

