from db.database import engine
from models import models

def create_signal_table():
    print("Creating signal_events table...")
    models.Base.metadata.create_all(bind=engine, tables=[models.SignalEvent.__table__])
    print("Done.")

if __name__ == "__main__":
    create_signal_table()
