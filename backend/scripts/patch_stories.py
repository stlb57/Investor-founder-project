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
            CREATE TABLE IF NOT EXISTS stories (
                id VARCHAR PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                type VARCHAR NOT NULL,
                summary TEXT NOT NULL,
                content TEXT NOT NULL,
                related_tags TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("Table stories created successfully")
    except Exception as e:
        print(f"Error creating table: {e}")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    patch()
