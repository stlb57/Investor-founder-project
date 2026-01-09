import sqlite3
import os

db_path = "signalfund_v2.db"

if not os.path.exists(db_path):
    print(f"Database {db_path} does not exist!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check current schema
cursor.execute("PRAGMA table_info(investors)")
columns = cursor.fetchall()
print("Current columns in investors table:")
for col in columns:
    print(f"  - {col[1]} ({col[2]})")

# Check if investor_type exists
has_investor_type = any(col[1] == 'investor_type' for col in columns)

if not has_investor_type:
    print("\nAdding investor_type column...")
    try:
        cursor.execute("ALTER TABLE investors ADD COLUMN investor_type TEXT")
        conn.commit()
        print("✅ Column added successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
else:
    print("\n✅ investor_type column already exists!")

conn.close()
