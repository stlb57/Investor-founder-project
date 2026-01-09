import sqlite3
import os

def patch():
    db_path = 'signalfund_v2.db'
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS signal_events (
                id VARCHAR PRIMARY KEY,
                user_id VARCHAR NOT NULL,
                user_type VARCHAR(20) NOT NULL,
                startup_id VARCHAR,
                signal_type VARCHAR NOT NULL,
                headline VARCHAR(255) NOT NULL,
                explanation TEXT,
                evidence TEXT,
                severity VARCHAR NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(startup_id) REFERENCES startups(id) ON DELETE CASCADE
            )
        """)
        print("Table signal_events created successfully")
    except Exception as e:
        print(f"Error creating table: {e}")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    patch()
