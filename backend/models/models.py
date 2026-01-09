import enum
import json
import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Enum, Text, Date, DateTime, Float, func
from sqlalchemy.orm import relationship
from db.database import Base

# Enums
class UserRole(str, enum.Enum):
    INVESTOR = "INVESTOR"
    STARTUP = "STARTUP"

class InvestorType(str, enum.Enum):
    VC = "vc"
    ANGEL = "angel"
    ACCELERATOR = "accelerator"
    CVC = "cvc"
    FAMILY_OFFICE = "family_office"
    PE = "pe"
    OTHER = "other"

class ImpactDepth(str, enum.Enum):
    SURFACE = "surface"
    INTEGRATED = "integrated"
    CORE = "core"

class ReadinessBand(str, enum.Enum):
    EARLY = "EARLY"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class VisibilityStatus(str, enum.Enum):
    HIDDEN = "HIDDEN"
    VISIBLE = "VISIBLE"
    LOCKED = "LOCKED"

class EventType(str, enum.Enum):
    MILESTONE = "MILESTONE"
    PIVOT = "PIVOT"
    FUNDING = "FUNDING"
    TEAM = "TEAM"
    PRODUCT = "PRODUCT"
    INVESTMENT = "INVESTMENT"
    EXIT = "EXIT"
    ADVISORY = "ADVISORY"

class ConfidenceLevel(str, enum.Enum):
    SELF_REPORTED = "SELF_REPORTED"
    VERIFIED = "VERIFIED"
    AUDITED = "AUDITED"

class IntroductionStatus(str, enum.Enum):
    REQUESTED = "requested"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    EXPIRED = "expired"

class IntroductionOutcome(str, enum.Enum):
    VIBE_CHECK = "vibe_check"
    DEEP_DIVE = "deep_dive"
    PASSED = "passed"
    TERM_SHEET = "term_sheet"
    GHOSTED = "ghosted"

class WatchIntent(str, enum.Enum):
    EXECUTION = "tracking_execution"
    MILESTONE = "waiting_for_milestone"
    MARKET = "monitoring_market"
    GENERAL = "general_interest"

class PassReason(str, enum.Enum):
    TEAM = "team"
    MARKET = "market"
    TRACTION = "traction"
    PRODUCT = "product"
    VALUATION = "valuation"
    TIMING = "timing"
    OTHER = "other"

class SignalType(str, enum.Enum):
    TIMELINE_UPDATE = "TIMELINE_UPDATE"
    READINESS_SHIFT = "READINESS_SHIFT"
    MOMENTUM_CHANGE = "MOMENTUM_CHANGE"
    EXECUTION_ALARM = "EXECUTION_ALARM"
    MARKET_INTEREST = "MARKET_INTEREST"
    ECOSYSTEM_BENCHMARK = "ECOSYSTEM_BENCHMARK"
    ECOSYSTEM_STORY = "ECOSYSTEM_STORY"

class SignalSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class StoryType(str, enum.Enum):
    DECISION_STORY = "decision_story"
    ECOSYSTEM_INSIGHT = "ecosystem_insight"
    CUSTOMER_STORY = "customer_story"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    investor = relationship("Investor", back_populates="user", uselist=False)
    startup = relationship("Startup", back_populates="user", uselist=False)

class Investor(Base):
    __tablename__ = "investors"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(255), nullable=False)
    firm_name = Column(String(255))
    investor_type = Column(Enum(InvestorType))
    stage_focus = Column(Text)  # JSON array
    sector_focus = Column(Text)  # JSON array
    region_focus = Column(Text)  # JSON array - geographic preferences
    check_size_min = Column(Integer)
    check_size_max = Column(Integer)
    investment_thesis = Column(Text)  # Free-text thesis description
    portfolio_companies = Column(Text)  # JSON array of past investments
    thesis_embedding = Column(Text)  # JSON vector
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="investor")
    fit_scores = relationship("InvestorFitScore", back_populates="investor")
    introductions = relationship("Introduction", back_populates="investor")
    interests = relationship("InvestorInterest", back_populates="investor")
    profile_views = relationship("ProfileView", back_populates="investor")
    watchlist = relationship("WatchlistEntry", back_populates="investor")
    timeline_events = relationship("TimelineEvent", back_populates="investor")

class Startup(Base):
    __tablename__ = "startups"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    
    # Section 1: Basic Startup Profile
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True)
    sector = Column(String(100))
    stage = Column(String(50))
    region = Column(String(100))  # Country/Region
    location = Column(String(100))  # City
    description = Column(Text)  # Short description
    founded_date = Column(Date)
    is_incorporated = Column(Boolean, default=False)
    impact_tags = Column(Text)  # JSON array (max 5)
    impact_depth = Column(Enum(ImpactDepth))  # surface/integrated/core
    website_url = Column(String(500))
    team_size = Column(String(50))  # e.g., "1-2", "3-5", etc.
    
    # Section 2: Founder Execution Signals
    founder_role = Column(String(100))  # CEO, CTO, etc.
    time_commitment = Column(String(20))  # "full_time" or "part_time"
    prev_startup_exp = Column(Boolean)  # Previous startup experience
    experience_years = Column(String(20))  # "0-2", "3-5", "6-10", "10+"
    cofounder_count = Column(Integer, default=0)
    
    # Section 3: Product/Solution (stored as extended description)
    product_description = Column(Text)  # Detailed product description
    
    # Section 4: Traction (Range-Based)
    mau_range = Column(String(50))  # Monthly Active Users range
    user_growth_rate = Column(String(50))  # Growth rate range
    revenue_status = Column(String(50))  # "pre_revenue", "early_revenue", etc.
    revenue_range = Column(String(50))  # Monthly revenue range
    retention_level = Column(String(20))  # "low", "medium", "high"
    
    # Section 5: Market & Business
    customer_type = Column(String(10))  # "B2B" or "B2C"
    market_size = Column(String(20))  # "small", "medium", "large"
    monetization_model = Column(String(100))  # subscription, freemium, etc.
    competition_level = Column(String(20))  # "low", "medium", "high"
    
    # Section 6: Roadmap & Intent
    next_milestone = Column(Text)  # Next 30-60 day milestone
    current_bottleneck = Column(String(100))  # Main challenge
    fundraising_intent = Column(Boolean, default=False)
    target_raise_stage = Column(String(50))  # "angel", "seed", etc.
    
    # Legacy/Computed fields
    metrics = Column(Text)  # JSON: backward compatibility
    readiness_score = Column(Integer)  # 0-100, cached
    readiness_band = Column(Enum(ReadinessBand))  # Early/Medium/High
    public_review_score = Column(Integer)  # 0-100
    confidence_level = Column(String(50))  # Low/Medium/High
    
    # Detailed readiness sub-scores
    execution_score = Column(Integer)  # 0-100
    traction_score = Column(Integer)  # 0-100
    market_score = Column(Integer)  # 0-100
    team_score = Column(Integer)  # 0-100
    capital_efficiency_score = Column(Integer)  # 0-100
    
    visibility_status = Column(Enum(VisibilityStatus), default=VisibilityStatus.HIDDEN)
    last_activity = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="startup")
    timeline_events = relationship("TimelineEvent", back_populates="startup")
    readiness_scores = relationship("ReadinessScore", back_populates="startup")
    fit_scores = relationship("InvestorFitScore", back_populates="startup")
    introductions = relationship("Introduction", back_populates="startup")
    interests = relationship("InvestorInterest", back_populates="startup")
    profile_views = relationship("ProfileView", back_populates="startup")
    watchlist_entries = relationship("WatchlistEntry", back_populates="startup")
    signal_events = relationship("SignalEvent", back_populates="startup")

class SignalEvent(Base):
    __tablename__ = "signal_events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user_type = Column(String(20), nullable=False) # investor / founder
    startup_id = Column(String, ForeignKey("startups.id", ondelete="CASCADE"), nullable=True)
    signal_type = Column(Enum(SignalType), nullable=False)
    headline = Column(String(255), nullable=False)
    explanation = Column(Text)
    evidence = Column(Text)
    severity = Column(Enum(SignalSeverity), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User")
    startup = relationship("Startup", back_populates="signal_events")

class Story(Base):
    __tablename__ = "stories"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    type = Column(Enum(StoryType), nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False) # JSON structure for blocks
    related_tags = Column(Text) # JSON array
    created_at = Column(DateTime, server_default=func.now())

class TimelineEvent(Base):
    __tablename__ = "timeline_events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    startup_id = Column(String, ForeignKey("startups.id", ondelete="CASCADE"), nullable=True)
    investor_id = Column(String, ForeignKey("investors.id", ondelete="CASCADE"), nullable=True)

    event_date = Column(Date, nullable=False)
    event_type = Column(Enum(EventType), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    confidence = Column(Enum(ConfidenceLevel), default=ConfidenceLevel.SELF_REPORTED)
    impact_score = Column(Integer)  # -10 to +10
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    startup = relationship("Startup", back_populates="timeline_events")
    investor = relationship("Investor", back_populates="timeline_events")

class ReadinessScore(Base):
    __tablename__ = "readiness_scores"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    startup_id = Column(String, ForeignKey("startups.id", ondelete="CASCADE"))
    score = Column(Integer)  # 0-100
    confidence_band = Column(Integer)  # ± range
    execution_score = Column(Integer)
    traction_score = Column(Integer)
    market_score = Column(Integer)
    team_score = Column(Integer)
    capital_efficiency_score = Column(Integer)
    calculated_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    startup = relationship("Startup", back_populates="readiness_scores")

class InvestorFitScore(Base):
    __tablename__ = "investor_fit_scores"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    investor_id = Column(String, ForeignKey("investors.id", ondelete="CASCADE"))
    startup_id = Column(String, ForeignKey("startups.id", ondelete="CASCADE"))
    fit_multiplier = Column(String)  # Store as string for SQLite
    stage_match_score = Column(Integer)
    sector_match_score = Column(Integer)
    pattern_similarity_score = Column(Integer)
    calculated_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    investor = relationship("Investor", back_populates="fit_scores")
    startup = relationship("Startup", back_populates="fit_scores")

class Introduction(Base):
    __tablename__ = "introductions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    investor_id = Column(String, ForeignKey("investors.id", ondelete="CASCADE"))
    startup_id = Column(String, ForeignKey("startups.id", ondelete="CASCADE"))
    status = Column(Enum(IntroductionStatus), default=IntroductionStatus.REQUESTED)
    intro_message = Column(Text)  # Single message from investor to startup (no back-and-forth)
    requested_at = Column(DateTime, server_default=func.now())
    responded_at = Column(DateTime)
    outcome = Column(Enum(IntroductionOutcome))
    outcome_notes = Column(Text)
    
    # Relationships
    investor = relationship("Investor", back_populates="introductions")
    startup = relationship("Startup", back_populates="introductions")

class InvestorInterest(Base):
    __tablename__ = "investor_interests"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    investor_id = Column(String, ForeignKey("investors.id", ondelete="CASCADE"))
    startup_id = Column(String, ForeignKey("startups.id", ondelete="CASCADE"))
    action = Column(String(50))  # 'viewed', 'watched', 'passed'
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    investor = relationship("Investor", back_populates="interests")
    startup = relationship("Startup", back_populates="interests")

class ProfileView(Base):
    __tablename__ = "profile_views"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    investor_id = Column(String, ForeignKey("investors.id", ondelete="CASCADE"))
    startup_id = Column(String, ForeignKey("startups.id", ondelete="CASCADE"))
    view_type = Column(String(50)) # 'card', 'full_profile'
    viewed_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    investor = relationship("Investor", back_populates="profile_views")
    startup = relationship("Startup", back_populates="profile_views")

class WatchlistEntry(Base):
    __tablename__ = "watchlist_entries"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    investor_id = Column(String, ForeignKey("investors.id", ondelete="CASCADE"))
    startup_id = Column(String, ForeignKey("startups.id", ondelete="CASCADE"))
    intent = Column(Enum(WatchIntent), default=WatchIntent.EXECUTION)
    added_at = Column(DateTime, server_default=func.now())
    notes = Column(Text)
    
    # Relationships
    investor = relationship("Investor", back_populates="watchlist")
    startup = relationship("Startup", back_populates="watchlist_entries")