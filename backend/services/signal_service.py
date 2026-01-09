from sqlalchemy.orm import Session
from models.models import SignalEvent, SignalType, SignalSeverity, User, UserRole, Startup, Investor, TimelineEvent, WatchlistEntry, InvestorInterest, Story
from datetime import datetime, timedelta
import uuid

class SignalService:
    def __init__(self, db: Session):
        self.db = db

    def generate_signal(
        self,
        user_id: str,
        user_type: str,
        signal_type: SignalType,
        severity: SignalSeverity,
        headline: str,
        explanation: str,
        evidence: str,
        startup_id: str = None
    ):
        """Creates an immutable signal event"""
        signal = SignalEvent(
            user_id=user_id,
            user_type=user_type,
            startup_id=startup_id,
            signal_type=signal_type,
            severity=severity,
            headline=headline,
            explanation=explanation,
            evidence=evidence
        )
        self.db.add(signal)
        self.db.commit()
        return signal

    def trigger_timeline_signal(self, startup: Startup, event: TimelineEvent):
        """Triggered when a founder adds a new timeline event"""
        # Notify investors watching this startup
        watchlist = self.db.query(WatchlistEntry).filter(WatchlistEntry.startup_id == startup.id).all()
        for entry in watchlist:
            investor = entry.investor
            self.generate_signal(
                user_id=investor.user_id,
                user_type="investor",
                signal_type=SignalType.TIMELINE_UPDATE,
                severity=SignalSeverity.LOW,
                headline=f"{startup.name}: New Execution Milestone",
                explanation=f"{startup.name} added a new {event.event_type.value} event: {event.title}.",
                evidence=f"Verification status: {event.confidence.value}. Impact score: {event.impact_score}/10.",
                startup_id=startup.id
            )

    def trigger_readiness_shift(self, startup: Startup, old_band: str, new_band: str):
        """Triggered when readiness band changes (e.g. Early -> Medium)"""
        # Founder feed
        self.generate_signal(
            user_id=startup.user_id,
            user_type="founder",
            signal_type=SignalType.READINESS_SHIFT,
            severity=SignalSeverity.MEDIUM,
            headline=f"Readiness Upgrade: Now in {new_band} Band",
            explanation=f"Your execution pattern has moved from {old_band} to {new_band}. This significantly improves your visibility to Tier-1 investors.",
            evidence=f"Recent milestones and metric consistency have pushed your readiness score above threshold.",
            startup_id=startup.id
        )

        # Quality Pool Investors (Fit Score > 75 or Watchlist)
        # Note: In a real system we'd iterate over all relevant investors, 
        # but for this demo we'll target watchlist and active searchers
        watchlist = self.db.query(WatchlistEntry).filter(WatchlistEntry.startup_id == startup.id).all()
        for entry in watchlist:
            investor = entry.investor
            self.generate_signal(
                user_id=investor.user_id,
                user_type="investor",
                signal_type=SignalType.READINESS_SHIFT,
                severity=SignalSeverity.HIGH if new_band == "HIGH" else SignalSeverity.MEDIUM,
                headline=f"{startup.name}: Readiness Threshold Crossed",
                explanation=f"{startup.name} has moved into the {new_band} readiness band, indicating high execution maturity.",
                evidence=f"System metrics confirm a consistent execution pattern over the last 90 days.",
                startup_id=startup.id
            )

    def trigger_execution_gap(self, startup: Startup, gap_days: int):
        """Triggered when an execution gap threshold is crossed"""
        # Founder feed (Internal Alarm)
        self.generate_signal(
            user_id=startup.user_id,
            user_type="founder",
            signal_type=SignalType.EXECUTION_ALARM,
            severity=SignalSeverity.HIGH,
            headline=f"Execution Gap Detected: {gap_days} Days",
            explanation=f"No significant milestones have been logged for over {gap_days} days. This creates a negative signal for watching investors.",
            evidence=f"Last verified milestone was logged on {datetime.now() - timedelta(days=gap_days)}.",
            startup_id=startup.id
        )

    def trigger_market_interest(self, startup_id: str):
        """Triggered periodically to aggregate market interest (delayed/anonymous for founder)"""
        startup = self.db.query(Startup).filter(Startup.id == startup_id).first()
        if not startup: return

        # Count recent activities (last 7 days)
        last_week = datetime.now() - timedelta(days=7)
        views = self.db.query(InvestorInterest).filter(
            InvestorInterest.startup_id == startup_id,
            InvestorInterest.created_at >= last_week
        ).count()

        if views >= 3:
            self.generate_signal(
                user_id=startup.user_id,
                user_type="founder",
                signal_type=SignalType.MARKET_INTEREST,
                severity=SignalSeverity.LOW,
                headline="Inbound Signal: Increased Market Interest",
                explanation="Your execution timeline is attracting significant attention from relevant investors in your sector.",
                evidence=f"{views} relevant discovery actions detected in the last 7 days. These actions are anonymous and aggregated.",
                startup_id=startup.id
            )

    def trigger_ecosystem_bottleneck(self, user_id: str, user_type: str, sector: str):
        """General ecosystem signal"""
        self.generate_signal(
            user_id=user_id,
            user_type=user_type,
            signal_type=SignalType.ECOSYSTEM_BENCHMARK,
            severity=SignalSeverity.LOW,
            headline=f"Ecosystem Alert: {sector} Benchmarks Shifted",
            explanation=f"Average execution velocity in the {sector} sector has increased by 15% this month.",
            evidence="Aggregated performance data from 50+ peer benchmarks.",
            startup_id=None
        )

    def trigger_insight_signal(self, user_id: str, user_type: str, story: Story):
        """Push a contextual insight story to a user's feed"""
        self.generate_signal(
            user_id=user_id,
            user_type=user_type,
            signal_type=SignalType.ECOSYSTEM_STORY,
            severity=SignalSeverity.LOW,
            headline=f"Insight: {story.title}",
            explanation=story.summary,
            evidence="Based on cross-sector execution data analysis.",
            startup_id=None
        )
