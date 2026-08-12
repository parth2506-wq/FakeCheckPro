import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.history_db import HistoryBase
from app.schemas.history import HistoryCreate
from app.services.history_service import HistoryService
from app.schemas.prediction import ImportantPhrase

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_prediction_history.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture()
def db():
    HistoryBase.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        HistoryBase.metadata.drop_all(bind=engine)

def test_create_and_get_history(db):
    record = HistoryCreate(
        source_type="text",
        title="Test Title",
        input_text="Test input text",
        prediction=0,
        category="Fake",
        confidence=0.99,
        reason="Test reason",
        important_phrases=[ImportantPhrase(phrase="test", contribution=0.5, direction="Fake")]
    )
    
    saved = HistoryService.create_record(db, record)
    assert saved.id is not None
    assert saved.source_type == "text"
    assert saved.category == "Fake"
    
    items, total = HistoryService.get_paginated(db)
    assert total == 1
    assert len(items) == 1
    assert items[0].id == saved.id

def test_delete_history(db):
    record = HistoryCreate(
        source_type="url",
        prediction=1,
        category="Real",
        confidence=0.85,
        reason="Test",
        important_phrases=[]
    )
    saved = HistoryService.create_record(db, record)
    
    assert HistoryService.delete_record(db, saved.id) == True
    assert HistoryService.delete_record(db, 999) == False
    
    items, total = HistoryService.get_paginated(db)
    assert total == 0
