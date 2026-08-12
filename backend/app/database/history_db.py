import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# We separate the history database from the user database for scalability and cleaner architecture.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL_HISTORY", "sqlite:///./prediction_history.db")

# check_same_thread is needed only for SQLite
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

HistoryBase = declarative_base()

def get_history_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
