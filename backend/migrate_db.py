import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "prediction_history.db")

def migrate():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    columns_to_add = [
        ("credibility_score", "REAL"),
        ("risk_level", "TEXT"),
        ("final_assessment", "TEXT"),
        ("signal_relationship", "TEXT")
    ]

    for col_name, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE prediction_history ADD COLUMN {col_name} {col_type}")
            print(f"Successfully added column: {col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"Column already exists: {col_name}")
            else:
                print(f"Error adding {col_name}: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
