import sqlite3

def patch_db():
    conn = sqlite3.connect('signalfund_v2.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE timeline_events ADD COLUMN investor_id VARCHAR")
        print("Successfully added investor_id to timeline_events")
    except Exception as e:
        print(f"Error or already exists: {e}")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    patch_db()
