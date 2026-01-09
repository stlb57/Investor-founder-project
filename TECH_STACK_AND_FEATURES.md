# SignalFund: Comprehensive Tech Stack & Feature Deep-Dive

SignalFund is an advanced decision-support platform for startup venture capital. It moves beyond simple directories, using AI to surface "execution signals" and match investors with startups based on progress rather than just pitch decks.

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: Next.js 14 (App Router & Pages Router hybrid)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS 3.3.6 with a custom "Glassmorphism" design system.
- **Interactions**: Framer Motion (animations), Headless UI (accessible components).
- **Data Visualization**: Recharts (for Discovery Map, Scoring Breakdowns, and Ecosystem Trends).
- **Network**: Axios with interceptors for JWT management.

### Backend Architecture
- **API Framework**: FastAPI 0.100.0+ (Python 3.9+)
- **ORM / Database**: SQLAlchemy 2.0+ with PostgreSQL (Production) and SQLite (Development).
- **Safety / Validation**: Pydantic v2 for strict type checking and API schemas.
- **Security**: JWT-based authentication, password hashing with `bcrypt`, and granular Role-Based Access Control (RBAC).

---

## 📡 Intelligent Signal Feeds

SignalFund replaces the "infinite scroll" with a high-signal notification engine.
- **Primary Signal Feed**: A curated stream of actionable events (e.g., "Execution Alarm", "Market Interest", "Readiness Shift").
- **Investor Feed Rules**: Limited to 10 signals per day to prevent noise; sorted by **Severity** (High/Medium/Low) and **Recency**.
- **Evidence-Based Insights**: Every signal includes a "Headline", "Explanation", and specific "Evidence" (e.g., "3 new product milestones in 14 days").
- **Role-Based Experience**: Founders see internal signals about their own progress and ecosystem benchmarks; Investors see curated signals across their "matched" pool.

## � Constrained Search & Discovery

Unlike open marketplaces, searching is focused on quality and "fit".
- **Multi-Filter Search**: Investors can filter by Sector, Stage, Region, and **Execution Momentum** (Improving ↑, Stable →, Declining ↓).
- **ID & Slug Lookup**: Supports direct lookup via unique UUIDs or SEO-friendly Slugs (exact match bypasses general quality filters).
- **Discovery Map**: A 2D interactive visualization mapping startups based on **Readiness Score** vs. **Momentum Score**.
- **Blind Mode Support**: Search results respect "Blind Screening" settings, hiding identity-cues while preserving data-signals.

## 🧠 Pluggable ML Model Engine

The scoring system is architected as a set of pluggable interfaces, allowing for seamless upgrades from rule-based to ML-driven logic.

1.  **Readiness Model (0-100)**:
    - **v1 (Rule-Based)**: Analyzes timeline density, event diversity, and traction recency.
    - **v2 (Azure ML)**: Uses a hosted Azure ML endpoint for complex pattern recognition (e.g., detecting "execution stalls").
2.  **Investor Fit Model (0.0-1.0)**:
    - Matches startup profile (tags, stage, sector) against investor preferences.
    - Returns a score used strictly for ranking in the investor dashboard (hidden from startups).
3.  **Public Review Model**:
    - Leverages **Azure Cognitive Services** to analyze public sentiment and credibility via website signals and online presence.

## 📖 Storytelling & Insights

SignalFund converts raw data into narratives to help both sides understand the market.
- **Data-Driven Stories (Blogs)**: Long-form insights generated from platform metrics (e.g., "State of HealthTech in Tier-2 Cities").
- **Startup Success Stories**: Highlight-reels of startups that hit specific readiness milestones.
- **Insights Module**: A dedicated section for ecosystem-level analysis and market trends.

## 🔗 Identification & SEO

- **Unique Identifiers**: Every entity (Startup, Investor, Signal, Story) uses persistent UUIDs for database integrity.
- **Slug System**: Automated slug generation for human-readable URLs (e.g., `/startup/solargrid-solutions`) and improved SEO.
- **Testing IDs**: Semantic HTML and unique IDs are used throughout the frontend to facilitate automated browser testing and accessibility.

## ➕ Additional Features
- **Watchlist with Intent**: Investors don't just "star" startups; they log intent (e.g., "Monitoring traction," "Ready to lead").
- **Investor Timeline**: Investors can log their own activities (fund close, new partner join) which triggers signals to matched startups.
- **Responsible AI Dashboard**: A dedicated transparency page detailing how AI scores are calculated and how bias is mitigated.
- **Impact Depth Scoring**: Beyond tags, startups are scored on the "depth" of their social/environmental impact.
