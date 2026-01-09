import sqlite3
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

db_path = 'signalfund_v2.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Get all startups
    cursor.execute("SELECT id, name, slug FROM startups")
    rows = cursor.fetchall()
    
    for row_id, name, current_slug in rows:
        if not current_slug or current_slug == '':
            new_slug = slugify(name)
            
            # Check for uniqueness
            cursor.execute("SELECT id FROM startups WHERE slug = ? AND id != ?", (new_slug, row_id))
            if cursor.fetchone():
                new_slug = f"{new_slug}-{row_id[:4]}"
            
            cursor.execute("UPDATE startups SET slug = ? WHERE id = ?", (new_slug, row_id))
            print(f"Updated '{name}' -> slug: '{new_slug}'")
            
            # Special case for Acnecorp
            if name == 'Acnecorp':
                cursor.execute("UPDATE startups SET visibility_status = 'visible' WHERE id = ?", (row_id,))
                print("Set Acnecorp visibility to visible")

    conn.commit()
    print("Database update complete.")
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
finally:
    conn.close()
