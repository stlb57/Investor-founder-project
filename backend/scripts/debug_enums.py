import sqlite3

def check():
    db_path = 'signalfund_v2.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("--- Signal Events Types ---")
    cursor.execute("SELECT DISTINCT signal_type FROM signal_events")
    print(cursor.fetchall())
    
    print("\n--- Signal Severities ---")
    cursor.execute("SELECT DISTINCT severity FROM signal_events")
    print(cursor.fetchall())
    
    conn.close()

if __name__ == "__main__":
    check()
