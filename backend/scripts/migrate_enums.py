import sqlite3

db_path = 'signalfund_v2.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Update VisibilityStatus
    cursor.execute("UPDATE startups SET visibility_status = 'VISIBLE' WHERE visibility_status = 'visible'")
    cursor.execute("UPDATE startups SET visibility_status = 'HIDDEN' WHERE visibility_status = 'hidden'")
    cursor.execute("UPDATE startups SET visibility_status = 'LOCKED' WHERE visibility_status = 'locked'")
    print(f"Updated VisibilityStatus in startups: {cursor.rowcount} rows affected")

    # Update EventType
    cursor.execute("UPDATE timeline_events SET event_type = 'MILESTONE' WHERE event_type = 'milestone'")
    cursor.execute("UPDATE timeline_events SET event_type = 'PIVOT' WHERE event_type = 'pivot'")
    cursor.execute("UPDATE timeline_events SET event_type = 'FUNDING' WHERE event_type = 'funding'")
    cursor.execute("UPDATE timeline_events SET event_type = 'TEAM' WHERE event_type = 'team'")
    cursor.execute("UPDATE timeline_events SET event_type = 'PRODUCT' WHERE event_type = 'product'")
    print(f"Updated EventType in timeline_events: {cursor.rowcount} rows affected")

    # Update ConfidenceLevel
    cursor.execute("UPDATE timeline_events SET confidence = 'SELF_REPORTED' WHERE confidence = 'self_reported'")
    cursor.execute("UPDATE timeline_events SET confidence = 'VERIFIED' WHERE confidence = 'verified'")
    cursor.execute("UPDATE timeline_events SET confidence = 'AUDITED' WHERE confidence = 'audited'")
    print(f"Updated ConfidenceLevel in timeline_events: {cursor.rowcount} rows affected")

    conn.commit()
    print("Database migration to uppercase enums complete.")
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
finally:
    conn.close()
