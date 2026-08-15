import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database.history_db import SessionLocal, engine
from app.database.history_models import HistoryBase, PredictionHistory
from app.services.evidence_service import EvidenceService
from app.services.gemini_evidence_service import gemini_evidence_service

async def test_api_key_failure():
    # Setup test DB
    HistoryBase.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Create dummy prediction
    dummy_history = PredictionHistory(
        source_type="text",
        input_text="Maharashtra government has announced free laptops for all college students beginning September 2026.",
        prediction=0,
        category="Fake",
        confidence=0.9
    )
    db.add(dummy_history)
    db.commit()
    db.refresh(dummy_history)
    
    # Try evidence service (will fail if no valid api key, which is expected)
    print("Testing EvidenceService with dummy history_id:", dummy_history.id)
    try:
        result = await EvidenceService.analyze_and_store(db, dummy_history.id)
        print("Result status:", result.get("verification_status"))
        print("Result score:", result.get("evidence_score"))
        assert result.get("verification_status") == "UNVERIFIED"
        print("Test passed: Fallback works gracefully.")
    except Exception as e:
        print("Test failed with exception:", str(e))
    finally:
        db.delete(dummy_history)
        db.commit()
        db.close()

if __name__ == "__main__":
    asyncio.run(test_api_key_failure())
