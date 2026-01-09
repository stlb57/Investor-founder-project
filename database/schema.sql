-- SignalFund Database Schema

-- User roles and authentication
CREATE TYPE user_role AS ENUM ('investor', 'startup');
CREATE TYPE event_type AS ENUM ('founder_team', 'product_execution', 'traction', 'capital');
CREATE TYPE confidence_level AS ENUM ('verified', 'self_reported', 'inferred');

-- Users table (role-locked)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investor profiles
CREATE TABLE investors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    stage_focus VARCHAR(100)[], -- ['pre_seed', 'seed', 'series_a']
    sector_focus VARCHAR(100)[], -- ['fintech', 'healthtech', 'b2b_saas']
    check_size_min INTEGER,
    check_size_max INTEGER,
    region VARCHAR(100),
    deal_breakers TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Startup profiles
CREATE TABLE startups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    stage VARCHAR(50),
    founded_date DATE,
    team_size INTEGER,
    revenue_bucket VARCHAR(50), -- '0', '1k-10k', '10k-100k', etc.
    users_bucket VARCHAR(50),   -- '0-100', '100-1k', '1k-10k', etc.
    market_clarity_score INTEGER CHECK (market_clarity_score >= 0 AND market_clarity_score <= 100),
    visibility_locked BOOLEAN DEFAULT FALSE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Startup timeline events
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_type event_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    confidence confidence_level DEFAULT 'self_reported',
    impact_score INTEGER, -- Impact on readiness score (-10 to +10)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Startup readiness scores (historical tracking)
CREATE TABLE readiness_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    confidence_band INTEGER, -- ± range
    execution_score INTEGER,
    traction_score INTEGER,
    market_score INTEGER,
    team_score INTEGER,
    capital_efficiency_score INTEGER,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investor fit scores (private)
CREATE TABLE investor_fit_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    fit_multiplier DECIMAL(3,2) CHECK (fit_multiplier >= 0 AND fit_multiplier <= 1),
    stage_match_score INTEGER,
    sector_match_score INTEGER,
    pattern_similarity_score INTEGER,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(investor_id, startup_id)
);

-- Introduction requests and outcomes
CREATE TABLE introductions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'requested', -- 'requested', 'accepted', 'declined', 'completed'
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    outcome VARCHAR(100), -- 'meeting_scheduled', 'passed', 'invested', etc.
    outcome_notes TEXT
);

-- Investor interest tracking
CREATE TABLE investor_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    action VARCHAR(50), -- 'viewed', 'watched', 'passed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_startups_sector_stage ON startups(sector, stage);
CREATE INDEX idx_timeline_events_startup_date ON timeline_events(startup_id, event_date);
CREATE INDEX idx_readiness_scores_startup_latest ON readiness_scores(startup_id, calculated_at DESC);
CREATE INDEX idx_investor_fit_scores_investor ON investor_fit_scores(investor_id, fit_multiplier DESC);
CREATE INDEX idx_introductions_status ON introductions(status, requested_at);