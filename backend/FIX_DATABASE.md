# Fix Database Schema Issue

## Problem
The database is missing columns that were added to the models (e.g., `investors.type`, `startups.impact_depth`, etc.).

## Solution: Recreate Database (Recommended for Local Development)

**Steps:**

1. **Stop the server** (Press `Ctrl+C` in the terminal running uvicorn)

2. **Delete the old database:**
   ```powershell
   # In backend directory
   Remove-Item signalfund.db
   ```

3. **Recreate the database:**
   ```powershell
   python -c "from db.database import engine; from models.models import Base; Base.metadata.create_all(bind=engine)"
   ```

4. **Restart the server:**
   ```powershell
   uvicorn main:app --reload
   ```

## Alternative: Use Migration Script

If you have important data you want to keep, you can try the migration script:

```powershell
python migrate_database.py
```

**Note:** SQLite has limited ALTER TABLE support, so some migrations might fail. For local development, recreating the database is recommended.



