# ScaleX - AI Decision Support for Startup Funding

ScaleX (formerly SignalFund) is a decision-support platform that transforms startup investing. It connects Execution-Ready Startups with Alignment-Focused Investors using explainable AI, moving beyond static pitch decks to dynamic execution signals.

![ScaleX Architecture](https://via.placeholder.com/800x400?text=ScaleX+Platform+Architecture)

## 🎯 Core Philosophy

1.  **Investors have the leverage** - They see thousands of deals; our job is to filter noise.
2.  **Startups need a voice** - But only when they have real progress to show.
3.  **No infinite feeds** - We curate 2-5 high-signal startups per investor, per week.
4.  **Progress > Storytelling** - We score based on verified timeline events, not just pitch decks.
5.  **Explainable AI** - No black boxes. Every score comes with a clear "Why".

---

## 🚀 Key Features

### For Startups (The "Execution" Engine)
*   **Dynamic Dashboard**: Real-time view of your investability.
*   **Startup Readiness Score (0-100)**: AI-driven score analyzing your team, traction, and velocity.
*   **Public Review Score**: Automated credibility check using **Gemini** & **Groq** to analyze your digital footprint (Website, GitHub, News).
*   **Timeline Manager**: Log key events (Product Launch, Key Hire, Revenue) to boost your score instantly.
*   **Impact Tags**: Highlight your social/environmental focus (Climate Tech, healthcare, etc.).

### For Investors (The "Signal" Engine)
*   **Curated Feed**: No more doom-scrolling. See only startups that match your thesis *and* meet execution thresholds.
*   **Blind Screening Mode**: Remove bias by hiding names and backgrounds until you click "Interested".
*   **Deep Dive View**: See a startup's entire journey, risks, and public sentiment analysis in one page.
*   **Introduction Flow**: Request intros with one click; startups accept only if there's mutual interest.

---

## 🧠 AI & Machine Learning Stack

ScaleX leverages a pluggable AI architecture to ensure flexibility and accuracy:

1.  **Startup Readiness Model (Model 1)**
    *   **Type**: Regression / Rules-Based Hybrid
    *   **Function**: Analyzes timeline density, team composition, and financial traction.
    *   **Output**: 0-100 Investability Score.

2.  **Investor Fit Model (Model 2)**
    *   **Type**: Classification / Matching
    *   **Function**: Matches startup attributes (Sector, Stage, Ticket Size) to investor thesis.
    *   **Output**: Compatibility Score (Hidden from startups).

3.  **Public Review Model (Model 3) - *Now Live!***
    *   **powered by**: **Google Gemini** & **Groq** (Llama-3)
    *   **Function**: Scrapes and analyzes external data (Website URL, Public Articles, GitHub, App Store).
    *   **Output**: Sentiment Analysis, Risk Flagging, and Credibility Score.

---

## 🛠️ Technology Stack

### Backend
*   **Framework**: FastAPI (Python 3.10+)
*   **Database**: PostgreSQL (Production) / SQLite (Dev)
*   **Auth**: JWT & RBAC (Role-Based Access Control)
*   **AI Integration**: `google-genai`, `groq` SDKs

### Frontend
*   **Framework**: Next.js 14
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (Glassmorphism Design System)
*   **State**: React Hooks & Context

### Infrastructure (Azure)
*   **Web App**: Azure App Service (Python Linux)
*   **Frontend**: Azure Static Web Apps
*   **Database**: Azure Database for PostgreSQL (Flexible Server)
*   **CI/CD**: GitHub Actions (Auto-deploy on push)

---

## 📁 Project Structure

```
ScaleX/
├── backend/              # FastAPI Python Backend
│   ├── api/             # API Routes & Endpoints
│   ├── ml/              # AI Models (Gemini/Groq integration)
│   ├── services/        # Business Logic
│   └── main.py          # App Entrypoint
├── frontend/            # Next.js Frontend
│   ├── components/      # Reusable UI Components
│   ├── pages/           # Application Routes
│   └── styles/          # Tailwind & Global CSS
└── database/            # Database Schemas & Migrations
```

---

## 🚀 Quick Start (Local Dev)

1.  **Clone the repo**
    ```bash
    git clone https://github.com/stlb57/Investor-founder-project.git
    cd Investor-founder-project
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env      # Add your GEMINI_API_KEY and GROQ_API_KEY
    uvicorn main:app --reload
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Visit**: `http://localhost:3000`

---

## 🤝 Contributing

Built for the **Microsoft Imagine Cup**.
*   **Design**: Premium, Glassmorphism-inspired UI.
*   **Code**: Strict typing, clean architecture.
*   **AI**: Responsible, pluggable, and transparent.

---

## 📄 License
Copyright 2024 ScaleX
